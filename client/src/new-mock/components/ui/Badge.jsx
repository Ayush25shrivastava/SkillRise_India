import { cn } from "../../utils/helpers";

export default function Badge({ children, className, variant = "default" }) {
  const variants = {
    default: "bg-secondary text-secondary-foreground border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-white/5 text-muted-foreground border-white/10",
    outline: "bg-transparent text-foreground border-white/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
