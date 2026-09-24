import { CheckCircle2, Info, X, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Toast = () => {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium text-white animate-slide-up"
          style={{
            background: t.type === 'info'
              ? 'rgba(59,130,246,0.95)'
              : t.type === 'error'
              ? 'rgba(239,68,68,0.95)'
              : 'rgba(22,160,80,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            maxWidth: '360px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {t.type === 'error'
            ? <AlertCircle size={16} className="shrink-0" />
            : t.type === 'info'
            ? <Info size={16} className="shrink-0" />
            : <CheckCircle2 size={16} className="shrink-0" />}
          <span className="leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
