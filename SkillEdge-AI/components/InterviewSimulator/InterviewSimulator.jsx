"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

export default function InterviewSimulatorWithVoice() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);            // ← new: store all answers
  const [countdown, setCountdown] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [spoken, setSpoken] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const router = useRouter();
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
      fetchAllQuestions();
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

  const fetchAllQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/interview/generate-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, role }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `API error ${res.status}`);
      }
      const { question: fetched } = await res.json();
      const firstSeven = Array.isArray(fetched) ? fetched.slice(0, 7) : [];
      setQuestions(firstSeven);
      playQuestion(0, firstSeven);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const playQuestion = async (index, qs) => {
    setCurrentIndex(index);
    const text = qs[index];
    setSpoken(false);
    setAnswer("");
    setCountdown(3);
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      // pause 1s
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, 1000));
    }
    setCountdown(null);
    speakText(text);
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
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setTranscribing(true);
    recognition.onend = () => setTranscribing(false);
    recognition.onerror = (e) => console.error("Speech error:", e);

    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript;
      }
      setAnswer((prev) => prev + " " + transcript);
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
    // (optional) send to evaluation API
    try {
      const evalRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/interview/evaluate-answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: questions[currentIndex],
            answer,
            role,
          }),
        }
      );
      if (!evalRes.ok) throw new Error(`Eval error ${evalRes.status}`);
      console.log("Evaluation result:", await evalRes.json());
    } catch (err) {
      console.error(err);
    }

    // 1) store the current answer
    setAnswers((prev) => [...prev, answer]);

    // 2) either advance or finish
    if (currentIndex < questions.length - 1) {
      playQuestion(currentIndex + 1, questions);
    } else {
      // last question → persist and redirect
      const payload = { questions, answers: [...answers, answer] };
      localStorage.setItem("interviewResults", JSON.stringify(payload));
      router.push("/interview/complete");
    }
  };

  const handleTerminate = () => {
    if (
      window.confirm(
        "Terminating now will lose all progress. Are you sure you want to terminate the interview?"
      )
    ) {
      router.push("/");
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
  const startLabel = transcribing
    ? "Speaking..."
    : spoken
    ? "Speak Again"
    : "Start Speaking";
  const btnClass = (enabled) =>
    `${enabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"} px-6 py-2 rounded-lg text-white flex items-center`;
  const isLast = currentIndex === questions.length - 1;
  const submitLabel = isLast ? "Finish Interview" : "Submit & Next";

  return (
    <div className="relative min-h-screen bg-gray-950 text-white p-8">
      {loadingQuestions && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-10">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-white text-lg">Generating Questions...</p>
        </div>
      )}

      <button
        onClick={handleTerminate}
        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Terminate Interview
      </button>

      <h1 className="absolute top-24 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white">
        {`Interview of ${role}`}
      </h1>

      <div className="mt-32 flex items-center justify-center w-full max-w-7xl mx-auto gap-10 opacity-90">
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
            <h2 className="text-xl font-bold mb-2">{`Question ${currentIndex + 1}`}</h2>
            <p className="text-lg text-blue-300 min-h-[48px]">
              {questions[currentIndex]}
            </p>
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
                {!canStart && hoveredButton === "start" && (
                  <XCircle className="ml-2 text-red-500" />
                )}
              </button>
              <button
                onMouseEnter={() => setHoveredButton("stop")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={stopListening}
                disabled={!canStop}
                className={btnClass(canStop)}
              >
                Stop Speaking
                {!canStop && hoveredButton === "stop" && (
                  <XCircle className="ml-2 text-red-500" />
                )}
              </button>
              <button
                onMouseEnter={() => setHoveredButton("submit")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={btnClass(canSubmit)}
              >
                {submitLabel}
                {!canSubmit && hoveredButton === "submit" && (
                  <XCircle className="ml-2 text-red-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
