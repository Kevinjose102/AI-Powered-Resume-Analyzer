import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useAppToast = () => useContext(ToastContext);

let toastId = 0;

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#6C3AFF',
};

export const AppToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => {
          const Icon = iconMap[toast.type];
          const color = colorMap[toast.type];
          return (
            <div
              key={toast.id}
              className="glass glass-md glass-no-hover pointer-events-auto flex items-center gap-3 px-5 py-3 min-w-[300px] toast-enter"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <Icon size={18} style={{ color, flexShrink: 0 }} />
              <span className="text-sm text-jf-text-primary flex-1">{toast.message}</span>
              <div className="absolute bottom-0 left-0 h-[2px] w-full">
                <div
                  className="h-full"
                  style={{
                    background: color,
                    animation: 'shrink-bar 4s linear forwards',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes shrink-bar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
