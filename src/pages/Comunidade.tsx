import { FreeshNavbar } from "@/components/layout/FreeshNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  TrendingUp, 
  Plus, 
  Share2, 
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  LayoutGrid,
  ChevronRight,
  Flame,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TRENDING = [
  { name: "#Morning5K", count: "1,240 participating", color: "bg-blue-400" },
  { name: "#NoSugarWeek", count: "868 posts", color: "bg-emerald-400" },
  { name: "#DeepBreaths", count: "3,102 posts", color: "bg-indigo-400" },
];

const SUGGESTIONS = [
  { name: "Coach Sarah", handle: "@sarah_freesh", avatar: "SC" },
  { name: "Alex Miller", handle: "@amiller_yoga", avatar: "AM" },
];

const SIDEBAR_ITEMS = [
  { icon: LayoutGrid, label: "Feed", active: true },
  { icon: MessageSquare, label: "Messages" },
  { icon: Users, label: "Groups" },
  { icon: TrendingUp, label: "Ranking" },
  { icon: Trophy, label: "Challenges" },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <FreeshNavbar />
      
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Sidebar */}
        <aside className="md:col-span-2 hidden md:block">
          <div className="space-y-4">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all",
                  item.active 
                    ? "bg-[#2D45C1]/5 text-[#2D45C1] shadow-[0_4px_12px_rgba(45,69,193,0.1)]" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <div className="pt-8 px-4">
              <Button className="w-full bg-[#2D45C1] hover:bg-[#1E30A1] text-white rounded-full h-14 font-black gap-2 shadow-xl shadow-blue-100">
                <Plus className="w-5 h-5 pointer-events-none" />
                Share
              </Button>
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <main className="md:col-span-7">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-6">freesh community</h1>
            <div className="flex gap-8 border-b border-slate-100 pb-1">
              {["For You", "Following", "Challenges"].map((tab, i) => (
                <button 
                  key={tab} 
                  className={cn(
                    "text-sm font-bold pb-4 transition-all relative px-2",
                    i === 0 ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                  {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2D45C1] rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.03)] bg-white rounded-3xl mb-10 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-12 h-12 shadow-sm border border-slate-100">
                  <AvatarFallback className="bg-slate-100 text-slate-400 font-bold">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 transition-all group-focus-within:border-[#2D45C1]/30">
                    <textarea 
                      placeholder="What's happening in your wellness journey?" 
                      className="w-full bg-transparent border-none text-md resize-none focus:outline-none min-h-[60px] placeholder:text-slate-400"
                    />
                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                      <div className="flex gap-4">
                        <button className="text-slate-400 hover:text-[#2D45C1] transition-all"><Plus className="w-5 h-5" /></button>
                        <button className="text-slate-400 hover:text-[#2D45C1] transition-all"><TrendingUp className="w-5 h-5" /></button>
                      </div>
                      <Button className="bg-[#2D45C1] hover:bg-[#1E30A1] text-white px-8 rounded-xl h-10 font-bold shadow-lg shadow-blue-100">Post</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-10">
            {/* Post 1 */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-none shadow-[0_4px_32px_rgba(0,0,0,0.02)] bg-white rounded-3xl overflow-hidden hover:shadow-[0_8px_48px_rgba(0,0,0,0.04)] transition-all">
                <CardContent className="p-8">
                  <div className="flex gap-4 mb-6">
                    <Avatar className="w-14 h-14 ring-4 ring-slate-50/50 border border-slate-100">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" />
                      <AvatarFallback>EG</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">Elena Gilbert</h3>
                          <span className="text-sm font-bold text-slate-400">@elena_fit · 2h</span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 inline-flex">
                          <CheckCircle2 className="w-3 h-3 fill-emerald-100" />
                          <span className="text-[10px] font-black uppercase tracking-widest">30 days badge</span>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-900"><MoreHorizontal className="w-6 h-6" /></button>
                    </div>
                  </div>
                  <p className="text-slate-700 text-md leading-relaxed mb-6 font-medium">
                    Just finished my morning 5k! The Coach IA suggested a new pace and I actually beat my personal best by 15 seconds. Feeling absolutely incredible. Keep pushing everyone! 🏃🏼‍♀️✨
                  </p>
                  <div className="rounded-[2.5rem] overflow-hidden mb-8 aspect-[16/9] bg-slate-100 shadow-inner group">
                    <img 
                      src="https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9" 
                      alt="Runner path" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex items-center gap-10 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all">
                      <Heart className="w-6 h-6" /> <span className="text-sm font-bold">768</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-all">
                      <MessageCircle className="w-6 h-6" /> <span className="text-sm font-bold">24</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-all ml-auto">
                      <Share className="w-6 h-6" /> <span className="text-sm font-bold">12</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Post 2 */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-none shadow-[0_4px_32px_rgba(0,0,0,0.02)] bg-white rounded-3xl overflow-hidden hover:shadow-[0_8px_48px_rgba(0,0,0,0.04)] transition-all">
                <CardContent className="p-8">
                  <div className="flex gap-4 mb-4">
                    <Avatar className="w-14 h-14 ring-4 ring-slate-50/50 border border-slate-100">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" />
                      <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">Marcus King</h3>
                          <span className="text-sm font-bold text-slate-400">@m_king_wellness · 5h</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 text-[#2D45C1] px-2 py-0.5 rounded-lg border border-blue-100 inline-flex">
                          <Flame className="w-3 h-3 fill-blue-50" />
                          <span className="text-[10px] font-black uppercase tracking-widest">110 days streak</span>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-900"><MoreHorizontal className="w-6 h-6" /></button>
                    </div>
                  </div>
                  <p className="text-slate-700 text-md leading-relaxed font-medium">
                    Consistency is the only hack. 112 days and haven't missed a single hydration goal. The community here is what keeps me going. Who's hitting their targets today? 💧
                  </p>
                  <div className="flex items-center gap-10 mt-6 pt-4 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all">
                      <Heart className="w-6 h-6" /> <span className="text-sm font-bold">42</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-all">
                      <MessageCircle className="w-6 h-6" /> <span className="text-sm font-bold">8</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="md:col-span-3 space-y-10">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              Trending Challenges
            </h2>
            <div className="space-y-6">
              {TRENDING.map((challenge) => (
                <div key={challenge.name} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fitness • Trending</p>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-1" />
                  </div>
                  <h4 className="text-md font-black text-slate-900 group-hover:text-[#2D45C1] transition-all mb-1">{challenge.name}</h4>
                  <p className="text-sm font-bold text-slate-500">{challenge.count}</p>
                </div>
              ))}
              <button className="text-sm font-bold text-[#2D45C1] hover:underline pt-2">Show more</button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black text-slate-900 mb-8">Who to follow</h2>
            <div className="space-y-8">
              {SUGGESTIONS.map((user) => (
                <div key={user.name} className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 shadow-sm border border-slate-100 ring-4 ring-slate-50/50">
                    <AvatarFallback className="bg-slate-50 text-slate-400 font-bold">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 truncate mb-0.5">{user.name}</h4>
                    <p className="text-xs font-bold text-slate-400 truncate">{user.handle}</p>
                  </div>
                  <Button variant="outline" className="rounded-xl border-slate-200 text-slate-900 font-black h-10 px-4 text-xs hover:bg-slate-50 transition-all">
                    Follow
                  </Button>
                </div>
              ))}
              <button className="text-sm font-bold text-[#2D45C1] hover:underline pt-2 w-full text-left">Show more</button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-500">Terms of Service</a>
            <a href="#" className="hover:text-slate-500">Privacy Policy</a>
            <a href="#" className="hover:text-slate-500">Cookie Policy</a>
            <a href="#" className="hover:text-slate-500">Accessibility</a>
            <span>© 2026 Freesh Inc.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
