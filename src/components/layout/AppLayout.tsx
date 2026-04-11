import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const noNavPaths = ['/', '/auth', '/onboarding', '/onboarding-motivo', '/checkout', '/politica-de-privacidade', '/termos-de-uso'];
  const shouldShowNav = !noNavPaths.includes(location.pathname);

  if (!shouldShowNav) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[40rem] h-[40rem] bg-emerald-100/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] bg-sky-100/20 rounded-full blur-[100px]" />
      </div>

      <Sidebar />
      
      <div className="flex-1 min-w-0 relative z-10 transition-all duration-500">
        <main className="lg:pl-0 pt-24 lg:pt-0 pb-32 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="py-12 border-t border-slate-100 bg-white/50 backdrop-blur-md hidden lg:block">
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

      <MobileNav />
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
