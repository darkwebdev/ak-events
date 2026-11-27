import React, { type ReactNode } from 'react';
import './index.css';

interface ToastProps {
  message: string;
  // Optional lines under the message, e.g. each resource gained since the last refresh.
  items?: string[];
}

// A transient, top-right popup used to surface something that happened in the
// background (new events pulled in by App's periodic refetch, resources gained since
// the last account refresh) without interrupting whatever the user's doing. Purely
// presentational — how long it stays up and when it unmounts is the caller's job
// (App.tsx clears the message on a timer), so this never has to reconcile its own
// timer against a caller that dismisses it early.
export function Toast({ message, items }: ToastProps) {
  return (
    <div className="ak-toast" role="status" aria-live="polite">
      {message}
      {items && items.length > 0 && (
        <ul className="ak-toast-items">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Stacks toasts that are up at the same time instead of drawing them on top of
// each other.
export function ToastStack({ children }: { children: ReactNode }) {
  return <div className="ak-toasts">{children}</div>;
}
