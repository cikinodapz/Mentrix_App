"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, ArrowLeft, BookOpen, Phone } from "lucide-react"

export default function AssessmentResults({ result, onBackToDashboard, onViewArticles }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(result.score)
    }, 500)
    return () => clearTimeout(timer)
  }, [result.score])

  const getScoreColor = () => {
    if (result.score < 30) return "text-green-400"
    if (result.score < 50) return "text-yellow-400"
    if (result.score < 70) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreBackground = () => {
    if (result.score < 30) return "from-green-500 to-blue-500"
    if (result.score < 50) return "from-yellow-500 to-orange-500"
    if (result.score < 70) return "from-orange-500 to-red-500"
    return "from-red-500 to-purple-600"
  }

  const getRecommendations = () => {
    if (result.score < 30) {
      return [
        "Continue monitoring your mental health",
        "Practice regular self-care activities",
        "Maintain healthy sleep patterns",
      ]
    }
    if (result.score < 50) {
      return [
        "Consider speaking with a mental health professional",
        "Practice mindfulness and stress reduction techniques",
        "Ensure you're getting regular exercise and proper nutrition",
      ]
    }
    return [
      "Schedule an appointment with a mental health professional",
      "Consider therapy or counseling options",
      "Reach out to trusted friends or family for support",
      "Establish a regular self-care routine",
    ]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-8"
    >
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Assessment Results</h1>
        </div>
        <Button
          variant="outline"
          onClick={onBackToDashboard}
          className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardHeader>
              <CardTitle className="text-xl text-white">Your Depression Assessment</CardTitle>
              <CardDescription className="text-purple-200">
                Completed on {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full border-8 border-purple-900/30" />
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-purple-900/30"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * animatedScore) / 100}
                      transform="rotate(-90 50 50)"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * animatedScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={`stop-color-${getScoreBackground().split(" ")[0].substring(5)}`} />
                        <stop
                          offset="100%"
                          className={`stop-color-${getScoreBackground().split(" ")[1].substring(3)}`}
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className={`text-3xl font-bold ${getScoreColor()}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {Math.round(animatedScore)}%
                    </motion.span>
                    <span className="text-sm text-purple-200">{result.severity}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-purple-500/20">
                    <h3 className="text-lg font-medium text-white mb-2">Assessment Result</h3>
                    <p className="text-purple-200">
                      Based on your responses, your assessment indicates
                      <span className={`font-bold ${getScoreColor()} ml-1`}>
                        {result.severity}{" "}
                        {result.isDepressed ? "depression symptoms" : "no significant depression symptoms"}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-purple-500/20">
                    <h3 className="text-lg font-medium text-white mb-2">What This Means</h3>
                    <p className="text-purple-200">
                      {result.isDepressed
                        ? "Your responses suggest you may be experiencing symptoms of depression. This is not a clinical diagnosis, but we recommend discussing these results with a healthcare professional."
                        : "Your responses suggest you are not currently experiencing significant symptoms of depression. Continue to monitor your mental health and practice self-care."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-purple-500/20">
                <h3 className="text-lg font-medium text-white mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {getRecommendations().map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-purple-200">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={onViewArticles}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Read Helpful Articles
              </Button>
              <Button variant="outline" className="flex-1 border-purple-500/30 text-purple-100 hover:bg-purple-900/30">
                <Phone className="w-4 h-4 mr-2" />
                Find Professional Help
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Important Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-purple-500/20">
                <h3 className="text-sm font-medium text-white mb-2">Not a Diagnosis</h3>
                <p className="text-xs text-purple-200">
                  This assessment is not a clinical diagnosis. It is designed to help you understand your mental health
                  better.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-purple-500/20">
                <h3 className="text-sm font-medium text-white mb-2">Seek Professional Help</h3>
                <p className="text-xs text-purple-200">
                  If you're experiencing symptoms of depression, we recommend consulting with a healthcare professional.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-purple-500/20">
                <h3 className="text-sm font-medium text-white mb-2">Emergency Resources</h3>
                <p className="text-xs text-purple-200 mb-2">If you're in crisis or having thoughts of self-harm:</p>
                <ul className="space-y-1 text-xs text-purple-200">
                  <li>• National Suicide Prevention Lifeline: 988</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                  <li>• Emergency Services: 911</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

