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
          "rounded-2xl border transition-all duration-300",
          variant === 'default' && "bg-card text-card-foreground border-border",
          variant === 'glass' && "glass",
          variant === 'glass-dark' && "glass-dark",
          className
        )}
        {...props}
      />
    )
  }
)
AppleCard.displayName = "AppleCard"
