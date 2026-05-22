import React, { useEffect, useState } from 'react';
import { Check, AlertCircle, Loader2, Info, X } from 'lucide-react';

const DEFAULT_DURATION = 4000;
const listeners = new Set();
let toasts = [];

const TOAST_LAYOUT =
  'pointer-events-auto flex items-start gap-0 min-h-[52px] w-[min(360px,calc(100vw-2rem))] rounded-xl border px-3 py-3 shadow-[0_4px_14px_rgba(0,0,0,0.05)] backdrop-blur-md';

const TOAST_MESSAGE =
  'text-[13px] font-medium leading-snug m-0 break-words';

const ICON_CLASS = 'w-3.5 h-3.5';

const ICON_WRAPPER =
  'flex items-center justify-center w-7 h-7 rounded-full shrink-0';

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

function removeToast(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function showToast(type, message, options = {}) {
  const id =
    options.id ??
    `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const duration =
    options.duration ?? (type === 'loading' ? Infinity : DEFAULT_DURATION);

  toasts = toasts.filter((t) => t.id !== id);
  toasts = [...toasts, { id, type, message, duration }];
  emit();

  if (Number.isFinite(duration) && duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
}

export const toast = {
  success: (message, options) => showToast('success', message, options),

  error: (message, options) => showToast('error', message, options),

  info: (message, options) => showToast('info', message, options),

  loading: (message, options) => showToast('loading', message, options),

  dismiss: (id) => removeToast(id),
};

const STYLES = {
  success: {
    container: 'bg-green-50/95 border-green-100 text-green-900',
    iconWrapper: 'bg-green-100 text-green-600',
  },
  error: {
    container: 'bg-red-50/95 border-red-100 text-red-900',
    iconWrapper: 'bg-red-100 text-red-600',
  },
  info: {
    container: 'bg-sky-50/95 border-sky-100 text-sky-900',
    iconWrapper: 'bg-sky-100 text-sky-600',
  },
  loading: {
    container: 'bg-slate-50/95 border-slate-200 text-slate-900',
    iconWrapper: 'bg-slate-100 text-slate-600',
  },
};

function ToastItem({ item, onDismiss }) {
  const icons = {
    success: <Check className={`${ICON_CLASS} stroke-[3]`} />,
    error: <AlertCircle className={`${ICON_CLASS} stroke-[2.5]`} />,
    info: <Info className={`${ICON_CLASS} stroke-[2.5]`} />,
    loading: <Loader2 className={`${ICON_CLASS} animate-spin`} />,
  };

  const style = STYLES[item.type] ?? STYLES.info;

  return (
    <div role="status" className={`${TOAST_LAYOUT} ${style.container}`}>
      <div className={`${ICON_WRAPPER} mt-0.5 ${style.iconWrapper}`}>
        {icons[item.type]}
      </div>

      <div className="flex-1 min-w-0 px-2 py-0.5">
        <p className={TOAST_MESSAGE}>{item.message}</p>
      </div>

      {item.type !== 'loading' && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5 text-current opacity-40 transition hover:opacity-70 hover:bg-black/5"
        >
          <X className={ICON_CLASS} />
        </button>
      )}
    </div>
  );
}

function ToastItemAnimated({ item, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`transition-all duration-200 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
      }`}
    >
      <ToastItem item={item} onDismiss={onDismiss} />
    </div>
  );
}

export default function ToastProvider() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const listener = (next) => setItems(next);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {items.map((item) => (
        <ToastItemAnimated
          key={item.id}
          item={item}
          onDismiss={() => removeToast(item.id)}
        />
      ))}
    </div>
  );
}
