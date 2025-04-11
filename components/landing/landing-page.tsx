"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Star,
  Shield,
  BarChart3,
  Users,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/20 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-purple-400/20 shadow-[0_0_10px_rgba(167,139,250,0.2)]">
              <div className="w-12 h-12 relative">
                <Image
                  src="/Logo3_nobg.png"
                  alt="Mentrix Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
            </div>
            {/* <span className="text-xl font-light">Mentrix</span> */}
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-purple-200 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-purple-200 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-purple-200 hover:text-white transition-colors"
            >
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onLogin}
              className="text-purple-100 hover:bg-purple-900/30"
            >
              Login
            </Button>
            <Button
              onClick={onRegister}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-sm text-purple-300 w-fit">
                <Shield className="w-4 h-4" />
                <span>Trusted by mental health professionals</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Mental Health{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Journey
                </span>{" "}
                Starts Here
              </h1>
              <p className="text-lg text-purple-200 mb-1">
                Mentrix helps you understand, track, and improve your mental
                wellbeing
              </p>
              <p className="text-lg text-purple-200 mt-[-10px]">
                with AI-Powered assessments and personalized resources.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                  onClick={onRegister}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Get Started Free
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-purple-200">
                  <span className="font-bold text-white">1,200+</span> people
                  joined this week
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-70 blur-xl"></div>
              <Card className="relative backdrop-blur-xl bg-black/40 border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                <CardContent className="p-0">
                  <img
                    src="/Photo-1.webp?height=600&width=800"
                    alt="Mentrix Dashboard Preview"
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-60"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      {/* <section className="py-12 px-4 bg-black/30 backdrop-blur-md border-y border-purple-500/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <p className="text-purple-300 text-sm font-medium">
              TRUSTED BY LEADING ORGANIZATIONS
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              "Company 1",
              "Company 2",
              "Company 3",
              "Company 4",
              "Company 5",
            ].map((company, index) => (
              <div
                key={index}
                className="text-gray-400 text-xl font-bold opacity-70 hover:opacity-100 transition-opacity"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Mental Health Tools
            </h2>
            <p className="text-purple-200 text-lg">
              Mentrix provides everything you need to understand and improve
              your mental wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="w-10 h-10 text-blue-400" />}
              title="Personalized Assessments"
              description="Take scientifically validated assessments to understand your mental health status and track your progress over time."
            />
            <FeatureCard
              icon={<MessageSquare className="w-10 h-10 text-purple-400" />}
              title="Expert Resources"
              description="Access a library of articles, guides, and resources written by mental health professionals."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-indigo-400" />}
              title="Community Support"
              description="Connect with others on similar journeys in moderated, safe community spaces."
            />
          </div>

          <div className="mt-16 text-center">
            <Button
              onClick={onRegister}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Explore All Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 px-4 bg-gradient-to-br from-black/40 to-purple-900/30 backdrop-blur-lg border-y border-purple-500/30 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
              How Mentrix Works
            </h2>
            <p className="text-purple-200 text-xl leading-relaxed">
              Our streamlined approach helps you understand, monitor, and
              improve your mental wellness through a simple three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection line between steps */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 hidden md:block transform -translate-y-1/2 opacity-60"></div>

            {/* Step 1 */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 relative group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-2xl font-bold mt-6 mb-4 text-center text-white">
                Take an Assessment
              </h3>
              <p className="text-purple-100 text-center leading-relaxed">
                Complete our scientifically validated mental health assessments
                to understand your current state.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 relative group mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-2xl font-bold mt-6 mb-4 text-center text-white">
                Get Personalized Insights
              </h3>
              <p className="text-purple-100 text-center leading-relaxed">
                Receive detailed analysis of your results with actionable
                recommendations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 relative group mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-2xl font-bold mt-6 mb-4 text-center text-white">
                Track Your Progress
              </h3>
              <p className="text-purple-100 text-center leading-relaxed">
                Monitor your mental health journey over time and see your
                improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-purple-200 text-lg">
              Thousands of people have improved their mental wellbeing with
              Mentrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Mentrix has been a game-changer for my anxiety. The assessments helped me understand my triggers, and the resources gave me practical coping strategies."
              author="Sarah J."
              role="Teacher"
              rating={5}
            />
            <TestimonialCard
              quote="As someone who was skeptical about mental health apps, I'm impressed by the scientific approach Mentrix takes. The insights are genuinely helpful."
              author="Michael T."
              role="Software Engineer"
              rating={5}
            />
            <TestimonialCard
              quote="I love being able to track my progress over time. Seeing the improvement in my scores has been incredibly motivating on my journey."
              author="Aisha K."
              role="Healthcare Worker"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500 blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500 blur-[100px] opacity-20"></div>

        <div className="container mx-auto relative z-10">
          <Card className="backdrop-blur-xl bg-black/40 border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(139,92,246,0.2)]">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Start Your Mental Health Journey Today
                  </h2>
                  <p className="text-purple-200 text-lg mb-6">
                    Join thousands of others who have taken the first step
                    toward better mental wellbeing.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Free personalized mental health assessment",
                      "Access to expert-written resources",
                      "Progress tracking and insights",
                      "Private and secure platform",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-purple-100">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={onRegister}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Sign Up Free
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-xl"></div>
                  <img
                    src="/Photo-3.png"
                    alt="Mentrix App"
                    className="relative rounded-2xl"
                    style={{
                      width: "600px",
                      height: "550px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/50 backdrop-blur-md border-t border-purple-500/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Mentrix</span>
              </div>
              <p className="text-purple-200 mb-4">
                Your companion for better mental health and wellbeing.
              </p>
              <div className="flex gap-4">
                {["Twitter", "Facebook", "Instagram", "LinkedIn"].map(
                  (social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors"
                    >
                      {social}
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                {[
                  "Features",
                  "Assessments",
                  "Resources",
                  "Community",
                  "Pricing",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Team", "Careers", "Blog", "Press"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-purple-200 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                {[
                  "Terms of Service",
                  "Privacy Policy",
                  "Cookie Policy",
                  "GDPR",
                  "Contact Us",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-500/20 text-center text-purple-200 text-sm">
            <p>© {new Date().getFullYear()} Mentrix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] transition-all duration-300">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-purple-900/30 border border-purple-500/30 mb-6">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-purple-200">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative z-10"
    >
      <Card className="h-full backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold mb-6">
            {number}
          </div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-purple-200">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, rating }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
        <CardContent className="p-6">
          <div className="flex mb-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < rating ? "text-yellow-400" : "text-gray-600"
                  }`}
                />
              ))}
          </div>
          <p className="text-purple-100 mb-6 italic">"{quote}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              {author.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-white">{author}</p>
              <p className="text-sm text-purple-300">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
