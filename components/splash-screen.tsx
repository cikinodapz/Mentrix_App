"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Definisikan tipe untuk props
interface SplashScreenProps {
  onComplete: () => void;
}

// Definisikan tipe untuk partikel
interface Particle {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  width: number;
  height: number;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [showQuote, setShowQuote] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Quotes about mental health
  const quotes: string[] = [
    "Mental health is not a destination, but a journey.",
    "Your mental health is a priority. Your happiness is essential.",
    "Self-care is how you take your power back.",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or scared.",
    "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
  ];

  const randomQuote: string = quotes[Math.floor(Math.random() * quotes.length)];

  // Ambil ukuran window dan inisialisasi partikel hanya di sisi klien
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Inisialisasi partikel
      const newParticles = Array.from({ length: 20 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
      }));
      setParticles(newParticles);

      // Update ukuran window saat resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Logika untuk progress dan onComplete
  useEffect(() => {
    const quoteTimer = setTimeout(() => {
      setShowQuote(true);
    }, 1000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 400);

    const minDisplayTime = setTimeout(() => {
      if (progress >= 100) {
        onComplete();
      }
    }, 3500);

    return () => {
      clearTimeout(quoteTimer);
      clearInterval(interval);
      clearTimeout(minDisplayTime);
    };
  }, [progress, onComplete]);

  useEffect(() => {
    if (progress >= 100) {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 800);

      return () => clearTimeout(completeTimer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900"
      >
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particles-container">
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-purple-500/20"
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: particle.scale,
                  opacity: particle.opacity,
                }}
                animate={{
                  x: windowSize.width ? Math.random() * windowSize.width : 0,
                  y: windowSize.height ? Math.random() * windowSize.height : 0,
                  transition: {
                    duration: Math.random() * 10 + 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse" as const,
                  },
                }}
                style={{
                  width: `${particle.width}px`,
                  height: `${particle.height}px`,
                  filter: "blur(40px)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Glowing orb behind logo */}
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl"></div>

        {/* Logo dan branding */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Container untuk logo tanpa efek rotate */}
          <motion.div className="relative p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_30px_rgba(139,92,246,0.5)] mb-6 overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-full"></div>

            {/* Efek shine yang bergerak */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white/20 skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                repeatDelay: 3,
              }}
            />

            {/* Logo gambar PNG - ganti dengan path yang benar */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/Logo2.png"
                alt="Mentrix Logo"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-2 text-white"
          >
            Mentrix
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg text-purple-200 mb-8"
          >
            Your Mental Health Journey
          </motion.p>
        </motion.div>

        {/* Quote */}
        <AnimatePresence>
          {showQuote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-md text-center mb-12 px-4"
            >
              <p className="text-lg text-purple-100 italic">"{randomQuote}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading bar dengan efek pulse */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "280px", opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-[280px] h-2 bg-purple-900/50 rounded-full overflow-hidden mb-3"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
          <motion.div
            className="absolute top-0 left-0 h-full w-full rounded-full bg-white/20"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm text-purple-300"
        >
          {progress < 100 ? "Loading..." : "Welcome"}
        </motion.p>

        {/* Animated rings */}
        <div className="absolute z-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="absolute inset-0 rounded-full border-2 border-purple-500/20 w-64 h-64"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.1, 0.2, 0.1] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: 0.5,
            }}
            className="absolute inset-0 rounded-full border-2 border-blue-500/20 w-80 h-80"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.05, 0.15, 0.05] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: 1,
            }}
            className="absolute inset-0 rounded-full border-2 border-indigo-500/20 w-96 h-96"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
