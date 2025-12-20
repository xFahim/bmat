import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    fallback?: string
  }
>(({ className, children, fallback, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      {children || (
        <span className="text-sm font-medium text-foreground">
          {fallback || "U"}
        </span>
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ComponentProps<"img">
>(({ className, ...props }, ref) => {
  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
})
AvatarImage.displayName = "AvatarImage"

export { Avatar, AvatarImage }

