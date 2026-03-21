import React from 'react';
import { cn } from '../../services/utils'; // Assuming this utility exists

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  children, 
  ...props 
}, ref) => {
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 border-transparent",
    secondary: "bg-white/[0.04] text-white/90 border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-white",
    outline: "bg-transparent border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50",
    ghost: "bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white",
    danger: "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]"
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    default: "h-11 px-6 text-sm",
    lg: "h-14 px-10 text-base font-bold",
    icon: "h-11 w-11 flex justify-center items-center"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
