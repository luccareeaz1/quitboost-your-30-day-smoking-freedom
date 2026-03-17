import { motion } from "framer-motion";

export const BackgroundLines = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M 0 50 Q 25 25 50 50 T 100 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.1"
            className="text-primary"
            animate={{
              d: [
                "M 0 50 Q 25 25 50 50 T 100 50",
                "M 0 50 Q 25 75 50 50 T 100 50",
                "M 0 50 Q 25 25 50 50 T 100 50",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M 0 30 Q 30 60 70 30 T 100 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.1"
            className="text-primary"
            animate={{
              d: [
                "M 0 30 Q 30 60 70 30 T 100 30",
                "M 0 30 Q 30 10 70 30 T 100 30",
                "M 0 30 Q 30 60 70 30 T 100 30",
              ],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
    </div>
  );
};
