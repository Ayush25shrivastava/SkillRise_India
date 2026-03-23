import { cn } from "../../utils/helpers";

export function Card({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        hover && "hover:-translate-y-1.5 hover:border-primary/50 hover:glow-primary hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={cn("text-lg font-semibold text-foreground", className)}>{children}</h3>;
}

export function CardContent({ children, className }) {
  return <div className={cn(className)}>{children}</div>;
}
