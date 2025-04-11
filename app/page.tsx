// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import Dashboard from "@/components/dashboard/dashboard";
import AssessmentForm from "@/components/assessment/assessment-form";
import AssessmentResults from "@/components/assessment/assessment-results";
import ArticlesList from "@/components/articles/articles-list";
import ArticleDetail from "@/components/articles/article-detail";
import AdminPanel from "@/components/admin/admin-panel";
import LandingPage from "@/components/landing/landing-page";
import SplashScreen from "@/components/splash-screen";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoute from "@/components/auth/protected-route";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdminStored = localStorage.getItem("isAdmin");

    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(isAdminStored === "true");
      setCurrentPage(isAdminStored === "true" ? "admin" : "dashboard");
    }
  }, []);

  const handleLogin = (email, password) => {
    const isAdminStored = localStorage.getItem("isAdmin");
    setIsAuthenticated(true);
    setIsAdmin(isAdminStored === "true");
    setCurrentPage(isAdminStored === "true" ? "admin" : "dashboard");
  };

  const handleRegister = (userData) => {
    if (userData) {
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentPage("landing");
  };

  const handleAssessmentComplete = (result) => {
    setAssessmentResult(result);
    setCurrentPage("results");
  };

  const handleViewArticle = (article) => {
    setCurrentArticle(article);
    setCurrentPage("article-detail");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage
            onLogin={() => setCurrentPage("login")}
            onRegister={() => setCurrentPage("register")}
          />
        );
      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentPage("register")}
          />
        );
      case "register":
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentPage("login")}
          />
        );
      case "dashboard":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard
              onLogout={handleLogout}
              onStartAssessment={() => setCurrentPage("assessment")}
              onViewArticles={() => setCurrentPage("articles")}
              onViewAdmin={() => setCurrentPage("admin")}
              isAdmin={isAdmin}
            />
          </ProtectedRoute>
        );
      case "assessment":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AssessmentForm
              onComplete={handleAssessmentComplete}
              onCancel={() => setCurrentPage("dashboard")}
            />
          </ProtectedRoute>
        );
      case "results":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AssessmentResults
              result={assessmentResult}
              onBackToDashboard={() => setCurrentPage("dashboard")}
              onViewArticles={() => setCurrentPage("articles")}
            />
          </ProtectedRoute>
        );
      case "articles":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ArticlesList
              onViewArticle={handleViewArticle}
              onBackToDashboard={() => setCurrentPage("dashboard")}
            />
          </ProtectedRoute>
        );
      case "article-detail":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ArticleDetail
              article={currentArticle}
              onBackToArticles={() => setCurrentPage("articles")}
            />
          </ProtectedRoute>
        );
      case "admin":
        return (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminPanel onBackToDashboard={() => setCurrentPage("dashboard")} />
          </ProtectedRoute>
        );
      default:
        return (
          <LandingPage
            onLogin={() => setCurrentPage("login")}
            onRegister={() => setCurrentPage("register")}
          />
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white">
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
        )}
      </div>
    </ThemeProvider>
  );
}