'use client';

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps extends React.ComponentProps<"div"> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "icon" | "text" | "full";
  showText?: boolean;
  href?: string;
}

const logoSizes = {
  xs: "w-6 h-6",
  sm: "w-8 h-8", 
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20 md:w-24 md:h-24"
};

const textSizes = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg", 
  lg: "text-xl",
  xl: "text-2xl md:text-3xl"
};

function Logo({ 
  size = "md", 
  variant = "full", 
  showText = true, 
  className,
  href,
  ...props 
}: LogoProps) {
  const logoContent = (
    <div 
      className={cn(
        "flex items-center gap-2",
        className
      )}
      {...props}
    >
      {/* Logo Icon */}
      {(variant === "icon" || variant === "full") && (
        <div className={cn(
          "bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg",
          logoSizes[size],
          size === "xl" && "shadow-2xl shadow-primary/25"
        )}>
          {/* Try to use the SVG icon first, fallback to text */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/icon0.svg"
              alt="Chronicle Logo"
              width={size === "xl" ? 48 : size === "lg" ? 32 : size === "md" ? 24 : size === "sm" ? 16 : 12}
              height={size === "xl" ? 48 : size === "lg" ? 32 : size === "md" ? 24 : size === "sm" ? 16 : 12}
              className="object-contain"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-primary-foreground font-bold ${
                    size === "xl" ? "text-2xl md:text-3xl" :
                    size === "lg" ? "text-xl" :
                    size === "md" ? "text-base" :
                    size === "sm" ? "text-sm" : "text-xs"
                  }">C</span>`;
                }
              }}
            />
          </div>
        </div>
      )}
      
      {/* Logo Text */}
      {(variant === "text" || (variant === "full" && showText)) && (
        <span className={cn(
          "font-bold text-foreground",
          textSizes[size]
        )}>
          Chronicle
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-flex">
        {logoContent}
      </a>
    );
  }

  return logoContent;
}

// Specialized logo components for common use cases
function LogoIcon({ size = "md", className, ...props }: Omit<LogoProps, "variant" | "showText">) {
  return <Logo variant="icon" size={size} className={className} {...props} />;
}

function LogoText({ size = "md", className, ...props }: Omit<LogoProps, "variant">) {
  return <Logo variant="text" size={size} className={className} {...props} />;
}

function LogoFull({ size = "md", className, ...props }: Omit<LogoProps, "variant">) {
  return <Logo variant="full" size={size} className={className} {...props} />;
}

export { Logo, LogoIcon, LogoText, LogoFull };
export type { LogoProps };