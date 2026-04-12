import { motion, AnimatePresence } from "framer-motion";
import AppToolbar from "./AppToolbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[40rem] h-[40rem] bg-emerald-100/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] bg-sky-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppToolbar />
        
        <main className="flex-1 lg:pl-80 pt-24 lg:pt-0 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="lg:pl-80 py-12 border-t border-slate-100 mt-auto bg-white/50 backdrop-blur-md">
          <div className="container mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
              QUIT BOOST INC — BEYOND LIMITS TECHNOLOGY
            </p>
            <div className="flex gap-8">
               <FooterLink label="Privacidade" />
               <FooterLink label="Termos" />
               <FooterLink label="Suporte" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
      {label}
    </button>
  );
}
