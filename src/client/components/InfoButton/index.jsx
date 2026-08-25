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
  const { refs, context, floatingStyles, isPositioned } = useFloating({
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
  // exit transition entirely). The transition's own `transform: scale(...)` must NOT
  // land on the same element as `floatingStyles` — floating-ui positions the popover
  // via a `transform: translate(...)`, so spreading transitionStyles' `transform` on
  // top of it (or vice versa) clobbers one or the other. Position/`floatingStyles` goes
  // on this outer element; the transition's opacity/scale goes on the inner wrapper.
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
          // `floatingStyles` starts at an unpositioned default (effectively 0,0)
          // until the arrow/flip/shift middleware actually resolve — without
          // gating visibility on `isPositioned`, the popover (and its arrow, which
          // depends on that same resolved position) briefly renders there first and
          // visibly jumps to the real spot once positioning catches up a frame
          // later. Hiding it until then means it only ever appears already correct.
          style={{ ...floatingStyles, visibility: isPositioned ? 'visible' : 'hidden' }}
          {...getFloatingProps()}
        >
          <div style={transitionStyles}>
            {title && <h3>{title}</h3>}
            {children}
            <FloatingArrow ref={arrowRef} context={context} className="info-arrow" />
          </div>
        </div>
      )}
    </span>
  );
}
