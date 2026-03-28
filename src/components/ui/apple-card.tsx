import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
  variant?: 'default' | 'glass' | 'glass-dark'
}

export const AppleCard = React.forwardRef<HTMLDivElement, AppleCardProps>(
  ({ className, variant = 'default', glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[2.5rem] border border-white/5 transition-all duration-300",
          variant === 'default' && "bg-card text-card-foreground",
          variant === 'glass' && "bg-white/10 backdrop-blur-xl border-white/20",
          variant === 'glass-dark' && "bg-black/40 backdrop-blur-3xl border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
          (glass || variant === 'glass' || variant === 'glass-dark') && "hover:border-white/20",
          className
        )}
        {...props}
      />
    )
  }
)
AppleCard.displayName = "AppleCard"
