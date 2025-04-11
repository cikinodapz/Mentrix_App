"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, LogOut, ClipboardCheck, BookOpen, BarChart3, Settings, User, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DashboardProps {
  onLogout: () => void;
  onStartAssessment: () => void;
  onViewAdmin: () => void;
  isAdmin: boolean;
}

const mockAssessmentHistory = [
  { date: "2023-10-15", score: 65 },
  { date: "2023-09-01", score: 72 },
  { date: "2023-07-20", score: 58 },
  { date: "2023-06-05", score: 80 },
]

const mockArticles = [
  {
    id: 1,
    title: "Understanding Depression: Signs and Symptoms",
    excerpt: "Learn about the common signs of depression and when to seek help.",
    readTime: 5,
    views: 1243,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Mindfulness Techniques for Anxiety Relief",
    excerpt: "Simple mindfulness practices you can incorporate into your daily routine.",
    readTime: 7,
    views: 982,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "The Connection Between Sleep and Mental Health",
    excerpt: "How quality sleep impacts your mental wellbeing and tips for better rest.",
    readTime: 6,
    views: 756,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function Dashboard({ onLogout, onStartAssessment, onViewAdmin, isAdmin }: DashboardProps) {
  const [greeting, setGreeting] = useState("")
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    const timer = setTimeout(() => setProgress(85), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleViewArticles = () => {
    router.push("/article-list")
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
          <h1 className="text-2xl font-bold text-white">Mentrix</h1>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              onClick={onViewAdmin}
              className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
          <Button variant="ghost" onClick={onLogout} className="text-purple-100 hover:bg-purple-900/30">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="space-y-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardHeader>
              <CardTitle className="text-xl text-white">{greeting}, Alex</CardTitle>
              <CardDescription className="text-purple-200">
                Track your mental health journey and access resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  onClick={onStartAssessment}
                  className="flex-1 h-auto py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardCheck className="w-8 h-8" />
                    <span className="text-lg font-medium">Take Depression Assessment</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewArticles}
                  className="flex-1 h-auto py-6 border-purple-500/30 bg-white/5 text-purple-100 hover:bg-purple-900/30"
                >
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="w-8 h-8" />
                    <span className="text-lg font-medium">Browse Articles</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card className="h-full backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Assessment History</CardTitle>
                <CardDescription className="text-purple-200">Track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-200">Current mental wellness score</p>
                      <p className="text-2xl font-bold text-white">85/100</p>
                    </div>
                    <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">85%</span>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2 bg-purple-900/30" />
                  <div className="mt-6 space-y-3">
                    {mockAssessmentHistory.map((assessment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm text-purple-200">{new Date(assessment.date).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                              style={{ width: `${assessment.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white">{assessment.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="h-full backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Stats</CardTitle>
                <CardDescription className="text-purple-200">Your activity overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <ClipboardCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Assessments Taken</p>
                      <p className="text-xl font-bold text-white">4</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="p-2 rounded-full bg-purple-500/20">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Articles Read</p>
                      <p className="text-xl font-bold text-white">12</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="p-2 rounded-full bg-indigo-500/20">
                      <BarChart3 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-200">Wellness Trend</p>
                      <p className="text-xl font-bold text-green-400">↑ 15%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Recommended Articles</CardTitle>
              <CardDescription className="text-purple-200">
                Personalized content based on your assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden bg-white/5 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group"
                  >
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-medium text-white mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-purple-200 line-clamp-2 mb-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-purple-300">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {article.readTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.views.toLocaleString()} views
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="link" 
                onClick={handleViewArticles}
                className="w-full text-purple-300 hover:text-purple-100"
              >
                View All Articles
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  )
}