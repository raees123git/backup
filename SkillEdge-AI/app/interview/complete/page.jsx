"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function InterviewComplete() {
  const [data, setData] = useState({ questions: [], answers: [] });
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("interviewResults");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to parse interviewResults:", e);
      router.replace("/");
    }
  }, [router]);

  const { questions, answers } = data;

  return (
    <div
  className="absolute top-24 left-0 w-full bg-gray-950 text-white min-h-screen p-8"
>
  <motion.h1
    className="text-4xl font-bold mb-8 text-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    Your Interview Review
  </motion.h1>

  {/* center everything and constrain width */}
  <div className="max-w-4xl mx-auto space-y-6">
    {questions.map((q, i) => (
      <motion.div
        key={i}
        className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-blue-300">
          {`Question ${i + 1}`}
        </h2>
        <p className="mb-4">{q}</p>
        <h3 className="text-lg font-semibold mb-1 text-blue-300">Your Answer:</h3>
        <p className="whitespace-pre-wrap">{answers[i]}</p>
      </motion.div>
    ))}
  </div>

  <div className="flex justify-center mt-12">
    <button
      onClick={() => {
        localStorage.removeItem("interviewResults");
        router.push("/");
      }}
      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-transform hover:scale-105"
    >
      Back to Home
    </button>
  </div>
</div>

  );
}
