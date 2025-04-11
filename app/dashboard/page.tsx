"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BrainCircuit,
  LogOut,
  ClipboardCheck,
  BookOpen,
  BarChart3,
  Settings,
  User,
  FileText,
  LineChartIcon,
  LoaderIcon,
  ClipboardIcon,
  ActivityIcon,
  TrendingUp,
  TrendingDown,
  History,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { ResponsiveLine } from "@nivo/line";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Konfigurasi Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set auth token jika ada
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

// Tipe untuk data history prediksi
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

interface RecommendedArticle {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  thumbnailId?: string; // Tambahkan ini untuk menyimpan ID thumbnail
}

const mockArticles = [
  {
    id: 1,
    title: "Understanding Depression: Signs and Symptoms",
    excerpt:
      "Learn about the common signs of depression and when to seek help.",
    readTime: 5,
    views: 1243,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Mindfulness Techniques for Anxiety Relief",
    excerpt:
      "Simple mindfulness practices you can incorporate into your daily routine.",
    readTime: 7,
    views: 982,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "The Connection Between Sleep and Mental Health",
    excerpt:
      "How quality sleep impacts your mental wellbeing and tips for better rest.",
    readTime: 6,
    views: 756,
    image: "/placeholder.svg?height=200&width=300",
  },
];

interface DashboardProps {
  onLogout?: () => void;
  onStartAssessment: () => void;
  onViewArticles: () => void;
  onViewAdmin: () => void;
  isAdmin: boolean;
}

