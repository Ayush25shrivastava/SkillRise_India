import { cn } from "../../utils/helpers";
import { forwardRef } from "react";

const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground/80">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-secondary/50 px-4 py-2",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
