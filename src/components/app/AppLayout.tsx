import { motion, AnimatePresence } from "framer-motion";
import AppToolbar from "./AppToolbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F2F2F7] text-gray-900 overflow-x-hidden">
      {/* Ambient background glows - removed for minimalist design */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#F2F2F7]">
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

        <footer className="py-12 border-t border-gray-200 mt-auto bg-[#F2F2F7]">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-medium font-bold tracking-widest text-gray-400 uppercase">
              QUIT BOOST INC — BEYOND LIMITS TECHNOLOGY
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
