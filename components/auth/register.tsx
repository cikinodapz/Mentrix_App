"use client";

import { useState } from "react";
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

// Gunakan instance axios yang sama dengan login
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    programStudi: "", // Default value
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nim) newErrors.nim = "NIM harus diisi";
    else if (!/^\d{10}$/.test(formData.nim))
      newErrors.nim = "NIM harus 10 digit angka";

    if (!formData.name) newErrors.name = "Nama harus diisi";

    if (!formData.email) newErrors.email = "Email harus diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email tidak valid";

    if (!formData.password) newErrors.password = "Password harus diisi";
    else if (formData.password.length < 6)
      newErrors.password = "Password minimal 6 karakter";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const payload = {
        nim: formData.nim,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        programStudi: formData.programStudi,
      };

      const response = await api.post("/user/register", payload);

      // Jika registrasi berhasil
      if (response.status === 201) {
        // Redirect ke halaman login atau langsung login
        router.push("/login");
        // Atau tampilkan pesan sukses
        // setServerError("Registrasi berhasil! Silakan login")
      }
    } catch (error: any) {
      console.error("Register error:", error);

      if (error.response) {
        if (error.response.status === 400) {
          setServerError(error.response.data.message || "Data tidak valid");
        } else if (error.response.status === 409) {
          setServerError("Email atau NIM sudah terdaftar");
        } else {
          setServerError("Terjadi kesalahan server");
        }
      } else if (error.request) {
        setServerError("Tidak ada respon dari server");
      } else {
        setServerError("Terjadi kesalahan saat mengirim data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const programStudiOptions = [
  //   "Sistem Informasi",
  //   "Teknik Informatika",
  //   "Ilmu Komputer",
  //   "Teknik Elektro",
  //   "Manajemen",
  // ];

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
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Buat Akun Baru
          </CardTitle>
          <CardDescription className="text-purple-200">
            Daftarkan diri Anda untuk mulai menggunakan Mentrix
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* NIM Field */}
              <div className="space-y-2">
                <Label htmlFor="nim" className="text-purple-100">
                  NIM
                </Label>
                <Input
                  id="nim"
                  name="nim"
                  placeholder="2211523022"
                  value={formData.nim}
                  onChange={handleChange}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                />
                {errors.nim && (
                  <p className="text-red-400 text-xs mt-1">{errors.nim}</p>
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-100">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-100">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Program Studi Field */}
              <div className="space-y-2">
                <Label htmlFor="programStudi" className="text-purple-100">
                  Program Studi
                </Label>
                <Input
                  id="programStudi"
                  name="programStudi"
                  placeholder="Masukkan Program Studi"
                  value={formData.programStudi}
                  onChange={handleChange}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-100">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-purple-100">
                  Konfirmasi Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Server Error Message */}
              {serverError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {serverError}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-purple-200">
            Sudah punya akun?{" "}
            <Button
              variant="link"
              onClick={onSwitchToLogin}
              className="text-purple-300 hover:text-purple-100 p-0"
            >
              Masuk di sini
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
