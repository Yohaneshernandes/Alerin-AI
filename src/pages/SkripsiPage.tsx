import React from "react";
import { useNavigate } from "react-router";
import AlerinSkripsiPanel from "@/components/AlerinSkripsiPanel";

export default function SkripsiPage() {
  const navigate = useNavigate();
  return <AlerinSkripsiPanel onBack={() => navigate("/")} />;
}
