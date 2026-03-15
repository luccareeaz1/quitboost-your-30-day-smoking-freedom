import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Target, Play, History } from "lucide-react";
import { motion } from "framer-motion";

export default function Challenges() {
  const challenges = [
    { id: 1, title: "Delay first cigarette", desc: "Wait an extra 30 minutes before your first cigarette today.", difficulty: "Medium", status: "active" },
    { id: 2, title: "Drink water instead", desc: "Drink a glass of water when you feel a craving.", difficulty: "Easy", status: "available" },
    { id: 3, title: "Take a short walk", desc: "Walk for 10 minutes when the urge hits.", difficulty: "Easy", status: "available" },
    { id: 4, title: "Skip one today", desc: "Smoke one less cigarette than your daily goal today.", difficulty: "Hard", status: "completed", date: "Ontem" },
    { id: 5, title: "Breath exercise", desc: "Do 3 minutes of deep breathing.", difficulty: "Easy", status: "completed", date: "14 de Março" }
  ];

  const active = challenges.filter(c => c.status === "active");
  const available = challenges.filter(c => c.status === "available");
  const completed = challenges.filter(c => c.status === "completed");

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 max-w-4xl mx-auto space-y-16 animate-fade-in">
      <header className="mb-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter">Desafios</h1>
        <p className="text-muted-foreground mt-4 text-lg">Objetivos claros para fortalecer sua jornada.</p>
      </header>

      {/* DESAFIO ATIVO */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">Desafio Ativo</h2>
        </div>
        {active.map(c => (
          <AppleCard key={c.id} className="p-8 border-2 border-primary/20 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-widest">
                  {c.difficulty}
                </span>
                <h3 className="text-3xl font-bold tracking-tight">{c.title}</h3>
                <p className="text-lg text-muted-foreground">{c.desc}</p>
                <div className="pt-4 flex items-center gap-3">
                  <div className="h-2 w-48 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3 rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">33% concluído</span>
                </div>
              </div>
              <Button className="rounded-full px-8 py-6 text-lg bg-foreground text-background font-bold hover:scale-105 transition-transform">
                Concluir Desafio
              </Button>
            </div>
          </AppleCard>
        ))}
      </section>

      {/* DESAFIOS DISPONÍVEIS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Play className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">Disponíveis</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {available.map(c => (
            <AppleCard key={c.id} className="p-6 hover:shadow-lg transition-all cursor-pointer border-border hover:border-primary/30 group">
              <div className="space-y-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-bold uppercase tracking-widest">
                  {c.difficulty}
                </span>
                <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                <Button variant="outline" className="w-full rounded-full mt-4 font-bold border-2">Iniciar</Button>
              </div>
            </AppleCard>
          ))}
        </div>
      </section>

      {/* DESAFIOS CONCLUÍDOS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">Concluídos</h2>
        </div>
        <div className="space-y-4">
          {completed.map(c => (
            <AppleCard key={c.id} className="p-5 bg-secondary/30 border-transparent opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-bold tracking-tight">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">Concluído em: {c.date}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">+15 pts</span>
              </div>
            </AppleCard>
          ))}
        </div>
      </section>
    </div>
  );
}
