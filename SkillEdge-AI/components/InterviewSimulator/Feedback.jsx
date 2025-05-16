export default function Feedback({ text }) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
      <p className="font-semibold">AI Feedback:</p>
      <p>{text}</p>
    </div>
  );
}
