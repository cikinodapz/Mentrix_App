"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, BrainCircuit } from "lucide-react";

// Tipe untuk hasil kuesioner
interface AssessmentResult {
  message: string;
  result: {
    riskLevel: string;
    probability: {
      "Tidak Depresi": number;
      Depresi: number;
    };
    recommendation: string;
  };
}

export default function AssessmentForm({
  onComplete,
  onCancel,
}: {
  onComplete?: (result: AssessmentResult) => void;
  onCancel?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [showResultPopup, setShowResultPopup] = useState(false);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);

  const router = useRouter();

  // Load saved progress and token when component mounts
  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Load saved progress if available
    const savedProgress = localStorage.getItem("assessmentProgress");
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setAnswers(parsedProgress);
      } catch (err) {
        console.error("Failed to parse saved progress:", err);
      }
    }
  }, []);

  // Definisikan pertanyaan sesuai dengan input API
  const questions = [
    {
      id: "gender",
      question: "What is your gender?",
      type: "radio",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
    },
    {
      id: "age",
      question: "What is your age?",
      type: "input", // Ubah dari "select" menjadi "input"
      placeholder: "Enter your age",
      min: 0,
      max: 100
    },
    
    {
      id: "academicPressure",
      question: "How would you rate your academic pressure (0-5)?",
      type: "slider",
      min: 0,
      max: 5,
      step: 1,
      labels: {
        0: "None",
        5: "Extreme",
      },
    },
    {
      id: "workPressure",
      question: "How would you rate your work pressure (0-5)?",
      type: "slider",
      min: 0,
      max: 5,
      step: 1,
      labels: {
        0: "None",
        5: "Extreme",
      },
    },
    {
      id: "cgpa",
      question: "What is your CGPA (0-10)?",
      type: "slider",
      min: 0,
      max: 10,
      step: 1,
      labels: {
        0: "Failed",
        5: "Average",
        10: "Excellent"
      },
    },
    {
      id: "studySatisfaction",
      question: "How satisfied are you with your studies (0-5)?",
      type: "slider",
      min: 0,
      max: 5,
      step: 1,
      labels: {
        0: "Not satisfied",
        5: "Very satisfied",
      },
    },
    {
      id: "jobSatisfaction",
      question: "How satisfied are you with your job (0-5)?",
      type: "slider",
      min: 0,
      max: 5,
      step: 1,
      labels: {
        0: "Not satisfied",
        5: "Very satisfied",
      },
    },
    {
      id: "sleepDuration",
      question: "How many hours do you sleep on average per night?",
      type: "radio",
      options: [
        { value: "Less than 5 hours", label: "Less than 5 hours" },
        { value: "5-6 hours", label: "5-6 hours" },
        { value: "7-8 hours", label: "7-8 hours" },
        { value: "More than 8 hours", label: "More than 8 hours" },
        { value: "Others", label: "Others" },
      ],
    },
    {
      id: "dietaryHabits",
      question: "How would you describe your dietary habits?",
      type: "radio",
      options: [
        { value: "Healthy", label: "Healthy" },
        { value: "Moderate", label: "Moderate" },
        { value: "Unhealthy", label: "Unhealthy" },
        { value: "Others", label: "Others" },
      ],
    },
    {
      id: "suicidalThoughts",
      question: "Have you ever had suicidal thoughts?",
      type: "radio",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
    {
      id: "workStudyHours",
      question: "How many hours do you work or study per day on average?",
      type: "slider",
      min: 0,
      max: 12,
      step: 1,
      labels: {
        0: "0 hours",
        6: "6 hours",
        12: "12 hours",
      },
    },
    {
      id: "financialStress",
      question: "How would you rate your financial stress (0-5)?",
      type: "slider",
      min: 0,
      max: 5,
      step: 1,
      labels: {
        0: "None",
        5: "Extreme",
      },
    },
    {
      id: "familyHistory",
      question: "Do you have a family history of mental illness?",
      type: "radio",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      setError(null);

      try {
        // Check if we have a token
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        // Create a new instance of axios for this request to ensure fresh headers
        const api = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        const response = await api.post("/user/questionnaire", {
          gender: answers["gender"],
          age: parseFloat(answers["age"]),
          academicPressure: parseFloat(answers["academicPressure"]),
          workPressure: parseFloat(answers["workPressure"]),
          cgpa: parseFloat(answers["cgpa"]),
          studySatisfaction: parseFloat(answers["studySatisfaction"]),
          jobSatisfaction: parseFloat(answers["jobSatisfaction"]),
          sleepDuration: answers["sleepDuration"],
          dietaryHabits: answers["dietaryHabits"],
          suicidalThoughts: answers["suicidalThoughts"],
          workStudyHours: parseFloat(answers["workStudyHours"]),
          financialStress: parseFloat(answers["financialStress"]),
          familyHistory: answers["familyHistory"],
        });

        console.log("Response dari API:", response.data);

        if (!response.data || !response.data.result) {
          throw new Error("Response dari API tidak lengkap");
        }

        // Simpan hasil assessment dan tampilkan popup
        setAssessmentResult(response.data);
        setShowResultPopup(true);

        // Clear saved progress after successful submission
        localStorage.removeItem("assessmentProgress");

        // Panggil onComplete jika tersedia
        if (onComplete) {
          onComplete(response.data);
        }
      } catch (error: any) {
        console.error("Gagal mengirim data ke API:", error);
        setError(
          error.message || "Terjadi kesalahan saat mengirim data ke server"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Panggil onCancel jika tersedia
      if (onCancel && typeof onCancel === "function") {
        onCancel();
      } else {
        console.warn("onCancel tidak tersedia atau bukan fungsi");
        // Fallback behavior jika tidak ada callback
        window.history.back();
      }
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simpan progress ke localStorage
    localStorage.setItem("assessmentProgress", JSON.stringify(answers));
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const isNextDisabled =
    answers[currentQuestion.id] === undefined || isSubmitting;

  const renderQuestion = () => {
    const question = currentQuestion;

    if (question.type === "radio") {
      return (
        <RadioGroup
          value={answers[question.id] || ""}
          onValueChange={handleAnswerChange}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rounded-lg border border-purple-500/20 p-3 hover:bg-white/5 transition-colors"
            >
              <RadioGroupItem
                value={option.value}
                id={`option-${question.id}-${option.value}`}
                className="border-purple-500"
              />
              <Label
                htmlFor={`option-${question.id}-${option.value}`}
                className="flex-1 cursor-pointer text-white"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === "slider") {
      const value =
        answers[question.id] !== undefined
          ? [answers[question.id]]
          : [question.min];

      return (
        <div className="space-y-6">
          <Slider
            value={value}
            min={question.min}
            max={question.max}
            step={question.step}
            onValueChange={(value) => handleAnswerChange(value[0])}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-purple-200">
            {Object.entries(question.labels).map(([value, label]) => (
              <div key={value} className="text-center">
                <div className="text-xl font-bold text-white">{value}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-2xl font-bold text-white">
            {answers[question.id] !== undefined
              ? answers[question.id]
              : question.min}
          </div>
        </div>
      );
    }

    if (question.type === "input") {
      return (
        <div className="space-y-2">
          <input
            type="number"
            value={answers[question.id] || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              // Validasi range umur
              if (value >= question.min && value <= question.max) {
                handleAnswerChange(value.toString());
              } else if (e.target.value === "") {
                handleAnswerChange("");
              }
            }}
            placeholder={question.placeholder}
            min={question.min}
            max={question.max}
            className="w-full p-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {answers[question.id] && (
            <p className="text-sm text-purple-200">
              Age: {answers[question.id]} years
            </p>
          )}
        </div>
      );
    }

    if (question.type === "select") {
      return (
        <Select
          onValueChange={handleAnswerChange}
          value={answers[question.id] || ""}
        >
          <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-8 flex flex-col"
    >
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Depression Assessment
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Progress"}
        </Button>
      </header>

      <div className="w-full h-2 bg-purple-900/30 rounded-full mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <Card className="flex-1 backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            Question {currentStep + 1} of {totalSteps}
          </CardTitle>
          <CardDescription className="text-purple-200">
            Please answer honestly for the most accurate assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-medium text-white">
                {currentQuestion.question}
              </h2>
              {renderQuestion()}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? "Cancel" : "Previous"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isSubmitting
              ? "Submitting..."
              : currentStep === totalSteps - 1
              ? "Complete"
              : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
      {showResultPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">
                Assessment Result
              </h3>
              <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
            </div>

            {assessmentResult && (
              <div className="space-y-4 text-white">
                <div>
                  <p className="text-sm text-purple-200">Risk Level</p>
                  <p className="text-lg font-medium capitalize">
                    {assessmentResult.result.riskLevel.toLowerCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-purple-200">Probability</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-white/5 p-2 rounded">
                      <p className="text-xs text-purple-200">Tidak Depresi</p>
                      <p className="text-lg font-bold text-green-400">
                        {(
                          assessmentResult.result.probability["Tidak Depresi"] *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <p className="text-xs text-purple-200">Depresi</p>
                      <p className="text-lg font-bold text-amber-400">
                        {(
                          assessmentResult.result.probability.Depresi * 100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-purple-200">Recommendation</p>
                  <p className="text-sm">
                    {assessmentResult.result.recommendation}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                OK
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}