// app/components/InterviewSimulatorWithVoice.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export default function InterviewSimulatorWithVoice() {
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [spoken, setSpoken] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "technical";
  const role =
    type === "technical"
      ? searchParams.get("role") || "Software Engineer"
      : type === "behavioral"
      ? "behavioral"
      : "resume";

  useEffect(() => {
    if (started) {
      enableWebcam();
      fetchNextQuestion();
    }
  }, [started]);

  const enableWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Webcam access denied or not supported:", err);
    }
  };

  const fetchNextQuestion = async () => {
    try {
      setSpoken(false);
      setAnswer("");
      setCountdown(3);

      // 3‑second countdown
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise((res) => setTimeout(res, 1000));
      }
      setCountdown(null);

      // Call your local FastAPI
      const res = await fetch(
        `http://localhost:8000/api/interview/generate-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, role }),
        }
      );
      console.log(res)
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `API error ${res.status}`);
      }

      const { question: generatedQuestion } = await res.json();
      setQuestion(generatedQuestion);
      speakText(generatedQuestion);
    } catch (err) {
      console.error("Error fetching question:", err);
      // fallback question
      const fallback =
        type === "technical"
          ? `Describe a challenge you faced as a ${role}.`
          : type === "behavioral"
          ? "Tell me about a time you worked in a team."
          : "Describe a project mentioned in your resume.";
      setQuestion(fallback);
      speakText(fallback);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setTranscribing(true);
    recognition.onend = () => setTranscribing(false);
    recognition.onerror = (e) => console.error("Speech error:", e);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setAnswer(transcript);
      setSpoken(true);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setTranscribing(false);
    setSpoken(true);
  };

  const handleSubmit = async () => {
    try {
      const evalRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/interview/evaluate-answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer, role }),
        }
      );

      if (!evalRes.ok) {
        const err = await evalRes.json();
        throw new Error(err.detail || `Evaluation failed: ${evalRes.status}`);
      }

      const evaluationData = await evalRes.json();
      console.log("Evaluation result:", evaluationData);
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      fetchNextQuestion();
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-6">Ready to Start Your Interview?</h1>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-transform hover:scale-105"
        >
          Start Interview
        </button>
      </div>
    );
  }

  const canStart = !transcribing;
  const canStop = transcribing;
  const canSubmit = !transcribing && spoken;
  const startLabel = transcribing ? "Speaking..." : spoken ? "Speak Again" : "Start Speaking";
  const btnClass = (enabled) =>
    `${enabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"} px-6 py-2 rounded-lg text-white flex items-center`;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
      <div className="flex w-full max-w-7xl gap-10">
        <motion.div
          className="w-1/3 flex flex-col items-center gap-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg"
            alt="Robot Avatar"
            className="w-48 h-48 rounded-full border-4 border-blue-500"
          />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-64 h-48 rounded-xl border border-gray-600 object-cover scale-x-[-1]"
          />
        </motion.div>

        <div className="w-2/3 space-y-6">
          {countdown !== null && (
            <div className="text-center text-5xl font-bold text-yellow-400 animate-pulse mb-4">
              {countdown}
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-2">
              {type === "technical" ? "Question for" : "Question Type:"}{" "}
              <span className="text-blue-400">{role}</span>
            </h2>
            <p className="text-lg text-blue-300 min-h-[48px]">{question}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
            <h2 className="text-xl font-bold">Your Answer</h2>
            <textarea
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setSpoken(!!e.target.value);
              }}
              disabled={transcribing}
              className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none"
              placeholder="Speak or type your answer here..."
            />

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onMouseEnter={() => setHoveredButton("start")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={startListening}
                disabled={!canStart}
                className={btnClass(canStart)}
              >
                {startLabel}
                {!canStart && hoveredButton === "start" && <XCircle className="ml-2 text-red-500" />}
              </button>

              <button
                onMouseEnter={() => setHoveredButton("stop")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={stopListening}
                disabled={!canStop}
                className={btnClass(canStop)}
              >
                Stop Speaking
                {!canStop && hoveredButton === "stop" && <XCircle className="ml-2 text-red-500" />}
              </button>

              <button
                onMouseEnter={() => setHoveredButton("submit")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={btnClass(canSubmit)}
              >
                Submit & Next
                {!canSubmit && hoveredButton === "submit" && (
                  <XCircle className="ml-2 text-red-500" />
                )}
              </button>

              {transcribing && (
                <span className="text-sm text-purple-400 animate-pulse">🎤 Listening...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
