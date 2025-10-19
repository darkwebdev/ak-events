import React, { useState, useRef } from "react";
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
} from "@floating-ui/react";
import "./index.css";

const ARROW_HEIGHT = 7;
const GAP = 2;

export const InfoButton = ({ children, title, label }) => {
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
    placement: "bottom",
  });
  const hover = useHover(context, { delay: { open: 50, close: 100 } });
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click]);

  return (
    <span className="info-button-wrapper">
      <span
        className="info-button"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
          {label}
      </span>
      {open && (
        <div
          className="info-popover"
          ref={refs.setFloating}
          style={floatingStyles}
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
