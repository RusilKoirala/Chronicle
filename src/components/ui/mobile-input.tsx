'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const mobileInputVariants = cva(
  "flex w-full border border-input bg-background text-base ring-offset-background transition-all duration-200 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation",
  {
    variants: {
      size: {
        sm: "h-10 px-3 py-2 text-sm rounded-md",
        md: "h-12 px-4 py-3 text-base rounded-lg", // 48px height - comfortable touch
        lg: "h-14 px-5 py-4 text-lg rounded-lg", // 56px height - large touch
      },
      variant: {
        default: "border-input bg-background hover:border-ring/50 focus:border-ring",
        filled: "border-transparent bg-muted hover:bg-muted/80 focus:bg-background focus:border-ring",
        outlined: "border-2 border-input bg-transparent hover:border-ring/50 focus:border-ring",
      },
      state: {
        default: "",
        error: "border-destructive focus:border-destructive focus:ring-destructive/20",
        success: "border-success focus:border-success focus:ring-success/20",
        warning: "border-warning focus:border-warning focus:ring-warning/20",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      state: "default",
    },
  }
);

interface MobileInputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof mobileInputVariants> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ 
    className, 
    type = "text",
    size, 
    variant, 
    state,
    label,
    helperText,
    errorText,
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    value,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleClear = React.useCallback(() => {
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
      onClear?.();
    }, [onClear]);

    const finalState = errorText ? "error" : state;
    const showClearButton = clearable && value && !disabled && isFocused;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            onClick={() => inputRef.current?.focus()}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={inputRef}
            type={type}
            className={cn(
              mobileInputVariants({ size, variant, state: finalState }),
              leftIcon && "pl-10",
              (rightIcon || showClearButton) && "pr-10",
              className
            )}
            value={value}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            // Prevent zoom on iOS
            style={{
              fontSize: size === 'sm' ? '14px' : '16px',
            }}
            {...props}
          />
          
          {rightIcon && !showClearButton && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
          
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-target-comfortable rounded-full p-1"
              aria-label="Clear input"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </button>
          )}
        </div>
        
        {(helperText || errorText) && (
          <p className={cn(
            "text-sm",
            errorText ? "text-destructive" : "text-muted-foreground"
          )}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = "MobileInput";

export { MobileInput, mobileInputVariants };
export type { MobileInputProps };