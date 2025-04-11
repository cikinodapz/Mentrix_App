"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BrainCircuit,
  ChevronLeft,
  LineChartIcon,
  LoaderIcon,
  ClipboardIcon,
  Clock,
  XCircle,
  Calendar,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  User,
  Moon,
  Coffee,
  Brain,
  Zap,
  HeartPulse,
  Hourglass,
  DollarSign,
  Dna,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jsPDF } from "jspdf";

// Konfigurasi Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface untuk data prediction history
interface PredictionHistory {
  id: string;
  date: string;
  riskLevel: string;
  probability: {
    "Tidak Depresi": number;
    Depresi: number;
  };
  details: {
    gender: string;
    age: number;
    academicPressure: number;
    workPressure: number;
    cgpa: number;
    studySatisfaction: number;
    jobSatisfaction: number;
    sleepDuration: string;
    dietaryHabits: string;
    suicidalThoughts: string;
    workStudyHours: number;
    financialStress: number;
    familyHistory: string;
  };
}

export default function PredictionHistoryPage() {
  const [predictionHistory, setPredictionHistory] = useState<
    PredictionHistory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] =
    useState<PredictionHistory | null>(null);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const itemsPerPage = 7; // Limit to 7 items per page

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      router.push("/"); // Redirect ke login jika tidak ada token
      return;
    }

    const fetchPredictionHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/prediction-history");
        setPredictionHistory(response.data.data);
      } catch (error) {
        console.error("Failed to fetch prediction history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictionHistory();
  }, [router]);

  const handleBack = () => {
    router.push("/dashboard");
  };

  // Pagination calculations
  const totalPages = Math.ceil(predictionHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = predictionHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper untuk menampilkan icon berdasarkan detail
  const getDetailIcon = (key: string) => {
    const icons: Record<string, JSX.Element> = {
      gender: <User className="w-5 h-5 text-indigo-300" />,
      age: <Calendar className="w-5 h-5 text-emerald-300" />,
      academicPressure: <Brain className="w-5 h-5 text-amber-300" />,
      workPressure: <Zap className="w-5 h-5 text-red-300" />,
      cgpa: <Hourglass className="w-5 h-5 text-purple-300" />,
      studySatisfaction: <HeartPulse className="w-5 h-5 text-pink-300" />,
      jobSatisfaction: <ShieldCheck className="w-5 h-5 text-sky-300" />,
      sleepDuration: <Moon className="w-5 h-5 text-indigo-300" />,
      dietaryHabits: <Coffee className="w-5 h-5 text-yellow-300" />,
      suicidalThoughts: <AlertCircle className="w-5 h-5 text-red-300" />,
      workStudyHours: <Clock className="w-5 h-5 text-green-300" />,
      financialStress: <DollarSign className="w-5 h-5 text-emerald-300" />,
      familyHistory: <Dna className="w-5 h-5 text-violet-300" />,
    };

    return icons[key] || <ChevronRight className="w-5 h-5 text-white" />;
  };

  // Fungsi untuk mendapatkan label yang lebih baik
  const getDetailLabel = (key: string): string => {
    const labels: Record<string, string> = {
      gender: "Gender",
      age: "Age",
      academicPressure: "Academic Pressure",
      workPressure: "Work Pressure",
      cgpa: "CGPA",
      studySatisfaction: "Study Satisfaction",
      jobSatisfaction: "Job Satisfaction",
      sleepDuration: "Sleep Duration",
      dietaryHabits: "Dietary Habits",
      suicidalThoughts: "Suicidal Thoughts",
      workStudyHours: "Work/Study Hours",
      financialStress: "Financial Stress",
      familyHistory: "Family History",
    };

    return labels[key] || key.replace(/([A-Z])/g, " $1").trim();
  };

  //doc.addImage(img, "PNG", 10, 7, 30, 30);

  const downloadAsPDF = (assessment: PredictionHistory) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Background header
      doc.setFillColor(245, 243, 255); // Tetap light background
      doc.rect(0, 0, 210, 40, "F");

      // Logo
      const logoUrl = "/Logo2_nobg.png";
      const img = new Image();
      img.src = logoUrl;
      doc.addImage(img, "PNG", 10, 7, 30, 30);

      // Header title
      doc.setTextColor(0, 48, 73); // Navy blue
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Mental Health Assessment", 40, 20);

      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // Gray
      doc.setFont("helvetica", "normal");
      doc.text("Confidential Report", 40, 28);

      // Date box
      const formattedDate = new Date(assessment.date).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      doc.setFillColor(241, 245, 249);
      doc.rect(150, 15, 50, 10, "F");
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.text(formattedDate, 152, 21);

      // Section 1: Risk Analysis
      doc.setFillColor(0, 48, 73); // Navy blue
      doc.rect(20, 45, 170, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Risk Analysis", 25, 50);

      // Risk Level Box
      doc.setFillColor(255, 255, 255);
      doc.rect(20, 55, 170, 40, "F");
      doc.setDrawColor(0, 48, 73); // Navy blue
      doc.setLineWidth(0.5);
      doc.rect(20, 55, 170, 40);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        assessment.riskLevel === "Depresi" ? 239 : 34,
        assessment.riskLevel === "Depresi" ? 68 : 197,
        assessment.riskLevel === "Depresi" ? 68 : 94
      );
      doc.text(assessment.riskLevel, 25, 65);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Depression Probability", 25, 75);
      doc.text(`${(assessment.probability.Depresi * 100).toFixed(2)}%`, 25, 82);

      doc.text("Healthy Probability", 80, 75);
      doc.text(
        `${(assessment.probability["Tidak Depresi"] * 100).toFixed(2)}%`,
        80,
        82
      );

      // Progress bars
      doc.setFillColor(239, 68, 68); // Red
      doc.rect(25, 85, assessment.probability.Depresi * 100 * 0.5, 2, "F");
      doc.setFillColor(34, 197, 94); // Green
      doc.rect(
        80,
        85,
        assessment.probability["Tidak Depresi"] * 100 * 0.5,
        2,
        "F"
      );

      // Section 2: Assessment Factors
      doc.setFillColor(0, 48, 73); // Navy blue
      doc.rect(20, 100, 170, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Assessment Factors", 25, 105);

      // Details
      let yPos = 115;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      Object.entries(assessment.details).forEach(([key, value], index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        if (index % 2 === 0) {
          doc.setFillColor(241, 245, 249);
          doc.rect(20, yPos - 4, 170, 10, "F");
        }

        const label = getDetailLabel(key);
        doc.setTextColor(100, 116, 139);
        doc.text(`${label}:`, 25, yPos);
        doc.setTextColor(0, 0, 0);
        doc.text(`${value}`, 70, yPos);
        yPos += 10;
      });

      // Footer
      doc.setDrawColor(0, 48, 73); // Navy blue
      doc.setLineWidth(0.5);
      doc.line(20, 285, 190, 285);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 292);
      doc.text("Mental Health Monitoring System © 2025", 150, 292);

      // Save PDF
      doc.save(`Mental_Health_Assessment_${assessment.date.split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 bg-fixed"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 backdrop-blur-sm p-4 rounded-xl bg-white/5 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Prediction History
              </h1>
              <p className="text-purple-200 text-sm">
                Your mental health journey tracker
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-purple-100 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 shadow-md transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 gap-6">
          <Card className="backdrop-blur-md bg-gradient-to-br from-indigo-950/90 via-purple-950/90 to-fuchsia-950/90 border border-purple-400/30 shadow-[0_5px_25px_rgba(167,139,250,0.3)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full filter blur-3xl"></div>

            <CardHeader className="pb-3 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                    Assessment History
                  </CardTitle>
                  <CardDescription className="text-fuchsia-200 mt-1">
                    Track your mental health progress over time
                  </CardDescription>
                </div>
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5 rounded-full shadow-lg">
                  <div className="bg-black/40 backdrop-blur-md rounded-full p-2.5">
                    <LineChartIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              {loading ? (
                <div className="flex justify-center items-center py-12 bg-purple-900/20 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <LoaderIcon className="w-8 h-8 text-purple-300 animate-spin mb-2" />
                    <p className="text-purple-200">Loading history...</p>
                  </div>
                </div>
              ) : predictionHistory.length > 0 ? (
                <>
                  <div className="space-y-3 min-h-[420px]">
                    {" "}
                    {/* Fixed height to maintain consistency */}
                    {currentItems.map((assessment, index) => (
                      <motion.div
                        key={assessment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-stretch cursor-pointer group rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <div
                          className={`w-3 ${
                            assessment.riskLevel === "Depresi"
                              ? "bg-gradient-to-b from-amber-400 to-red-500"
                              : "bg-gradient-to-b from-blue-400 to-violet-500"
                          }`}
                        />

                        <div className="flex-1 p-4 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 backdrop-blur-sm group-hover:from-purple-900/80 group-hover:to-indigo-900/80 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-black/30 p-2 rounded-full">
                                <Calendar className="w-5 h-5 text-purple-200" />
                              </div>
                              <div>
                                <p className="text-base font-medium text-white">
                                  {new Date(assessment.date).toLocaleDateString(
                                    "id-ID",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      assessment.riskLevel === "Depresi"
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                                  />
                                  <p
                                    className={`text-sm ${
                                      assessment.riskLevel === "Depresi"
                                        ? "text-red-300"
                                        : "text-green-300"
                                    }`}
                                  >
                                    {assessment.riskLevel}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`text-base font-bold ${
                                  assessment.riskLevel === "Depresi"
                                    ? "text-amber-400"
                                    : "text-violet-300"
                                }`}
                              >
                                {(assessment.probability.Depresi * 100).toFixed(
                                  0
                                )}
                                %
                              </span>

                              <div className="w-40 h-3 bg-purple-900/70 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(
                                      assessment.probability.Depresi * 100
                                    ).toFixed(0)}%`,
                                  }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className={`h-full ${
                                    assessment.riskLevel === "Depresi"
                                      ? "bg-gradient-to-r from-amber-400 to-red-500"
                                      : "bg-gradient-to-r from-blue-400 to-violet-500"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 0 && (
                    <div className="flex justify-center items-center mt-6 gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-purple-200 hover:text-white hover:bg-purple-900/30"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                      </Button>

                      <div className="flex gap-2">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-full ${
                              currentPage === page
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                : "text-purple-200 border-purple-500/30 hover:bg-purple-900/30 hover:text-white"
                            }`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-purple-200 hover:text-white hover:bg-purple-900/30"
                      >
                        Next
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-md rounded-lg p-8 text-center border border-purple-500/20 shadow-inner min-h-[420px] flex flex-col justify-center">
                  <div className="bg-gradient-to-r from-purple-500/30 to-indigo-500/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <ClipboardIcon className="w-8 h-8 text-purple-200" />
                  </div>
                  <p className="text-purple-100 font-medium text-lg">
                    No assessment history yet
                  </p>
                  <p className="text-sm text-purple-300 mt-2 max-w-md mx-auto">
                    Complete your first mental health assessment to start
                    tracking your wellbeing journey
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-6 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-100 border-purple-500/30 hover:border-purple-500/70 hover:from-purple-500/30 hover:to-indigo-500/30 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300"
                    onClick={() => router.push("/assessment-form")}
                  >
                    Start Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal for Assessment Details */}
      <AnimatePresence>
        {selectedAssessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md"
            onClick={() => setSelectedAssessment(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-indigo-950/90 to-purple-950/90 rounded-xl p-0 max-w-2xl w-full max-h-[80vh] overflow-hidden border border-purple-400/30 shadow-[0_10px_50px_rgba(139,92,246,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/30 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/30 rounded-full filter blur-3xl"></div>

                <div className="relative p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/60 to-indigo-900/60">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                        Assessment Details
                      </h2>
                      <p className="text-purple-200 text-sm mt-1">
                        {new Date(selectedAssessment.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadAsPDF(selectedAssessment)}
                        className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-100 border-purple-500/30 hover:border-purple-500/70 hover:from-purple-500/30 hover:to-indigo-500/30"
                      >
                        <ClipboardIcon className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedAssessment(null)}
                        className="rounded-full w-8 h-8 p-0 flex items-center justify-center text-purple-200 hover:text-white hover:bg-purple-800/30"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(80vh-100px)] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  {/* Risk Level */}
                  <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-5 rounded-xl border border-purple-500/20 shadow-inner">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="p-1.5 bg-purple-900/60 rounded-full">
                        {selectedAssessment.riskLevel === "Depresi" ? (
                          <AlertCircle className="w-5 h-5 text-red-300" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-green-300" />
                        )}
                      </div>
                      Risk Analysis
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`text-3xl font-bold ${
                          selectedAssessment.riskLevel === "Depresi"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {selectedAssessment.riskLevel}
                      </div>
                      <div
                        className={`text-xs px-3 py-1 rounded-full ${
                          selectedAssessment.riskLevel === "Depresi"
                            ? "bg-red-900/30 text-red-300 border border-red-500/30"
                            : "bg-green-900/30 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {selectedAssessment.riskLevel === "Depresi"
                          ? "Needs Attention"
                          : "Healthy Status"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Depression Probability */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-purple-200">
                            Depression Probability
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              selectedAssessment.riskLevel === "Depresi"
                                ? "text-red-300"
                                : "text-purple-200"
                            }`}
                          >
                            {(
                              selectedAssessment.probability.Depresi * 100
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                        <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(
                                selectedAssessment.probability.Depresi * 100
                              ).toFixed(2)}%`,
                            }}
                            transition={{ duration: 1 }}
                            className={`h-full ${
                              selectedAssessment.riskLevel === "Depresi"
                                ? "bg-gradient-to-r from-amber-400 to-red-500"
                                : "bg-gradient-to-r from-amber-400/50 to-red-500/50"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Healthy Probability */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-purple-200">
                            Healthy Probability
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              selectedAssessment.riskLevel !== "Depresi"
                                ? "text-green-300"
                                : "text-purple-200"
                            }`}
                          >
                            {(
                              selectedAssessment.probability["Tidak Depresi"] *
                              100
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                        <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(
                                selectedAssessment.probability[
                                  "Tidak Depresi"
                                ] * 100
                              ).toFixed(2)}%`,
                            }}
                            transition={{ duration: 1 }}
                            className={`h-full ${
                              selectedAssessment.riskLevel !== "Depresi"
                                ? "bg-gradient-to-r from-blue-400 to-green-500"
                                : "bg-gradient-to-r from-blue-400/50 to-green-500/50"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-5 rounded-xl border border-purple-500/20 shadow-inner">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="p-1.5 bg-purple-900/60 rounded-full">
                        <User className="w-5 h-5 text-purple-300" />
                      </div>
                      Assessment Factors
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedAssessment.details).map(
                        ([key, value]) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all duration-300"
                          >
                            <div className="p-2 bg-indigo-900/60 rounded-full flex-shrink-0">
                              {getDetailIcon(key)}
                            </div>
                            <div>
                              <p className="text-xs text-purple-300">
                                {getDetailLabel(key)}
                              </p>
                              <p className="text-sm text-white font-medium">
                                {value}
                              </p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </motion.div>
  );
}
