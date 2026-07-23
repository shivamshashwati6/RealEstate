import React from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
      {notifications.map((n) => {
        const bgColors = {
          success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
          info: 'bg-slate-900/90 border-teal-500/50 text-teal-200',
          warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
          error: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
        };

        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
        };

        return (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${bgColors[n.type]}`}
          >
            {icons[n.type]}
            <div className="flex-1 text-xs">
              <h5 className="font-bold text-white mb-0.5">{n.title}</h5>
              <p className="text-slate-300 leading-snug">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
