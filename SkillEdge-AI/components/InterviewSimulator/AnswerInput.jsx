import { useState } from "react";

export default function AnswerInput({ onSubmit }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) onSubmit(input);
  };

  return (
    <div>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Type your answer here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Answer
      </button>
    </div>
  );
}
