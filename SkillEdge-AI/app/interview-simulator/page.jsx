"use client";

import { useSearchParams } from "next/navigation";
import InterviewSimulator from "@/components/InterviewSimulator/InterviewSimulator";

export default function InterviewSimulatorPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return <InterviewSimulator type={type} />;
}
