import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppleCard } from "@/components/ui/apple-card";
import { Button } from "@/components/ui/button";
import { 
  Heart, Wind, Activity, Wallet, Cigarette, 
  MessageCircle, Target, Trophy, Flame, CheckCircle2 
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  // Mock data for now, will integrate Supabase hook next
  const [now, setNow] = useState(new Date());
  
  // Fake quit date 5 days and 4 hours ago
  const quitDate = new Date(Date.now() - (5 * 24 * 60 * 60 * 1000) - (4 * 60 * 60 * 1000) - (20 * 60 * 1000));
  const diffMs = now.getTime() - quitDate.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  
  const days = Math.floor(diffSeconds / (3600 * 24));
  const hours = Math.floor((diffSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const cigarettesPerDay = 20;
  const pricePerCigarette = 0.50; // $10 per pack
  const avoided = Math.floor((diffSeconds / (3600 * 24)) * cigarettesPerDay);
  const saved = avoided * pricePerCigarette;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const healthMilestones: { label: string; hours: number; icon: React.ElementType }[] = [
    { label: "20 minutes: BP drops", hours: 0.33, icon: Heart },
    { label: "8 hours: Oxygen normalizes", hours: 8, icon: Wind },
    { label: "24 hours: Heart attack risk lowers", hours: 24, icon: Activity },
    { label: "48 hours: Senses improve", hours: 48, icon: Flame },
    { label: "1 week: Nicotine out of system", hours: 168, icon: Target },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto space-y-12 animate-fade-in">
      
      {/* HEADER SECTION */}
      <header className="text-center space-y-4 mb-16">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
          className="text-muted-foreground uppercase tracking-widest text-sm font-semibold"
        >
          Your Journey
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl font-semibold tracking-tighter"
        >
          Breathe Again.
        </motion.h1>
      </header>

      {/* CORE TIMER (Priority 1) */}
      <section className="flex flex-col items-center justify-center">
        <AppleCard className="p-10 sm:p-14 text-center max-w-3xl w-full">
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 font-medium">Smoke-free time</p>
          <div className="grid grid-cols-4 gap-4 sm:gap-8 divide-x divide-border">
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-7xl font-bold tracking-tighter">{days}</span>
              <span className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">Days</span>
            </div>
            <div className="flex flex-col items-center pl-4 sm:pl-8">
              <span className="text-5xl sm:text-7xl font-bold tracking-tighter">{String(hours).padStart(2, "0")}</span>
              <span className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">Hours</span>
            </div>
            <div className="flex flex-col items-center pl-4 sm:pl-8">
              <span className="text-5xl sm:text-7xl font-bold tracking-tighter">{String(minutes).padStart(2, "0")}</span>
              <span className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">Mins</span>
            </div>
            <div className="flex flex-col items-center pl-4 sm:pl-8">
              <span className="text-5xl sm:text-7xl font-bold tracking-tighter text-muted-foreground/40">{String(seconds).padStart(2, "0")}</span>
              <span className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">Secs</span>
            </div>
          </div>
        </AppleCard>
      </section>

      {/* SECONDARY STATS (Priority 2 & 3) */}
      <div className="grid sm:grid-cols-2 gap-6">
        <AppleCard className="p-8 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground font-medium mb-1">Money Saved</p>
            <p className="text-4xl font-semibold tracking-tight">${saved.toFixed(2)}</p>
          </div>
          <Wallet className="h-10 w-10 text-muted-foreground/30" />
        </AppleCard>
        <AppleCard className="p-8 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground font-medium mb-1">Cigarettes Avoided</p>
            <p className="text-4xl font-semibold tracking-tight">{avoided}</p>
          </div>
          <Cigarette className="h-10 w-10 text-muted-foreground/30" />
        </AppleCard>
      </div>

      {/* CHALLENGES (Priority 4) */}
      <div className="grid md:grid-cols-2 gap-6">
        <AppleCard className="p-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
            <Target className="mr-2 h-6 w-6" />
            Active Challenge
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Delay first cigarette</h3>
            <p className="text-muted-foreground">Wait an extra 30 minutes before your first cigarette today.</p>
            <Button className="w-full rounded-full font-medium mt-6 bg-foreground text-background">
              <CheckCircle2 className="mr-2 h-5 w-5" /> Mark as Completed
            </Button>
          </div>
        </AppleCard>

        <AppleCard className="p-8" onClick={() => navigate("/coach")}>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 flex items-center">
            <MessageCircle className="mr-2 h-6 w-6" />
            AI Support
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground font-medium italic">"Você está indo muito bem! Lembre-se que cada cigarro evitado é uma vitória para sua saúde."</p>
            <Button variant="outline" className="w-full mt-4 rounded-full font-medium">Talk to Coach</Button>
          </div>
        </AppleCard>
      </div>

      {/* DAILY LOG (Moved down) */}
      <AppleCard className="p-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Daily Progress</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-5xl font-bold tracking-tighter">0</span>
            <span className="text-muted-foreground font-medium mb-1">/ 5 allowed today</span>
          </div>
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-foreground w-0 rounded-full" />
          </div>
          <p className="text-sm text-muted-foreground mt-4">You have smoked 0 cigarettes today. Great job!</p>
          <Button variant="outline" className="w-full mt-4 rounded-full font-medium">Log a cigarette</Button>
        </div>
      </AppleCard>

      {/* HEALTH TIMELINE (Priority 5) */}
      <AppleCard className="p-8 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-8">Health Recovery</h2>
        <div className="space-y-8">
          {healthMilestones.map((milestone, idx) => {
            const completed = (diffSeconds / 3600) >= milestone.hours;
            return (
              <div key={idx} className="flex items-center gap-6">
                <div className={`p-4 rounded-full flex-shrink-0 ${completed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  <milestone.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className={`text-lg font-medium tracking-tight ${completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {milestone.label}
                  </p>
                </div>
                {completed && <CheckCircle2 className="h-6 w-6 text-foreground" />}
              </div>
            )
          })}
        </div>
      </AppleCard>

      {/* RECENT ACHIEVEMENTS */}
      <AppleCard className="p-8 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Achievements</h2>
          <Button variant="link" onClick={() => navigate("/achievements")} className="text-muted-foreground hover:text-foreground">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: "First Step", days: 1, icon: Trophy },
            { title: "3 Days Strong", days: 3, icon: Trophy },
          ].map((ach, idx) => (
             <div key={idx} className="flex flex-col items-center justify-center p-6 border border-border rounded-[1.5rem] bg-secondary/50">
               <ach.icon className="h-8 w-8 text-foreground mb-4" />
               <p className="font-medium text-center">{ach.title}</p>
             </div>
          ))}
        </div>
      </AppleCard>
    </div>

  );
}
