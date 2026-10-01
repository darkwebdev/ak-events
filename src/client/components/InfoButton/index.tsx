import React, { useState, useRef, type ReactNode } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  arrow,
  FloatingArrow,
  FloatingPortal,
  useHover,
  useClick,
  useDismiss,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import './index.css';

const ARROW_HEIGHT = 7;
const GAP = 2;

export interface InfoButtonProps {
  children: ReactNode;
  title?: string;
  label: ReactNode;
  // Keep every click on the label from reaching the event card around it (whose own
  // click toggles the event's selection) — not only the ones that open or close the
  // popup, as by default (see labelClick). For a label that's only ever a popup trigger.
  isolateClick?: boolean;
  // No dashed underline under the label — for a non-text label like an operator icon.
  plain?: boolean;
}

export function InfoButton({ children, title, label, isolateClick, plain }: InfoButtonProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  // For telling whether a click on the label opened or closed the popup (see
  // labelClick): what last opened it, and — snapshotted when the pointer goes down,
  // since useClick's own handler runs first and changes them — whether it was open
  // and what had opened it.
  const openedBy = useRef<string | undefined>(undefined);
  const atPointerDown = useRef<{ open: boolean; openedBy: string | undefined }>({
    open: false,
    openedBy: undefined,
  });
  const { refs, context, floatingStyles, isPositioned } = useFloating({
    open,
    onOpenChange: (nextOpen, _event, reason) => {
      if (nextOpen) openedBy.current = reason;
      setOpen(nextOpen);
    },
    middleware: [
      offset(ARROW_HEIGHT + GAP),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    placement: 'bottom',
    // `position: fixed` rather than the default `absolute`: an absolutely positioned
    // popover counts toward its scroll container's overflow, so one opened near the
    // edge of the independently-scrolling sidebar (.ak-aside-scroll, whose
    // `overflow-y: auto` also makes its x-axis scrollable) made that sidebar grow a
    // horizontal scrollbar for as long as it showed. A fixed element doesn't count
    // toward any ancestor's overflow, isn't clipped by it either, and autoUpdate still
    // repositions it when that ancestor scrolls.
    strategy: 'fixed',
  });
  const hover = useHover(context, { delay: { open: 50, close: 100 } });
  const click = useClick(context);
  // A tap outside (or Escape) closes it — on a phone there's no hover to leave, so a
  // tapped-open popup otherwise stayed until its label was tapped again.
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss]);
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

  // A click on the label that opens the popup, or closes one a click opened, does only
  // that: it doesn't reach the event card around it, whose own click toggles the
  // event's selection — tapping "(estimated)" on a phone to read it used to select
  // events. A click on a popup hover already opened (desktop) leaves it open
  // (useClick's stickIfOpen), so it carries on to the card and selects as before.
  // isolateClick stops every click regardless.
  const labelClick = (e: React.MouseEvent) => {
    const { open: wasOpen, openedBy: wasOpenedBy } = atPointerDown.current;
    const togglesPopup = !wasOpen || wasOpenedBy === 'click';
    if (isolateClick || togglesPopup) e.stopPropagation();
  };

  return (
    <span className="info-button-wrapper">
      <span
        className={`info-button${plain ? ' plain' : ''}`}
        ref={refs.setReference}
        {...getReferenceProps({
          onPointerDown: () => {
            atPointerDown.current = { open, openedBy: openedBy.current };
          },
          onClick: labelClick,
        })}
      >
        {label}
      </span>
      {isMounted && (
        // Portaled to the end of <body>: rendered in place, it was confined to the
        // stacking context of whatever contained its label — on a phone event card
        // the dates row (z-index: 1), so a rerun's Intelligence Certificates row or
        // the next card, level with it and later in the page, drew over the popup.
        // React events still bubble through a portal to its React parents, hence the
        // click handling below.
        <FloatingPortal>
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
            // A click inside the popup (e.g. on a link) is never a click on the card
            // around its label — and though portaled, its React events still bubble
            // there.
            {...getFloatingProps({ onClick: (e: React.MouseEvent) => e.stopPropagation() })}
          >
            <div style={transitionStyles}>
              {title && <h3>{title}</h3>}
              {children}
            </div>
            {/* A direct child of the popover, not of the transition wrapper: a transformed
              element becomes the containing block for absolutely-positioned descendants,
              so while the wrapper's entry `scale(...)` was on, the arrow was positioned
              against the wrapper (inside the popover's padding) and visibly jumped to
              the popover's edge the moment the transform ended. Like the popover's own
              box (border/background), the arrow doesn't animate — only content does. */}
            <FloatingArrow ref={arrowRef} context={context} className="info-arrow" />
          </div>
        </FloatingPortal>
      )}
    </span>
  );
}
