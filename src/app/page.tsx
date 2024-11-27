/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import TypewriterTest from "./components/TypewriterTest";
import PerformanceReport from "./components/PerformanceReport";
import { ThemeProvider } from "next-themes";
import Preloader from "./components/Preloader";
import { Toaster } from "@/components/ui/toaster";

export default function TypewriterTestApp() {
  const [testSettings, setTestSettings] = useState({
    includePunctuation: true,
    includeNumbers: true,
    wordCount: 25,
    timerMode: false,
    timerDuration: 60, // 60 seconds default
  });
  const [testCompleted, setTestCompleted] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleTestComplete = (data: any) => {
    setPerformanceData(data);
    setTestCompleted(true);
  };

  const handleRestart = () => {
    setTestCompleted(false);
    setPerformanceData(null);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50"
          >
            <Preloader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-background text-foreground"
          >
            <Navbar
              testSettings={testSettings}
              setTestSettings={setTestSettings}
            />
            <main className="container mx-auto px-4 py-8">
              {!testCompleted ? (
                <TypewriterTest
                  settings={testSettings}
                  onTestComplete={handleTestComplete}
                  onRestart={handleRestart}
                />
              ) : (
                <PerformanceReport
                  data={performanceData}
                  onRestart={handleRestart}
                />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </ThemeProvider>
  );
}
