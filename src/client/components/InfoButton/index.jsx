import React, { useState, useRef } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
  FloatingArrow,
  useHover,
  useClick,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import './index.css';

const ARROW_HEIGHT = 7;
const GAP = 2;

export function InfoButton({ children, title, label }) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const { refs, context, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(ARROW_HEIGHT + GAP),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
  });
  const hover = useHover(context, { delay: { open: 50, close: 100 } });
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click]);
  // Keeps the popover mounted for the duration of the closing animation, instead of
  // being removed from the DOM the instant `open` flips false (which would skip the
  // exit transition entirely).
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: 'scale(0.96)' },
  });

  return (
    <span className="info-button-wrapper">
      <span className="info-button" ref={refs.setReference} {...getReferenceProps()}>
        {label}
      </span>
      {isMounted && (
        <div
          className="info-popover"
          ref={refs.setFloating}
          style={{ ...floatingStyles, ...transitionStyles }}
          {...getFloatingProps()}
        >
          {title && <h3>{title}</h3>}
          {children}
          <FloatingArrow ref={arrowRef} context={context} className="info-arrow" />
        </div>
      )}
    </span>
  );
}
