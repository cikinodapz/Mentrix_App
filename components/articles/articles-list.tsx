"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BrainCircuit, ArrowLeft, Search, FileText, User, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock articles data
const mockArticles = [
  {
    id: 1,
    title: "Understanding Depression: Signs and Symptoms",
    excerpt:
      "Learn about the common signs of depression and when to seek help. Depression is more than just feeling sad—it's a complex mental health condition that affects millions worldwide.",
    category: "Depression",
    readTime: 5,
    views: 1243,
    date: "2023-10-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Mindfulness Techniques for Anxiety Relief",
    excerpt:
      "Simple mindfulness practices you can incorporate into your daily routine to help manage anxiety symptoms and promote mental wellness.",
    category: "Anxiety",
    readTime: 7,
    views: 982,
    date: "2023-09-28",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "The Connection Between Sleep and Mental Health",
    excerpt:
      "How quality sleep impacts your mental wellbeing and tips for better rest. Research shows that sleep and mental health are closely connected.",
    category: "Wellness",
    readTime: 6,
    views: 756,
    date: "2023-09-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Cognitive Behavioral Therapy: An Overview",
    excerpt:
      "Understanding how CBT works and its effectiveness in treating various mental health conditions including depression and anxiety disorders.",
    category: "Therapy",
    readTime: 8,
    views: 1102,
    date: "2023-08-22",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Building Resilience: Bouncing Back from Setbacks",
    excerpt:
      "Strategies to develop mental resilience and cope with life's challenges in a healthier way. Learn how to adapt to stress and adversity.",
    category: "Wellness",
    readTime: 6,
    views: 893,
    date: "2023-08-10",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "The Role of Exercise in Managing Depression",
    excerpt:
      "How physical activity can help alleviate symptoms of depression and improve overall mental health through natural mood enhancement.",
    category: "Depression",
    readTime: 5,
    views: 721,
    date: "2023-07-28",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const categories = ["All", "Depression", "Anxiety", "Wellness", "Therapy"]

export default function ArticlesList({ onViewArticle, onBackToDashboard }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  const filteredArticles = mockArticles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "popular") {
        return b.views - a.views
      } else if (sortBy === "readTime") {
        return a.readTime - b.readTime
      }
      return 0
    })

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
          <h1 className="text-2xl font-bold text-white">Articles</h1>
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

      <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)] mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30">
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {categories.map((category) => (
                      <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30">
                    Sort:{" "}
                    {sortBy === "newest"
                      ? "Newest"
                      : sortBy === "oldest"
                        ? "Oldest"
                        : sortBy === "popular"
                          ? "Most Popular"
                          : "Shortest Read"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>Most Popular</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("readTime")}>Shortest Read</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="h-full overflow-hidden bg-black/30 border border-purple-500/20 hover:border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all duration-300 group cursor-pointer"
                onClick={() => onViewArticle(article)}
              >
                <div className="overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                      {article.category}
                    </span>
                    <span className="text-xs text-purple-300">{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-purple-200 line-clamp-3 mb-4">{article.excerpt}</p>
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
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-purple-200">No articles found matching your search criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
              className="text-purple-300 hover:text-purple-100 mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

