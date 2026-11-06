import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { openModal } from '@/lib/client';
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    if (open && dialogRef.current) return openModal(dialogRef.current);
  }, [open]);
  if (!open) return null;
  return (
    <dialog ref={dialogRef} className="sw-modal sw-dialog-overlay" aria-label={typeof title === 'string' ? title : undefined}
      onCancel={(e) => { e.preventDefault(); onClose(); }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sw-dialog" style={{ maxWidth: width }}>
        <div className="sw-dialog__head">
          <span className="sw-label">{label}</span>
          <IconButton icon="close" label={closeLabel} size="sm" variant="bare" onClick={onClose} />
        </div>
        <div className="sw-dialog__body">
          {title ? <h2 className="sw-dialog__title">{title}</h2> : null}
          {children}
        </div>
        {footer ? <div className="sw-dialog__foot">{footer}</div> : null}
      </div>
    </dialog>
  );
}
