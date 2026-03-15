import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

export const AppleCard = React.forwardRef<HTMLDivElement, AppleCardProps>(
  ({ className, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[1.5rem] bg-card text-card-foreground shadow-soft border",
          glass && "bg-white/70 backdrop-blur-xl border-white/20 dark:bg-black/70 dark:border-white/10",
          className
        )}
        {...props}
      />
    )
  }
)
AppleCard.displayName = "AppleCard"
