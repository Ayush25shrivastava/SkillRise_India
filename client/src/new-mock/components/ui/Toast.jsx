import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "../../utils/helpers";

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, type = "info", duration = 4000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "glass rounded-xl p-4 flex items-start gap-3 shadow-xl animate-fade-in",
              "border",
              t.type === "success" && "border-emerald-500/30",
              t.type === "error" && "border-red-500/30",
              t.type === "info" && "border-blue-500/30"
            )}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              {t.title && <p className="font-medium text-sm text-foreground">{t.title}</p>}
              {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
