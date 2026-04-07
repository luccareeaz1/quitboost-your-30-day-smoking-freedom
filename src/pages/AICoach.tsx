import { FreeshNavbar } from "@/components/layout/FreeshNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  History, 
  Settings, 
  Mic, 
  Send,
  Calendar,
  PlayCircle,
  Clock,
  Sparkles,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SESSIONS = [
  "Morning Routine Plan",
  "Weekly Goal Review",
  "Stress Management",
  "Sleep Quality Insights"
];

const MESSAGES = [
  {
    role: "assistant",
    content: "Did you know? Exposure to 15 minutes of direct sunlight before 9 AM can improve your melatonin production by up to 20% for the next sleep cycle. This helps reduce morning cravings significantly.",
    insight: "COACH INSIGHT"
  },
  {
    role: "user",
    content: "That sounds perfect. I have a 30-minute gap at 12:30 PM. Can you suggest a workout that fits that schedule and targets my core?",
  },
  {
    role: "assistant",
    content: "Certainly! Here's a 25-minute 'Core Power' flow designed for your lunch break:",
    plan: [
      "Warm-up: Dynamic Planks (3 min)",
      "Main Flow: Russian Twists & Hollow Holds (18 min)",
      "Cool-down: Cobra Stretch (4 min)"
    ]
  }
];

export default function AICoach() {
  const [activeSession, setActiveSession] = useState("Morning Routine Plan");

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <FreeshNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <Button className="w-full bg-[#2D45C1] hover:bg-[#1E30A1] text-white rounded-2xl h-14 font-bold gap-2 mb-6 shadow-lg shadow-blue-100">
            <Plus className="w-5 h-5" />
            New Session
          </Button>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search sessions..." 
              className="pl-11 h-12 bg-slate-50 border-none rounded-2xl text-sm font-medium"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">PAST SESSIONS</p>
            {SESSIONS.map((session) => (
              <button
                key={session}
                onClick={() => setActiveSession(session)}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-3",
                  activeSession === session 
                    ? "bg-slate-50 text-[#2D45C1] shadow-sm ring-1 ring-slate-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activeSession === session ? "bg-[#2D45C1]" : "bg-slate-200"
                )} />
                {session}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">User Profile</p>
              <p className="text-xs text-slate-500">Premium Member</p>
            </div>
            <button className="text-slate-400 hover:text-slate-900">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col relative bg-[#FDFDFD]">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full pb-32">
            {MESSAGES.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 w-full",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === "assistant" ? "bg-white border border-slate-100 text-[#2D45C1]" : "bg-[#2D45C1] text-white"
                )}>
                  {msg.role === "assistant" ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div className={cn(
                  "flex flex-col gap-2 max-w-[80%]",
                  msg.role === "user" ? "items-end" : "items-start"
                )}>
                  {msg.insight && (
                    <span className="text-[10px] font-bold text-[#2D45C1] tracking-widest mb-1">{msg.insight}</span>
                  )}
                  <div className={cn(
                    "p-6 rounded-3xl text-md leading-relaxed shadow-sm",
                    msg.role === "assistant" 
                      ? "bg-white border border-slate-100 text-slate-700" 
                      : "bg-[#2D45C1] text-white shadow-lg shadow-blue-100"
                  )}>
                    {msg.content}
                    {msg.plan && (
                      <ul className="mt-4 space-y-3">
                        {msg.plan.map((item, idx) => (
                          <li key={idx} className="flex font-mono text-sm items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Quick Actions after AI Response */}
                  {i === MESSAGES.length - 1 && msg.role === "assistant" && (
                    <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
                      <Button variant="outline" className="rounded-full bg-white border-slate-100 text-slate-600 font-bold text-xs gap-2 py-5 px-6 shadow-sm hover:border-[#2D45C1] hover:text-[#2D45C1] transition-all">
                        <Calendar className="w-4 h-4" /> Add to my calendar
                      </Button>
                      <Button variant="outline" className="rounded-full bg-white border-slate-100 text-slate-600 font-bold text-xs gap-2 py-5 px-6 shadow-sm hover:border-[#2D45C1] hover:text-[#2D45C1] transition-all">
                        <PlayCircle className="w-4 h-4" /> Show me the videos
                      </Button>
                      <Button variant="outline" className="rounded-full bg-white border-slate-100 text-slate-600 font-bold text-xs gap-2 py-5 px-6 shadow-sm hover:border-[#2D45C1] hover:text-[#2D45C1] transition-all">
                        <Clock className="w-4 h-4" /> Adjust for 15 mins
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-3 shadow-2xl flex items-center gap-3 backdrop-blur-xl">
              <button className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-[#2D45C1] hover:bg-slate-100 shadow-inner">
                <Mic className="w-6 h-6" />
              </button>
              <Input 
                placeholder="Type your message to Coach Freesh..." 
                className="border-none bg-transparent h-12 text-md focus-visible:ring-0 placeholder:text-slate-400"
              />
              <button className="p-4 bg-[#2D45C1] rounded-full text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
