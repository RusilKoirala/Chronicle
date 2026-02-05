'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { MobileInput } from "./mobile-input";
import { Button } from "./button";
import { ResponsiveStack } from "./responsive-layout";

const mobileFormVariants = cva(
  "w-full space-y-4",
  {
    variants: {
      variant: {
        default: "bg-background",
        card: "bg-card border rounded-xl p-6 shadow-system-medium",
        modal: "bg-card border rounded-2xl p-6 shadow-system-elevated",
      },
      spacing: {
        tight: "space-y-2",
        normal: "space-y-4",
        loose: "space-y-6",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "normal",
    },
  }
);

interface MobileFormProps
  extends React.ComponentProps<"form">,
    VariantProps<typeof mobileFormVariants> {
  children: React.ReactNode;
}

const MobileForm = React.forwardRef<HTMLFormElement, MobileFormProps>(
  ({ className, variant, spacing, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn(mobileFormVariants({ variant, spacing }), className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);

MobileForm.displayName = "MobileForm";

// Mobile-optimized form field with label and validation
interface MobileFormFieldProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const MobileFormField = React.forwardRef<HTMLDivElement, MobileFormFieldProps>(
  ({ label, helperText, errorText, required, children, className }, ref) => {
    const fieldId = React.useId();

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <label
            htmlFor={fieldId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {React.cloneElement(children as React.ReactElement<any>, {
            id: fieldId,
            'aria-describedby': helperText || errorText ? `${fieldId}-description` : undefined,
            'aria-invalid': errorText ? 'true' : undefined,
          })}
        </div>
        
        {(helperText || errorText) && (
          <p
            id={`${fieldId}-description`}
            className={cn(
              "text-sm",
              errorText ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

MobileFormField.displayName = "MobileFormField";

// Mobile-optimized textarea
const mobileTextareaVariants = cva(
  "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background transition-all duration-200 ease-out placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none touch-manipulation",
  {
    variants: {
      size: {
        sm: "min-h-[60px] px-3 py-2 text-sm",
        md: "min-h-[80px] px-4 py-3 text-base",
        lg: "min-h-[120px] px-5 py-4 text-lg",
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

interface MobileTextareaProps
  extends Omit<React.ComponentProps<"textarea">, "size">,
    VariantProps<typeof mobileTextareaVariants> {
  autoResize?: boolean;
}

const MobileTextarea = React.forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ className, size, variant, state, autoResize = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Auto-resize functionality
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        const adjustHeight = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        };

        textarea.addEventListener('input', adjustHeight);
        adjustHeight(); // Initial adjustment

        return () => textarea.removeEventListener('input', adjustHeight);
      }
    }, [autoResize]);

    return (
      <textarea
        ref={textareaRef}
        className={cn(mobileTextareaVariants({ size, variant, state }), className)}
        style={{
          fontSize: size === 'sm' ? '14px' : '16px', // Prevent zoom on iOS
        }}
        {...props}
      />
    );
  }
);

MobileTextarea.displayName = "MobileTextarea";

// Mobile-optimized select component
interface MobileSelectProps extends Omit<React.ComponentProps<"select">, "size"> {
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outlined";
  state?: "default" | "error" | "success" | "warning";
}

const MobileSelect = React.forwardRef<HTMLSelectElement, MobileSelectProps>(
  ({ 
    className, 
    placeholder, 
    options, 
    size = "md", 
    variant = "default", 
    state = "default",
    ...props 
  }, ref) => {
    const selectVariants = cva(
      "flex w-full rounded-lg border border-input bg-background text-base ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation appearance-none bg-no-repeat bg-right bg-[length:16px_16px] pr-10",
      {
        variants: {
          size: {
            sm: "h-10 px-3 py-2 text-sm bg-[position:right_8px_center]",
            md: "h-12 px-4 py-3 text-base bg-[position:right_12px_center]",
            lg: "h-14 px-5 py-4 text-lg bg-[position:right_16px_center]",
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
      }
    );

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            selectVariants({ size, variant, state }),
            "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMTBMMTIgMTVMMTcgMTAiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')]",
            className
          )}
          style={{
            fontSize: size === 'sm' ? '14px' : '16px', // Prevent zoom on iOS
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

MobileSelect.displayName = "MobileSelect";

// Mobile form button group
interface MobileFormButtonsProps {
  children: React.ReactNode;
  variant?: "horizontal" | "vertical" | "responsive";
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
}

const MobileFormButtons = React.forwardRef<HTMLDivElement, MobileFormButtonsProps>(
  ({ children, variant = "responsive", align = "stretch", className }, ref) => {
    const direction = variant === "vertical" ? "col" : 
                     variant === "horizontal" ? "row" : "responsive";

    return (
      <ResponsiveStack
        ref={ref}
        direction={direction}
        gap="md"
        align={align === "stretch" ? "stretch" : align}
        className={cn("pt-4", className)}
      >
        {children}
      </ResponsiveStack>
    );
  }
);

MobileFormButtons.displayName = "MobileFormButtons";

export {
  MobileForm,
  MobileFormField,
  MobileTextarea,
  MobileSelect,
  MobileFormButtons,
  mobileFormVariants,
  mobileTextareaVariants,
};

export type {
  MobileFormProps,
  MobileFormFieldProps,
  MobileTextareaProps,
  MobileSelectProps,
  MobileFormButtonsProps,
};