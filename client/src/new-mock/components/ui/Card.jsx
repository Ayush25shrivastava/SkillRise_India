import { cn } from "../../utils/helpers";

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6",
        hover && "hover:border-primary/30 hover:glow-primary transition-all duration-300 cursor-pointer",
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
