"use client";

import { createContext, useContext } from "react";

export type SlideContextValue = {
  index: number;
  total: number;
  isActive: boolean;
};

export const SlideContext = createContext<SlideContextValue | null>(null);

export function useSlide(): SlideContextValue {
  const ctx = useContext(SlideContext);
  if (!ctx) {
    throw new Error("useSlide must be used inside a <Slide> rendered by <SlideDeck>");
  }
  return ctx;
}

export type DeckNavContextValue = {
  current: number;
  total: number;
  labels: string[];
  go: (index: number) => void;
  next: () => void;
  prev: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

export const DeckNavContext = createContext<DeckNavContextValue | null>(null);

export function useDeckNav(): DeckNavContextValue {
  const ctx = useContext(DeckNavContext);
  if (!ctx) {
    throw new Error("useDeckNav must be used inside a <SlideDeck>");
  }
  return ctx;
}
