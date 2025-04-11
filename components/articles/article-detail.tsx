"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, ArrowLeft, FileText, User, Calendar, Share2, Bookmark } from "lucide-react"

export default function ArticleDetail({ article, onBackToArticles }) {
  if (!article) return null

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
          <h1 className="text-2xl font-bold text-white">Article</h1>
        </div>
        <Button
          variant="outline"
          onClick={onBackToArticles}
          className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>
      </header>

      <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] mb-8 overflow-hidden">
        <div className="h-64 md:h-80 relative">
          <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                {article.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          <div className="flex justify-end gap-2 mb-6">
            <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-purple-100 mb-6">{article.excerpt}</p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">Understanding the Basics</h2>
            <p className="text-purple-100 mb-4">
              Mental health is a crucial component of our overall wellbeing, yet it's often overlooked or stigmatized.
              In recent years, there has been a growing awareness of the importance of mental health, but many people
              still struggle to recognize the signs of mental health issues or seek appropriate help.
            </p>
            <p className="text-purple-100 mb-4">
              Whether you're dealing with depression, anxiety, or simply looking to improve your mental wellbeing,
              understanding the basics is the first step toward better health. Mental health conditions are medical
              conditions that affect thinking, emotions, and behaviors. They are common and treatable, and recovery is
              possible.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">Key Symptoms to Watch For</h2>
            <p className="text-purple-100 mb-4">
              Recognizing the symptoms of mental health conditions can help you identify when you or someone you care
              about might need support. While symptoms vary depending on the condition, some common signs include:
            </p>
            <ul className="list-disc pl-6 text-purple-100 mb-6 space-y-2">
              <li>Persistent sadness or feelings of hopelessness</li>
              <li>Excessive fears, worries, or feelings of guilt</li>
              <li>Extreme mood changes</li>
              <li>Withdrawal from friends and activities</li>
              <li>Significant changes in eating or sleeping patterns</li>
              <li>Difficulty concentrating or making decisions</li>
              <li>Inability to cope with daily problems or stress</li>
              <li>Thoughts of self-harm or suicide</li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">Treatment Options</h2>
            <p className="text-purple-100 mb-4">
              There are many effective treatments for mental health conditions. The right treatment depends on the
              specific condition, its severity, and individual preferences. Common treatments include:
            </p>
            <ul className="list-disc pl-6 text-purple-100 mb-6 space-y-2">
              <li>
                <strong className="text-white">Psychotherapy:</strong> Also known as talk therapy, this involves working
                with a therapist to address symptoms and develop coping strategies.
              </li>
              <li>
                <strong className="text-white">Medication:</strong> Psychiatric medications can help manage symptoms by
                correcting chemical imbalances in the brain.
              </li>
              <li>
                <strong className="text-white">Self-help strategies:</strong> Regular exercise, adequate sleep, healthy
                eating, and stress management techniques can all support mental health.
              </li>
              <li>
                <strong className="text-white">Support groups:</strong> Connecting with others who have similar
                experiences can provide validation, encouragement, and practical advice.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-8 mb-4">Seeking Help</h2>
            <p className="text-purple-100 mb-4">
              If you're concerned about your mental health, it's important to reach out for help. Start by talking to
              your primary care doctor, who can provide an initial assessment and refer you to a mental health
              specialist if needed. Mental health professionals include psychiatrists, psychologists, counselors, and
              social workers.
            </p>
            <p className="text-purple-100 mb-4">
              Remember, seeking help is a sign of strength, not weakness. With the right support, recovery is possible,
              and many people with mental health conditions lead fulfilling, productive lives.
            </p>

            <div className="p-6 rounded-lg bg-white/5 border border-purple-500/20 mt-8">
              <h3 className="text-lg font-bold text-white mb-3">Resources for Further Support</h3>
              <ul className="list-disc pl-6 text-purple-100 space-y-2">
                <li>National Suicide Prevention Lifeline: 988</li>
                <li>Crisis Text Line: Text HOME to 741741</li>
                <li>National Alliance on Mental Illness (NAMI) Helpline: 1-800-950-NAMI (6264)</li>
                <li>
                  Substance Abuse and Mental Health Services Administration (SAMHSA) Helpline: 1-800-662-HELP (4357)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

