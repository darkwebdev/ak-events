import React from 'react';
import './index.css';

interface ToastProps {
  message: string;
}

// A transient, top-right popup used to surface something that happened in the
// background (new events pulled in by App's periodic refetch) without interrupting
// whatever the user's doing. Purely presentational — how long it stays up and when
// it unmounts is the caller's job (App.tsx clears the message on a timer), so this
// never has to reconcile its own timer against a caller that dismisses it early.
export function Toast({ message }: ToastProps) {
  return (
    <div className="ak-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
