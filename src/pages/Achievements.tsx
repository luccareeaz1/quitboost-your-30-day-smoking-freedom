import { AppleCard } from "@/components/ui/apple-card";
import { Trophy, Star, TrendingUp, Award, Zap, Heart } from "lucide-react";

export default function Achievements() {
  const badges = [
    { title: "First Step", desc: "1 day smoke-free", unlocked: true, icon: Trophy },
    { title: "3 Days Strong", desc: "Physical withdrawal peaks", unlocked: true, icon: TrendingUp },
    { title: "One Week Freedom", desc: "7 whole days", unlocked: false, icon: Star },
    { title: "1 Month Milestone", desc: "Lungs begin to clean", unlocked: false, icon: Award },
    { title: "90 Days Pure", desc: "Breathing improves noticeably", unlocked: false, icon: Zap },
    { title: "1 Year Smoke-Free", desc: "Risk of blockages halved", unlocked: false, icon: Heart },
  ];

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 max-w-5xl mx-auto space-y-12 animate-fade-in">
      <header className="mb-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter">Achievements</h1>
        <p className="text-muted-foreground mt-4 text-lg">Every milestone is a victory for your health.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {badges.map((b, i) => (
          <AppleCard 
            key={i} 
            className={`flex flex-col items-center text-center p-8 sm:p-12 transition-all ${
              b.unlocked 
                ? 'bg-foreground text-background shadow-xl hover:scale-105' 
                : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
            }`}
          >
            <div className={`p-5 rounded-full mb-6 ${b.unlocked ? 'bg-background/20' : 'bg-muted'}`}>
              <b.icon className={`w-10 h-10 ${b.unlocked ? 'text-background' : 'text-muted-foreground'}`} />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight mb-2">{b.title}</h3>
            <p className={b.unlocked ? 'text-background/80' : 'text-muted-foreground'}>{b.desc}</p>
            {b.unlocked && (
              <span className="mt-6 text-sm font-medium uppercase tracking-widest opacity-80">Unlocked</span>
            )}
          </AppleCard>
        ))}
      </div>
    </div>
  );
}
