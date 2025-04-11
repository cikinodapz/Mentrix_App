"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import Image from "next/image";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginProps {
  onSwitchToRegister: () => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: UserData;
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Harap masukkan email dan password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await api.post<LoginResponse>("/user/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      const { role } = user;

      if (!token) {
        throw new Error("Token tidak diterima dari server");
      }

      // Simpan token dan user data
      setAuthToken(token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin-panel");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error detail:", error.response?.data || error.message);
      if (error.code === "ECONNABORTED") {
        setError("Request timeout - server terlalu lama merespon");
      } else if (error.response) {
        setError(error.response.data?.message || "Terjadi kesalahan server");
      } else if (error.request) {
        setError("Tidak ada respon dari server - pastikan backend berjalan");
      } else {
        setError("Gagal mengirim permintaan: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen p-4"
    >
      <Card className="w-full max-w-md mx-auto overflow-hidden backdrop-blur-lg bg-black/30 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
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
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Selamat Datang di Mentrix
          </CardTitle>
          <CardDescription className="text-purple-200">
            Masuk untuk melanjutkan
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-100">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-purple-100">
                    Password
                  </Label>
                  <Button
                    variant="link"
                    className="text-xs text-purple-300 hover:text-purple-100 p-0"
                  >
                    Lupa password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                  required
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-purple-200">
            Belum punya akun?{" "}
            <Button
              variant="link"
              onClick={onSwitchToRegister}
              className="text-purple-300 hover:text-purple-100 p-0"
            >
              Daftar sekarang
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
