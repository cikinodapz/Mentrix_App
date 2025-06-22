"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Clock,
  Calendar,
  User,
  Eye,
  Tag,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
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

export default function ArticleDetail() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleId = params.id;
        if (!articleId) throw new Error("Article ID not found in URL");
        const response = await api.get(`/user/detail-articles/${articleId}`);
        setArticle(response.data.data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article?.title,
          text: `Baca artikel: ${article?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link artikel disalin ke clipboard!");
      });
    }
  };

  const handleBack = () => {
    // Ambil path dari localStorage yang diset sebelumnya
    const backPath = localStorage.getItem("articleBackPath") || "/dashboard";
    
    // Jika backPath mengandung '/article-list', kembali ke sana, jika tidak ke dashboard
    if (backPath.includes("/article-list")) {
      router.push("/article-list");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 bg-fixed"
    >
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-purple-100 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 shadow-md transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Kembali ke Artikel
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={shareArticle}
              className="text-purple-100 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 shadow-md transition-all duration-300"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Bagikan
            </Button>

            <Button
              variant="ghost"
              onClick={toggleBookmark}
              className={`text-purple-100 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-500/50 shadow-md transition-all duration-300 ${isBookmarked ? "bg-purple-900/40" : ""}`}
            >
              <BookmarkIcon className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-purple-300" : ""}`} />
              {isBookmarked ? "Tersimpan" : "Simpan"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 bg-purple-900/20 rounded-lg border border-purple-500/20 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-purple-200">Memuat artikel...</p>
            </div>
          </div>
        ) : article ? (
          <div className="space-y-6">
            {/* <div className="flex justify-center">
              <div
                className={`py-1.5 px-4 rounded-full text-sm font-medium ${
                  article.predictionTarget === "Depresi"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-green-500/20 text-green-300 border border-green-500/30"
                }`}
              >
                Artikel untuk {article.predictionTarget}
              </div>
            </div> */}

            <h1 className="text-3xl md:text-4xl font-bold text-center text-white leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-purple-300">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{article.estimatedReadTime} menit membaca</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{article.views} kali dilihat</span>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-950/80 z-10"></div>
              <Image
                src={
                  article.thumbnail.startsWith("http")
                    ? article.thumbnail
                    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${article.thumbnail}`
                }
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {article.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-purple-900/40 hover:bg-purple-800/50 px-3 py-1 rounded-full text-xs text-purple-200 border border-purple-500/30 transition-colors duration-200 cursor-pointer"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </div>
              ))}
            </div>

            <Card className="backdrop-blur-md bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-fuchsia-950/80 border border-purple-400/30 shadow-[0_5px_25px_rgba(167,139,250,0.15)] overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-invert prose-purple max-w-none">
                  {article.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="text-[#ddd6fe] mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* <div className="mt-12">
              <h2 className="text-xl font-bold text-white mb-4">Artikel Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group relative rounded-xl overflow-hidden h-40 bg-indigo-900/30 border border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/70 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="text-xs text-purple-300 mb-1">5 menit membaca</p>
                    <h3 className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors duration-200">
                      Teknik Meditasi untuk Mengatasi Kecemasan
                    </h3>
                  </div>
                </div>
                <div className="group relative rounded-xl overflow-hidden h-40 bg-indigo-900/30 border border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/70 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="text-xs text-purple-300 mb-1">7 menit membaca</p>
                    <h3 className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors duration-200">
                      Manfaat Olahraga Rutin untuk Kesehatan Mental
                    </h3>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20 bg-purple-900/20 rounded-lg border border-purple-500/20 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <p className="text-purple-200">Artikel tidak ditemukan</p>
              <Button
                variant="outline"
                onClick={handleBack}
                className="mt-4 bg-purple-500/10 text-purple-200 border-purple-500/20 hover:bg-purple-500/20"
              >
                Kembali ke Daftar Artikel
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
        .prose a {
          color: #c4b5fd;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .prose a:hover {
          color: #a78bfa;
        }
        .prose h2, .prose h3, .prose h4 {
          color: #f3f4f6;
        }
        .prose p {
          color: #ddd6fe;
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .prose strong {
          color: #f3f4f6;
        }
        .prose blockquote {
          border-left-color: #a78bfa;
          background-color: rgba(139, 92, 246, 0.1);
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .prose blockquote p {
          color: #e9d5ff;
        }
        .prose code {
          background-color: rgba(139, 92, 246, 0.2);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .prose img {
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </motion.div>
  );
}