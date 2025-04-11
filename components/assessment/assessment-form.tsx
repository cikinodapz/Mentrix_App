"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, Save, BrainCircuit } from "lucide-react"

// Mock assessment questions
const questions = [
  {
    id: 1,
    question: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
    type: "radio",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: 2,
    question: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    type: "radio",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: 3,
    question: "Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
    type: "radio",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: 4,
    question: "Over the past 2 weeks, how often have you felt tired or had little energy?",
    type: "radio",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: 5,
    question: "On a scale of 0-10, how would you rate your overall mood today?",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    labels: {
      0: "Very low",
      5: "Neutral",
      10: "Very good",
    },
  },
  {
    id: 6,
    question:
      "Over the past 2 weeks, how often have you felt bad about yourself or that you are a failure or have let yourself or your family down?",
    type: "radio",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: 7,
    question:
      "Over the past 2 weeks, how often have you had trouble concentrating on things, such as reading or watching TV?",
    type: "radio",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: 8,
    question:
      "On a scale of 0-10, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    labels: {
      0: "Not difficult at all",
      5: "Somewhat difficult",
      10: "Extremely difficult",
    },
  },
]

export default function AssessmentForm({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const currentQuestion = questions[currentStep]
  const totalSteps = questions.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Calculate result based on answers
      const result = calculateResult(answers)
      onComplete(result)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onCancel()
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate saving to server
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    })
  }

  const calculateResult = (answers) => {
    // Simple algorithm to calculate depression score
    // In a real app, this would be more sophisticated
    let totalScore = 0
    let maxPossibleScore = 0

    // Sum up radio question scores (questions 1-4, 6-7)
    const radioQuestionIds = [1, 2, 3, 4, 6, 7]
    radioQuestionIds.forEach((id) => {
      if (answers[id]) {
        totalScore += Number.parseInt(answers[id])
        maxPossibleScore += 3 // Max value for each radio question
      }
    })

    // Add slider values (questions 5 and 8)
    // For question 5 (mood), higher is better, so we invert the score
    if (answers[5] !== undefined) {
      totalScore += 10 - answers[5]
      maxPossibleScore += 10
    }

    // For question 8 (difficulty), higher is worse
    if (answers[8] !== undefined) {
      totalScore += answers[8]
      maxPossibleScore += 10
    }

    // Calculate percentage and determine result
    const percentageScore = (totalScore / maxPossibleScore) * 100

    return {
      score: percentageScore,
      isDepressed: percentageScore > 50,
      severity:
        percentageScore < 30 ? "Minimal" : percentageScore < 50 ? "Mild" : percentageScore < 70 ? "Moderate" : "Severe",
    }
  }

  const isNextDisabled = answers[currentQuestion.id] === undefined

  const renderQuestion = () => {
    const question = currentQuestion

    if (question.type === "radio") {
      return (
        <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswerChange} className="space-y-3">
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
              <Label htmlFor={`option-${question.id}-${option.value}`} className="flex-1 cursor-pointer text-white">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )
    }

    if (question.type === "slider") {
      const value = answers[question.id] !== undefined ? [answers[question.id]] : [question.min]

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
            {answers[question.id] !== undefined ? answers[question.id] : question.min}
          </div>
        </div>
      )
    }

    return null
  }

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
          <h1 className="text-2xl font-bold text-white">Depression Assessment</h1>
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
              <h2 className="text-lg font-medium text-white">{currentQuestion.question}</h2>
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
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
            {currentStep === totalSteps - 1 ? "Complete" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