// Sidebar component
const Sidebar = ({ isOpen, toggleSidebar, router, onLogout }) => {
  const menuItems = [
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      label: "Assessment",
      path: "/assessment-form",
    },
    {
      icon: <History className="w-5 h-5" />,
      label: "History",
      path: "/prediction-history",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Articles",
      path: "/article-list",
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      label: "Logout",
      path: "/",
      onClick: onLogout, // Add custom click handler for logout
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-950 to-purple-950 border-r border-purple-400/30 shadow-2xl z-50"
        >
          <div className="p-5 flex justify-between items-center border-b border-purple-400/20 px-7">
            <div className="flex items-center gap-2">
              <Image
                src="/Logo3_nobg.png"
                alt="Mentrix Logo"
                width={60}
                height={60}
                className="object-contain"
              />
              {/* <span className="text-xl font-bold text-white">Mentrix</span> */}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-purple-200 hover:text-white hover:bg-purple-900/30"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  router.push(item.path);
                  if (item.label === "Logout") {
                    localStorage.removeItem("token");
                    delete api.defaults.headers.common["Authorization"];
                  }
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-purple-200 hover:bg-purple-900/50 hover:text-white transition-all duration-200"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Dashboard({
  onLogout,
  onStartAssessment,
  onViewArticles,
  onViewAdmin,
  isAdmin,
}: DashboardProps) {
  const [greeting, setGreeting] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [predictionHistory, setPredictionHistory] = useState<
    PredictionHistory[]
  >([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedAssessment, setSelectedAssessment] =
    useState<PredictionHistory | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleViewArticles = () => {
    router.push("/article-list");
  };

  // Di dalam komponen Dashboard, tambahkan state berikut:
  const [recommendedArticles, setRecommendedArticles] = useState<
    RecommendedArticle[]
  >([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Di komponen yang melakukan navigasi ke detail
  const handleArticleClick = (articleId: string) => {
    // Simpan path saat ini sebelum navigasi
    localStorage.setItem("articleBackPath", window.location.pathname);
    router.push(`/article-detail/${articleId}`);
  };

  // Carousel navigation functions
  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, Math.max(0, recommendedArticles.length - 3))
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Calculate visible articles
  const visibleArticles = recommendedArticles.slice(
    currentIndex,
    currentIndex + 3
  );

  // Di dalam komponen Dashboard, tambahkan fungsi untuk memformat data history:
  const getChartData = () => {
    return predictionHistory
      .map((assessment) => ({
        date: new Date(assessment.date).toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        }),
        depressionScore: Number(
          (assessment.probability.Depresi * 100).toFixed(0)
        ),
      }))
      .reverse(); // Reverse agar tanggal terlama di kiri
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }

    const fetchRecommendedArticles = async () => {
      try {
        setLoadingArticles(true);
        const response = await api.get("/user/recommended-articles");
        // Map data dan tambahkan URL thumbnail untuk setiap artikel
        const articlesWithThumbnails = await Promise.all(
          response.data.data.map(async (article: RecommendedArticle) => {
            try {
              const thumbnailResponse = await api.get(
                `/admin/article-thumbnail/${article.id}`,
                { responseType: "blob" } // Untuk menangani gambar
              );
              const thumbnailUrl = URL.createObjectURL(thumbnailResponse.data);
              return { ...article, thumbnail: thumbnailUrl };
            } catch (error) {
              console.error(
                `Failed to fetch thumbnail for article ${article.id}:`,
                error
              );
              return { ...article, thumbnail: null }; // Fallback jika gagal
            }
          })
        );
        setRecommendedArticles(articlesWithThumbnails);
      } catch (error) {
        console.error("Failed to fetch recommended articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    const fetchPredictionHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await api.get("/user/prediction-history");
        setPredictionHistory(response.data.data);
      } catch (error) {
        console.error("Failed to fetch prediction history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (token) fetchPredictionHistory();
    fetchRecommendedArticles(); // Tambahkan ini
    // Hanya ambil data jika ada token
  }, []); // Kosongkan dependency array agar hanya dijalankan sekali saat mount

  const handleLogout = async () => {
    try {
      // Panggil API logout untuk menghapus session di server
      const response = await api.post(
        "/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout response:", response.status); // Debug log

      // Hapus token dari localStorage
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      // Reset states
      setPredictionHistory([]);
      setRecommendedArticles([]);
      setSelectedAssessment(null);
      setProgress(0);

      // Bersihkan cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Redirect ke halaman login
      router.push("/");
      setIsSidebarOpen(false); // Tutup sidebar setelah logout

      if (onLogout) onLogout();
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback cleanup
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setPredictionHistory([]);
      setRecommendedArticles([]);
      setSelectedAssessment(null);
      setProgress(0);
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      router.push("/");
      setIsSidebarOpen(false);
    }
  };

  // Calculate wellness trend (mock calculation)
  const wellnessTrend =
    predictionHistory.length > 1
      ? (
          (predictionHistory[0].probability["Tidak Depresi"] -
            predictionHistory[predictionHistory.length - 1].probability[
              "Tidak Depresi"
            ]) *
          100
        ).toFixed(0)
      : "0";

  return (
    <div className="relative min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        router={router}
        onLogout={handleLogout} // Pass handleLogout to Sidebar
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`p-4 md:p-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="flex justify-between items-center mb-8">
          {/* KIRI: Tombol Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="text-white bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-purple-400/20 shadow-[0_0_10px_rgba(167,139,250,0.2)] hover:bg-transparent hover:text-purple-300 transition-colors duration-300"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          {/* KANAN: Logo + Teks Mentrix + Optional tombol admin */}
          <div className="flex items-center gap-4">
            {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Mentrix
            </h1> */}
            <div className="p-2 rounded-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-purple-400/20 shadow-[0_0_10px_rgba(167,139,250,0.2)]">
              <div className="w-16 h-16 relative">
                <Image
                  src="/Logo3_nobg.png"
                  alt="Mentrix Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
            </div>

            {isAdmin && (
              <Button
                variant="outline"
                onClick={onViewAdmin}
                className="border-purple-500/30 text-purple-100 hover:bg-purple-900/30 hover:text-white transition-colors duration-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            {/* <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-purple-100 bg-gradient-to-br from-indigo-900/50 hover:bg-purple-900/30 hover:text-white transition-colors duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button> */}
          </div>
        </header>
        <main className="space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-lg bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-fuchsia-950/80 border border-purple-400/30 shadow-[0_0_20px_rgba(167,139,250,0.25)]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                      {greeting} Wellcome Back!!
                    </CardTitle>
                    <CardDescription className="text-fuchsia-200/80 text-sm mt-1">
                      Track your mental health journey
                    </CardDescription>
                  </div>
                  <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5 rounded-full">
                    <div className="bg-black/40 backdrop-blur-md rounded-full p-1.5">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Assessment Button */}
                  <Button
                    onClick={() => router.push("/assessment-form")}
                    className="group relative h-auto py-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700/90 hover:to-purple-700/90 border border-blue-400/30 hover:border-blue-400/50 shadow-[0_0_8px_rgba(59,130,246,0.15)] hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm">
                        <ClipboardCheck className="w-5 h-5 text-blue-200" />
                      </div>
                      <span className="text-base font-medium text-white">
                        Take Assessment
                      </span>
                    </div>
                  </Button>

                  {/* Articles Button */}
                  <Button
                    variant="outline"
                    onClick={() => router.push("/prediction-history")}
                    className="group relative h-auto py-4 border border-purple-400/30 bg-gradient-to-br from-purple-950/50 to-fuchsia-950/50 hover:bg-purple-900/40 hover:border-purple-400/50 shadow-[0_0_8px_rgba(139,92,246,0.1)] hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 backdrop-blur-sm">
                        <History className="w-5 h-5 text-purple-200" />
                      </div>
                      <span className="text-base font-medium text-purple-100">
                        Prediction History
                      </span>
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
              transition={{ delay: 0.2, duration: 0.6 }}
              className="md:col-span-2"
            >
              <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-fuchsia-950/80 border border-purple-400/30 shadow-[0_0_25px_rgba(167,139,250,0.3)]">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                        Assessment History
                      </CardTitle>
                      <CardDescription className="text-fuchsia-200 mt-1">
                        Track your wellness journey
                      </CardDescription>
                    </div>
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5 rounded-full">
                      <div className="bg-black/40 backdrop-blur-md rounded-full p-2">
                        <LineChartIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-purple-500/20">
                      <div>
                        <p className="text-sm text-purple-200 font-medium">
                          Latest assessment
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                            {predictionHistory.length > 0
                              ? `${(
                                  predictionHistory[0].probability.Depresi * 100
                                ).toFixed(0)}`
                              : "--"}
                          </p>
                          <span className="text-sm text-fuchsia-300 font-medium">
                            / 100
                          </span>
                        </div>
                        <p className="text-xs text-purple-300 mt-1">
                          {predictionHistory.length > 0
                            ? new Date(
                                predictionHistory[0].date
                              ).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "No data yet"}
                        </p>
                      </div>

                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(139, 92, 246, 0.1)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeDasharray={`${
                              predictionHistory.length > 0
                                ? predictionHistory[0].probability.Depresi *
                                  100 *
                                  2.83
                                : 0
                            } 283`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#c084fc" />
                              <stop offset="100%" stopColor="#f472b6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute text-xl font-bold text-white">
                          {predictionHistory.length > 0
                            ? `${(
                                predictionHistory[0].probability.Depresi * 100
                              ).toFixed(0)}%`
                            : "--"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-1.5">
                      <p className="text-sm font-medium text-purple-200 px-1 mb-2">
                        Assessment timeline
                      </p>

                      {loadingHistory ? (
                        <div className="flex justify-center py-4">
                          <LoaderIcon className="w-5 h-5 text-purple-300 animate-spin" />
                          <p className="text-purple-200 ml-2">
                            Loading history...
                          </p>
                        </div>
                      ) : predictionHistory.length > 0 ? (
                        predictionHistory
                          .slice(0, 4)
                          .map((assessment, index) => (
                            <div
                              key={assessment.id}
                              className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-500/20"
                              onClick={() => setSelectedAssessment(assessment)}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2 h-10 rounded-full ${
                                    assessment.probability.Depresi > 0.5
                                      ? "bg-gradient-to-b from-amber-400 to-red-500"
                                      : "bg-gradient-to-b from-blue-400 to-violet-500"
                                  }`}
                                />
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {new Date(
                                      assessment.date
                                    ).toLocaleDateString("id-ID", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                  <p className="text-xs text-purple-300">
                                    {assessment.riskLevel}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      assessment.probability.Depresi > 0.5
                                        ? "bg-gradient-to-r from-amber-400 to-red-500"
                                        : "bg-gradient-to-r from-blue-400 to-violet-500"
                                    }`}
                                    style={{
                                      width: `${(
                                        assessment.probability.Depresi * 100
                                      ).toFixed(0)}%`,
                                    }}
                                  />
                                </div>
                                <span
                                  className={`text-sm font-bold ${
                                    assessment.probability.Depresi > 0.5
                                      ? "text-amber-400"
                                      : "text-violet-300"
                                  }`}
                                >
                                  {(
                                    assessment.probability.Depresi * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-center border border-purple-500/10">
                          <ClipboardIcon className="w-8 h-8 text-purple-400/50 mx-auto mb-2" />
                          <p className="text-purple-200 font-medium">
                            No assessment history yet
                          </p>
                          <p className="text-xs text-purple-300 mt-1">
                            Complete your first assessment to see results
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 bg-purple-500/10 text-purple-200 border-purple-500/20 hover:bg-purple-500/20"
                          >
                            Start Assessment
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-fuchsia-950/80 border border-purple-400/30 shadow-[0_0_25px_rgba(167,139,250,0.3)]">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                        Quick Stats
                      </CardTitle>
                      <CardDescription className="text-fuchsia-200 mt-1">
                        Your activity overview
                      </CardDescription>
                    </div>
                    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5 rounded-full">
                      <div className="bg-black/40 backdrop-blur-md rounded-full p-2">
                        <ActivityIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Assessments Taken */}
                    <div className="group relative overflow-hidden transition-all duration-300 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-600/30 backdrop-blur-md">
                          <ClipboardCheck className="w-6 h-6 text-blue-300" />
                        </div>

                        <div className="flex-grow">
                          <p className="text-sm font-medium text-blue-200">
                            Assessments Taken
                          </p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold text-white">
                              {predictionHistory.length}
                            </p>
                            <p className="text-xs font-medium text-blue-300/80">
                              {predictionHistory.length === 1
                                ? "assessment"
                                : "assessments"}
                            </p>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="h-10 w-20">
                            <div className="h-full flex items-end justify-evenly">
                              {[0.3, 0.5, 0.4, 0.7, 0.6, 0.8].map(
                                (height, index) => (
                                  <div
                                    key={index}
                                    className="w-1.5 bg-gradient-to-t from-blue-400 to-cyan-400 rounded-t"
                                    style={{ height: `${height * 100}%` }}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wellness Trend */}
                    <div className="group relative overflow-hidden transition-all duration-300 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-br from-indigo-600/30 to-violet-600/30 backdrop-blur-md">
                          <BarChart3 className="w-6 h-6 text-indigo-300" />
                        </div>

                        <div className="flex-grow">
                          <p className="text-sm font-medium text-indigo-200">
                            Wellness Trend
                          </p>
                          <div className="flex items-baseline gap-1">
                            <p
                              className={`text-2xl font-bold ${
                                wellnessTrend.startsWith("-")
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              {wellnessTrend.startsWith("-")
                                ? wellnessTrend
                                : `+${wellnessTrend}`}
                              %
                            </p>
                            <p className="text-xs font-medium text-indigo-300/80">
                              this month
                            </p>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <div
                            className={`flex items-center justify-center h-10 w-10 rounded-full ${
                              wellnessTrend.startsWith("-")
                                ? "bg-red-500/10"
                                : "bg-green-500/10"
                            }`}
                          >
                            {wellnessTrend.startsWith("-") ? (
                              <TrendingDown
                                className={`w-5 h-5 text-red-400`}
                              />
                            ) : (
                              <TrendingUp
                                className={`w-5 h-5 text-green-400`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prediction Trend Chart */}
                    <div className="group relative overflow-hidden transition-all duration-300 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <p className="text-sm font-medium text-purple-200 mb-4">
                          Prediction Trend Overtime
                        </p>
                        {predictionHistory.length > 0 ? (
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={getChartData()}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(168, 85, 247, 0.2)"
                              />
                              <XAxis
                                dataKey="date"
                                stroke="#c084fc"
                                tick={{ fill: "#c084fc", fontSize: 12 }}
                              />
                              <YAxis
                                stroke="#c084fc"
                                tick={{ fill: "#c084fc", fontSize: 12 }}
                                domain={[0, 100]}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(30, 27, 75, 0.9)",
                                  border: "1px solid rgba(168, 85, 247, 0.3)",
                                  borderRadius: "8px",
                                  color: "#ffffff",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="depressionScore"
                                stroke="#a855f7"
                                strokeWidth={2}
                                dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-[200px] flex items-center justify-center">
                            <p className="text-purple-300">
                              No prediction data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-fuchsia-950/80 border border-purple-400/30 shadow-[0_0_25px_rgba(167,139,250,0.3)]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                      Recommended Articles
                    </CardTitle>
                    <CardDescription className="text-fuchsia-200 mt-1">
                      Personalized content based on your assessments
                    </CardDescription>
                  </div>
                  <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-0.5 rounded-full">
                    <div className="bg-black/40 backdrop-blur-md rounded-full p-2">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {loadingArticles ? (
                  <div className="flex justify-center py-8">
                    <LoaderIcon className="w-5 h-5 text-purple-300 animate-spin" />
                    <p className="text-purple-200 ml-2">Loading articles...</p>
                  </div>
                ) : recommendedArticles.length === 0 ? (
                  <div className="text-center py-8 text-purple-200">
                    No recommended articles available
                  </div>
                ) : (
                  <div className="relative">
                    {/* Navigation Buttons */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-purple-900/50 hover:bg-purple-900/70 text-white rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentIndex >= recommendedArticles.length - 3}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-purple-900/50 hover:bg-purple-900/70 text-white rounded-full"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>

                    {/* Carousel Container */}
                    <div className="overflow-hidden">
                      <motion.div
                        className="flex gap-4"
                        animate={{ x: `-${currentIndex * (100 / 3 + 1.33)}%` }} // Adjust spacing (100/3 for width + gap)
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        {recommendedArticles.map((article) => (
                          <motion.div
                            key={article.id}
                            className="flex-shrink-0 w-[calc(33.333%-1rem)]" // 33.333% width minus gap
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Card
                              className="h-full overflow-hidden bg-white/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group cursor-pointer backdrop-blur-md"
                              onClick={() => handleArticleClick(article.id)}
                            >
                              <div className="w-full h-32 bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 flex items-center justify-center">
                                {article.thumbnail ? (
                                  <img
                                    src={article.thumbnail}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      e.currentTarget.nextElementSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : (
                                  <BookOpen className="w-10 h-10 text-purple-400/50" />
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-medium text-white mb-2 line-clamp-2">
                                  {article.title}
                                </h3>
                                <p className="text-sm text-purple-300 line-clamp-2 mb-3">
                                  {article.content.substring(0, 100)}...
                                </p>
                                <div className="flex items-center justify-between text-xs text-purple-200">
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {article.author.name}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {new Date(
                                      article.createdAt
                                    ).toLocaleDateString("id-ID", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button
                  onClick={handleViewArticles}
                  className="px-5 py-2 rounded-lg bg-purple-800/30 text-white font-medium border border-purple-400/30 shadow-[0_0_15px_rgba(167,139,250,0.3)] hover:bg-gradient-to-br hover:from-indigo-900/50 hover:to-purple-900/50 hover:text-purple-200 hover:shadow-[0_0_10px_rgba(167,139,250,0.2)] transition-all duration-300"
                >
                  View All Articles
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </main>

        {selectedAssessment && (
          <div className="fixed inset-0 bg-gradient-to-br from-black/90 to-purple-950/90 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-xl border border-indigo-400/20 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 max-w-3xl w-full max-h-[90vh] relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

              <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/40 scrollbar-track-transparent">
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
                    >
                      Assessment Results
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-indigo-200 mt-1 flex items-center text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {new Date(selectedAssessment.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </motion.p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedAssessment(null)}
                    className="text-indigo-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-300 relative"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative z-10">
                  {/* Main Status Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-500/20 p-4"
                  >
                    <h3 className="text-base font-medium text-white mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                      Mental Health Status
                    </h3>

                    <div className="flex flex-col items-center">
                      <div className="relative w-36 h-36 mb-4">
                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          {/* Track circles */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke="rgba(30, 27, 75, 0.4)"
                            strokeWidth="12"
                          />

                          {/* Inner healthy probability */}
                          <motion.circle
                            initial={{ strokeDasharray: "0 239" }}
                            animate={{
                              strokeDasharray: `${(
                                selectedAssessment.probability[
                                  "Tidak Depresi"
                                ] * 239
                              ).toFixed(2)} 239`,
                            }}
                            transition={{
                              delay: 0.5,
                              duration: 1.5,
                              ease: "easeInOut",
                            }}
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke="url(#healthy-gradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(
                              selectedAssessment.probability["Tidak Depresi"] *
                              239
                            ).toFixed(2)} 239`}
                          />

                          {/* Outer depression probability - on a slightly larger radius */}
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="rgba(30, 27, 75, 0.4)"
                            strokeWidth="6"
                          />

                          <motion.circle
                            initial={{ strokeDasharray: "0 289" }}
                            animate={{
                              strokeDasharray: `${(
                                selectedAssessment.probability.Depresi * 289
                              ).toFixed(2)} 289`,
                            }}
                            transition={{
                              delay: 0.5,
                              duration: 1.5,
                              ease: "easeInOut",
                            }}
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="url(#depression-gradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${(
                              selectedAssessment.probability.Depresi * 289
                            ).toFixed(2)} 289`}
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                              selectedAssessment.riskLevel === "Depresi"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {selectedAssessment.riskLevel}
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex flex-col items-center"
                          >
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mr-1"></div>
                                <span className="text-xs text-indigo-200">
                                  Healthy
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400 mr-1"></div>
                                <span className="text-xs text-indigo-200">
                                  Depression
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex space-x-2 w-full">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex-1 flex flex-col items-center bg-white/5 rounded-lg p-2 border border-indigo-500/10"
                        >
                          <span className="text-xl font-bold text-white">
                            {(
                              selectedAssessment.probability["Tidak Depresi"] *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                          <span className="text-xs text-indigo-200">
                            Healthy
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="flex-1 flex flex-col items-center bg-white/5 rounded-lg p-2 border border-indigo-500/10"
                        >
                          <span className="text-xl font-bold text-white">
                            {(
                              selectedAssessment.probability.Depresi * 100
                            ).toFixed(0)}
                            %
                          </span>
                          <span className="text-xs text-indigo-200">
                            Depression
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Details & Insights Section */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-3 flex flex-col"
                  >
                    <div className="mb-3">
                      <div
                        className={`p-3 rounded-xl ${
                          selectedAssessment.riskLevel === "Depresi"
                            ? "bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/20"
                            : "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20"
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-1.5 rounded-md mr-2 ${
                              selectedAssessment.riskLevel === "Depresi"
                                ? "bg-red-500/20"
                                : "bg-green-500/20"
                            }`}
                          >
                            {selectedAssessment.riskLevel === "Depresi" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-300"
                              >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-300"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4
                              className={`font-semibold text-base ${
                                selectedAssessment.riskLevel === "Depresi"
                                  ? "text-red-300"
                                  : "text-green-300"
                              }`}
                            >
                              {selectedAssessment.riskLevel === "Depresi"
                                ? "Depression Warning"
                                : "Healthy Status"}
                            </h4>
                            <p className="text-xs text-white/80">
                              {selectedAssessment.riskLevel === "Depresi"
                                ? "Your assessment indicates signs of depression. Consider reaching out to a mental health professional for support."
                                : "Your assessment shows healthy mental status. Maintain your wellbeing with regular self-care and check-ins."}
                            </p>
                          </div>
                        </div>

                        {selectedAssessment.riskLevel === "Depresi" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-2 bg-white/5 p-2 rounded-lg border border-red-500/10"
                          >
                            <h5 className="text-xs font-medium text-red-200 mb-1">
                              Recommended Actions:
                            </h5>
                            <ul className="text-xs text-white/80 space-y-1">
                              <li className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-red-300 mr-1 mt-0.5"
                                >
                                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                                Consult with a mental health professional
                              </li>
                              <li className="flex items-start">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-red-300 mr-1 mt-0.5"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                  <line
                                    x1="12"
                                    y1="17"
                                    x2="12.01"
                                    y2="17"
                                  ></line>
                                </svg>
                                Consider joining a support group
                              </li>
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex-1 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-500/20 p-4"
                    >
                      <h3 className="text-base font-medium text-white mb-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        Assessment Details
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(selectedAssessment.details).map(
                          ([key, value], index) => (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              key={key}
                              className="bg-white/5 p-2 rounded-lg border border-indigo-500/10 hover:border-indigo-500/30 transition-colors"
                            >
                              <p className="text-xs text-indigo-300 uppercase tracking-wider font-medium">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                              <p className="text-base text-white font-medium">
                                {typeof value === "number" ? value : value}
                              </p>
                            </motion.div>
                          )
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="mt-4 flex flex-wrap sm:justify-between gap-3 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center text-indigo-200 text-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Not a clinical diagnosis. Consult healthcare professionals.
                  </motion.div>

                  <div className="flex space-x-2">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAssessment(null)}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-indigo-900/30 transition-all text-xs"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* SVG Gradients */}
              <svg className="hidden">
                <defs>
                  <linearGradient
                    id="depression-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient
                    id="healthy-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>
        )}
      </motion.div>
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
