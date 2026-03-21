import { cn } from "../../utils/helpers";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-transparent hover:bg-secondary text-foreground",
  ghost: "bg-transparent hover:bg-secondary text-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90 glow-accent",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
  icon: "h-10 w-10",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
