import { XMarkIcon } from '@heroicons/react/24/outline';
import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    // Focus modal container to trap tabbing
    dialogEl.focus();

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const getFocusableEls = () =>
      Array.from(dialogEl.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'Tab') {
        const focusableEls = getFocusableEls();
        if (focusableEls.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && active === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 h-full w-full scale-100 bg-white p-6 opacity-100 transition-all duration-200 focus:outline-none sm:h-auto sm:max-w-lg sm:rounded sm:shadow-lg"
      >
        {children}

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 rounded text-gray-500 hover:text-gray-800"
        >
          <XMarkIcon className="size-6" aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
