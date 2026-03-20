import React from 'react';
import { cn } from '../../services/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/5 bg-[#0a0a0f] text-white shadow-xl transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-2 p-8 pb-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-bold text-xl tracking-tight leading-none", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-white/40 font-medium leading-relaxed", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-8 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-8 pt-0", className)} {...props} />;
}
