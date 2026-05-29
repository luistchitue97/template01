"use client";

import { type ReactNode } from "react";
import { useSlide } from "./contexts";

export type SlideProps = {
  /** Short label used by the dot navigator. Read by SlideDeck from props. */
  label: string;
  children: ReactNode;
};

/**
 * Single slide. Reads its `index/isActive/total` from the SlideContext that
 * SlideDeck wraps around every child. The `label` prop is a marker SlideDeck
 * reads off the element directly; this component does not consume it.
 */
export function Slide({ children }: SlideProps) {
  const { isActive } = useSlide();
  return (
    <section
      className="relative shrink-0 w-screen h-[100svh] overflow-hidden"
      aria-hidden={!isActive}
    >
      {children}
    </section>
  );
}
