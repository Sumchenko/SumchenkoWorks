import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconButton } from './Button';

export function Tooltip({ content, side = 'top', children, className = '', ...rest }:
  { content: ReactNode; side?: 'top' | 'bottom' } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={('sw-tooltip ' + className).trim()} data-side={side} {...rest}>
      {children}
      <span className="sw-tooltip__bubble" role="tooltip">{content}</span>
    </span>
  );
}

type DialogProps = {
  open: boolean;
  onClose: () => void;
  label?: ReactNode;
  title?: ReactNode;
  closeLabel: string;
  width?: number;
  children?: ReactNode;
  footer?: ReactNode;
};

/* Модальное окно: Esc и клик по подложке закрывают, фокус возвращается на элемент, который его открыл, прокрутка страницы блокируется. */
export function Dialog({ open, onClose, label = 'DIALOG', title, closeLabel, width = 520, children, footer }: DialogProps) {
  const back = useRef<Element | null>(null);
  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.documentElement.style.overflow = prev;
      if (back.current instanceof HTMLElement) back.current.focus({ preventScroll: true });
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sw-dialog-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sw-dialog" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} style={{ maxWidth: width }}>
        <div className="sw-dialog__head">
          <span className="sw-label">{label}</span>
          <IconButton icon="close" label={closeLabel} size="sm" variant="bare" onClick={onClose} autoFocus />
        </div>
        <div className="sw-dialog__body">
          {title ? <h2 className="sw-dialog__title">{title}</h2> : null}
          {children}
        </div>
        {footer ? <div className="sw-dialog__foot">{footer}</div> : null}
      </div>
    </div>
  );
}
