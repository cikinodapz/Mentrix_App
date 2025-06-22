"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BrainCircuit,
  ArrowLeft,
  Search,
  FileText,
  User,
  Filter,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  predictionTarget: string;
  estimatedReadTime: number;
  views: number;
  createdAt: string;
  author: {
    name: string;
  };
  thumbnailUrl?: string;
}

interface ApiResponse {
  message: string;
  data: Article[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// const categories = ["All", "Depresi", "Mindfulness", "Kesehatan", "Terapi"];

export default function ArticlesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingThumbnails, setLoadingThumbnails] = useState<Record<string, boolean>>({});
  
  const router = useRouter();

  const fetchThumbnail = async (articleId: string) => {
    try {
      const response = await api.get(`/admin/article-thumbnail/${articleId}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error(`Error fetching thumbnail for article ${articleId}:`, error);
      return "/placeholder.svg";
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse>("/user/all-articles");
        const articlesWithThumbnails = await Promise.all(
          response.data.data.map(async (article) => {
            setLoadingThumbnails((prev) => ({ ...prev, [article.id]: true }));
            const thumbnailUrl = article.thumbnail ? await fetchThumbnail(article.id) : "/placeholder.svg";
            return { ...article, thumbnailUrl };
          })
        );
        setArticles(articlesWithThumbnails);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleImageLoad = (articleId: string) => {
    setLoadingThumbnails((prev) => ({ ...prev, [articleId]: false }));
  };

  const handleArticleClick = (article: Article) => {
    // Simpan path saat ini sebelum navigasi
    localStorage.setItem("articleBackPath", window.location.pathname);
    router.push(`/article-detail/${article.id}`);
  };

  const filteredArticles = articles
    // .filter((article) => {
    //   const matchesSearch =
    //     article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     article.content.toLowerCase().includes(searchQuery.toLowerCase());
    //   const matchesCategory =
    //     selectedCategory === "All" ||
    //     article.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase());
    //   return matchesSearch && matchesCategory;
    // })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "readTime") return a.estimatedReadTime - b.estimatedReadTime;
      return 0;
    });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-4 md:p-8 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading articles...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-4 md:p-8 flex items-center justify-center"
      >
        <Card className="backdrop-blur-lg bg-black/30 border border-red-500/20 shadow-[0_0_15px_rgba(255,0,0,0.1)] p-6">
          <CardContent className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
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
          <h1 className="text-2xl font-bold text-white">Articles</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
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
                {/* <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCategory}
                  </Button>
                </DropdownMenuTrigger> */}
                {/* <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent> */}
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30"
                  >
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
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Oldest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      Most Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("readTime")}>
                      Shortest Read
                    </DropdownMenuItem>
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
                onClick={() => handleArticleClick(article)}
              >
                <div className="overflow-hidden relative">
                  {loadingThumbnails[article.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <ImageIcon className="w-8 h-8 text-purple-300 animate-pulse" />
                    </div>
                  )}
                  <img
                    src={article.thumbnailUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    onLoad={() => handleImageLoad(article.id)}
                    onError={() => handleImageLoad(article.id)}
                    style={{ display: loadingThumbnails[article.id] ? "none" : "block" }}
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {article.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/20 text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                        +{article.tags.length - 2}
                      </span>
                    )}
                    <span className="text-xs text-purple-300">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-purple-200 line-clamp-3 mb-4">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-purple-300">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {article.estimatedReadTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="mt-2">
                    {/* <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        article.predictionTarget === "Depresi"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {article.predictionTarget}
                    </span> */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-purple-200">
              No articles found matching your search criteria.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-purple-300 hover:text-purple-100 mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}