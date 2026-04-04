import { motion, AnimatePresence } from "framer-motion";
import AppToolbar from "./AppToolbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050a18] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Ambient background glows - deeper indigo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[160px]" 
          style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[140px]" 
          style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppToolbar />
        
        <main className="flex-1 pt-24 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="py-12 border-t border-white/[0.03] mt-auto">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-medium font-bold tracking-widest text-white/10 uppercase">
              QUIT BOOST INC — BEYOND LIMITS TECHNOLOGY
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
