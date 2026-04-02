import AICoachInterface from "@/components/app/AICoachInterface";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Star, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/app/AppLayout";
import { AppleCard } from "@/components/ui/apple-card";

export default function AICoach() {
  return (
    <AppLayout>
      <AICoachInterface />
    </AppLayout>
  );
}
