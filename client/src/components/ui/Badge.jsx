import React from 'react';
import { cn } from '../../services/utils';

export function Badge({ children, className, variant = "default", ...props }) {
  const variants = {
    default: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    outline: "bg-white/5 text-white/50 border border-white/10"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
