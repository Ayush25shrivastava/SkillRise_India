import React from "react";
import { cn } from "../../services/utils";

export const Input = React.forwardRef(
  ({ className, type = "text", icon: Icon, ...props }, ref) => {
    return (
      <div className="relative group w-full flex items-center">
        {Icon && (
          <div className="absolute left-4 z-10 text-white/30 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-[1.2rem] bg-white/[0.03] border border-white/5",
            "px-5 py-2 text-sm text-white font-medium transition-all duration-300",
            "placeholder:text-white/20 outline-none",
            "focus-within:border-indigo-500/40 focus-within:bg-indigo-500/[0.02]",
            "focus-within:shadow-[0_0_20px_rgba(99,102,241,0.05)]",
            Icon ? "pl-12" : "",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
