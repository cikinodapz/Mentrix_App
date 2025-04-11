"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center backdrop-blur-lg bg-black/30 border border-purple-500/20 rounded-xl p-8 max-w-md w-full shadow-[0_0_25px_rgba(167,139,250,0.3)]"
      >
        {/* Header */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300 mb-4"
        >
          404
        </motion.h1>

        {/* Pesan */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-purple-200 mb-2"
        >
          Oops! Halaman yang Anda cari tidak ditemukan.
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-fuchsia-200/80 mb-6"
        >
          Mungkin Anda salah ketik URL atau halaman ini telah dihapus.
        </motion.p>

        {/* Tombol Kembali ke Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => router.push("/")}
            className="group relative bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700/90 hover:to-purple-700/90 border border-blue-400/30 hover:border-blue-400/50 shadow-[0_0_8px_rgba(59,130,246,0.15)] hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
            <div className="relative flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-medium text-white">
                Kembali ke Beranda
              </span>
            </div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}