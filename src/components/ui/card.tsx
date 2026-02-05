import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  interactive?: boolean;
  mobile?: boolean;
}

function Card({ 
  className, 
  variant = "default", 
  padding = "md", 
  interactive = false,
  mobile = false,
  ...props 
}: CardProps) {
  const paddingClasses = {
    sm: "py-4",
    md: "py-6", 
    lg: "py-8"
  };

  const variantClasses = {
    default: "bg-card text-card-foreground shadow-system-subtle border",
    elevated: "bg-card text-card-foreground shadow-system-elevated border-0",
    outlined: "bg-card text-card-foreground border-2 shadow-none"
  };

  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive}
      data-mobile={mobile}
      className={cn(
        "flex flex-col gap-6 rounded-xl transition-system-normal",
        variantClasses[variant],
        paddingClasses[padding],
        interactive && [
          "cursor-pointer hover:shadow-system-medium",
          mobile ? "active:scale-[0.98] touch-manipulation" : "hover:scale-[1.02]"
        ],
        mobile && "rounded-lg", // Smaller radius on mobile
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

export type { CardProps }
