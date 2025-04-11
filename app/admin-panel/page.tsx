"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BrainCircuit, ArrowLeft, Plus, Pencil, Trash2, BarChart3, Users, FileText, Upload } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock articles data
const mockArticles = [
  {
    id: 1,
    title: "Understanding Depression: Signs and Symptoms",
    category: "Depression",
    date: "2023-10-15",
    views: 1243,
    status: "Published",
  },
  {
    id: 2,
    title: "Mindfulness Techniques for Anxiety Relief",
    category: "Anxiety",
    date: "2023-09-28",
    views: 982,
    status: "Published",
  },
  {
    id: 3,
    title: "The Connection Between Sleep and Mental Health",
    category: "Wellness",
    date: "2023-09-15",
    views: 756,
    status: "Published",
  },
  {
    id: 4,
    title: "Cognitive Behavioral Therapy: An Overview",
    category: "Therapy",
    date: "2023-08-22",
    views: 1102,
    status: "Published",
  },
  {
    id: 5,
    title: "Building Resilience: Bouncing Back from Setbacks",
    category: "Wellness",
    date: "2023-08-10",
    views: 893,
    status: "Draft",
  },
]

// Mock analytics data
const mockAnalytics = {
  totalUsers: 1245,
  activeUsers: 876,
  assessmentsTaken: 3421,
  averageScore: 62,
  articleViews: 8765,
  topArticles: [
    { title: "Understanding Depression: Signs and Symptoms", views: 1243 },
    { title: "Cognitive Behavioral Therapy: An Overview", views: 1102 },
    { title: "Mindfulness Techniques for Anxiety Relief", views: 982 },
  ],
  userGrowth: [
    { month: "Jan", users: 720 },
    { month: "Feb", users: 820 },
    { month: "Mar", users: 910 },
    { month: "Apr", users: 970 },
    { month: "May", users: 1050 },
    { month: "Jun", users: 1120 },
    { month: "Jul", users: 1180 },
    { month: "Aug", users: 1245 },
  ],
}

export default function AdminPanel({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState("articles")
  const [editingArticle, setEditingArticle] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      category: article.category,
      excerpt: "Sample excerpt for this article...",
      content: "Full content would go here...",
      image: null,
    })
    setActiveTab("editor")
  }

  const handleNewArticle = () => {
    setEditingArticle(null)
    setFormData({
      title: "",
      category: "",
      excerpt: "",
      content: "",
      image: null,
    })
    setActiveTab("editor")
  }

  const handleSaveArticle = () => {
    // In a real app, this would save to a database
    alert("Article saved successfully!")
    setActiveTab("articles")
  }

  const handleDeleteArticle = (articleId) => {
    // In a real app, this would delete from a database
    alert(`Article ${articleId} would be deleted`)
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
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:w-[400px] bg-black/30 border border-purple-500/20">
          <TabsTrigger value="articles" className="data-[state=active]:bg-purple-900/30">
            <FileText className="w-4 h-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-900/30">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Manage Articles</h2>
            <Button
              onClick={handleNewArticle}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </div>

          <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20 hover:bg-purple-900/10">
                    <TableHead className="text-purple-200">Title</TableHead>
                    <TableHead className="text-purple-200">Category</TableHead>
                    <TableHead className="text-purple-200">Date</TableHead>
                    <TableHead className="text-purple-200 text-right">Views</TableHead>
                    <TableHead className="text-purple-200">Status</TableHead>
                    <TableHead className="text-purple-200 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockArticles.map((article) => (
                    <TableRow key={article.id} className="border-purple-500/20 hover:bg-purple-900/10">
                      <TableCell className="font-medium text-white">{article.title}</TableCell>
                      <TableCell className="text-purple-200">{article.category}</TableCell>
                      <TableCell className="text-purple-200">{new Date(article.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-purple-200 text-right">{article.views.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === "Published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {article.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditArticle(article)}
                            className="h-8 w-8 text-purple-300 hover:text-purple-100 hover:bg-purple-900/30"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteArticle(article.id)}
                            className="h-8 w-8 text-red-300 hover:text-red-100 hover:bg-red-900/30"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{editingArticle ? "Edit Article" : "Create New Article"}</h2>
            <Button
              variant="outline"
              onClick={() => setActiveTab("articles")}
              className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-purple-100">
                      Article Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter article title"
                      className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-purple-100">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="E.g., Depression, Anxiety, Wellness"
                      className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-purple-100">
                      Excerpt
                    </Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Brief summary of the article"
                      className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400 min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-100">Featured Image</Label>
                    <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      {formData.image ? (
                        <div className="relative w-full">
                          <img
                            src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                            className="absolute top-2 right-2"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-purple-400 mb-2" />
                          <p className="text-sm text-purple-200 mb-2">
                            Drag and drop your image here, or click to browse
                          </p>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("image").click()}
                            className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
                          >
                            Select Image
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-purple-100">
                      Status
                    </Label>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 border-purple-500/30 text-purple-100 hover:bg-purple-900/30 data-[state=active]:bg-purple-900/30"
                        data-state="active"
                      >
                        Draft
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
                      >
                        Published
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-purple-100">
                  Content
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your article content here..."
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400 min-h-[300px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-purple-500/20 p-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab("articles")}
                className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveArticle}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {editingArticle ? "Update Article" : "Publish Article"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Total Users</CardTitle>
                <CardDescription className="text-purple-200">Registered accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <span className="text-3xl font-bold text-white">{mockAnalytics.totalUsers}</span>
                </div>
                <p className="text-sm text-green-400 mt-2">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Assessments Taken</CardTitle>
                <CardDescription className="text-purple-200">Total completed assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span className="text-3xl font-bold text-white">{mockAnalytics.assessmentsTaken}</span>
                </div>
                <p className="text-sm text-green-400 mt-2">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Article Views</CardTitle>
                <CardDescription className="text-purple-200">Total article impressions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  <span className="text-3xl font-bold text-white">{mockAnalytics.articleViews}</span>
                </div>
                <p className="text-sm text-green-400 mt-2">+15% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <CardHeader>
                <CardTitle className="text-lg text-white">User Growth</CardTitle>
                <CardDescription className="text-purple-200">New users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-2">
                  {mockAnalytics.userGrowth.map((data, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-md"
                        style={{ height: `${(data.users / 1245) * 250}px` }}
                      />
                      <span className="text-xs text-purple-200">{data.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Top Articles</CardTitle>
                <CardDescription className="text-purple-200">Most viewed content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.topArticles.map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{article.title}</span>
                      </div>
                      <span className="text-purple-200">{article.views.toLocaleString()} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

