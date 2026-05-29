"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useSlide } from "./contexts";

/**
 * Slide entrance orchestrator. Reads declarative markers off DOM and
 * builds a single GSAP timeline gated on `isActive`. Re-fires every time
 * the slide is re-entered. Returns a ref for the slide root.
 *
 * Marker attributes (each takes a number string to set its order in the
 * timeline, optional — defaults to source order):
 *
 *   data-anim       → y(28) + opacity fade (default for headlines, copy)
 *   data-draw       → scaleX(0→1) from left  (rules, dividers)
 *   data-pop        → scale(0→1) with back ease (dots, badges, numerals)
 *   data-grow-x     → scaleX(0→1) from left  (horizontal bars)
 *   data-grow-y     → scaleY(0→1) from bottom (vertical bars)
 *   data-path       → SVG path/polyline stroke draw
 *   data-count      → number count up. Reads:
 *                     data-count="42.1"
 *                     data-prefix="$"  data-suffix="M"
 *                     data-decimals="1"
 *   data-pulse      → ambient yoyo scale/opacity loop while active
 */
export function useSlideIntro<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T | null>(null);
  const { isActive } = useSlide();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const sel = <K extends Element>(s: string) =>
        Array.from(root.querySelectorAll<K>(s));

      const ys     = sel<HTMLElement>("[data-anim]");
      const rises  = sel<HTMLElement>("[data-rise]");
      const draws  = sel<HTMLElement>("[data-draw]");
      const pops   = sel<HTMLElement>("[data-pop]");
      const growsX = sel<HTMLElement>("[data-grow-x]");
      const growsY = sel<HTMLElement>("[data-grow-y]");
      const paths  = sel<SVGGeometryElement>("[data-path]");
      const counts = sel<HTMLElement>("[data-count]");
      const pulses = sel<HTMLElement>("[data-pulse]");

      const formatCount = (v: number, el: HTMLElement) => {
        const decimals = Number.parseInt(el.dataset.decimals ?? "0", 10) || 0;
        const prefix = el.dataset.prefix ?? "";
        const suffix = el.dataset.suffix ?? "";
        return `${prefix}${v.toFixed(decimals)}${suffix}`;
      };

      // Inactive: snap to final visible state and stop ambient loops.
      if (!isActive) {
        gsap.killTweensOf([
          ...ys, ...rises, ...draws, ...pops, ...growsX, ...growsY, ...pulses,
        ]);
        paths.forEach((p) => gsap.killTweensOf(p));
        counts.forEach((el) => gsap.killTweensOf(el));

        gsap.set(ys,     { clearProps: "transform,opacity" });
        gsap.set(rises,  { clearProps: "transform" });
        gsap.set(draws,  { clearProps: "transform" });
        gsap.set(pops,   { clearProps: "transform,opacity" });
        gsap.set(growsX, { clearProps: "transform" });
        gsap.set(growsY, { clearProps: "transform" });
        gsap.set(pulses, { clearProps: "transform,opacity" });
        paths.forEach((p) => gsap.set(p, { clearProps: "strokeDasharray,strokeDashoffset" }));
        counts.forEach((el) => {
          const target = Number.parseFloat(el.dataset.count ?? "0");
          el.textContent = formatCount(target, el);
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (ys.length) {
        tl.from(ys, { y: 28, opacity: 0, duration: 0.85, stagger: 0.055 }, 0);
      }
      if (rises.length) {
        tl.from(
          rises,
          { yPercent: 100, duration: 0.95, stagger: 0.06, ease: "power4.out" },
          0,
        );
      }
      if (draws.length) {
        tl.from(
          draws,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.75,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.1,
        );
      }
      if (pops.length) {
        tl.from(
          pops,
          {
            scale: 0,
            opacity: 0,
            transformOrigin: "center center",
            duration: 0.55,
            stagger: 0.04,
            ease: "back.out(2.2)",
          },
          0.15,
        );
      }
      if (growsX.length) {
        tl.from(
          growsX,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.95,
            stagger: 0.06,
            ease: "power3.inOut",
          },
          0.25,
        );
      }
      if (growsY.length) {
        tl.from(
          growsY,
          {
            scaleY: 0,
            transformOrigin: "bottom center",
            duration: 0.9,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.2,
        );
      }
      paths.forEach((p, i) => {
        const len = typeof p.getTotalLength === "function" ? p.getTotalLength() : 0;
        if (!len) return;
        tl.set(p, { strokeDasharray: len, strokeDashoffset: len }, 0)
          .to(p, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.25 + i * 0.06);
      });
      counts.forEach((el, i) => {
        const target = Number.parseFloat(el.dataset.count ?? "0");
        const start = { v: 0 };
        el.textContent = formatCount(0, el);
        tl.to(
          start,
          {
            v: target,
            duration: 1.4,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = formatCount(start.v, el);
            },
          },
          0.25 + i * 0.05,
        );
      });

      // Ambient pulse loops — started after the entrance settles.
      pulses.forEach((el, i) => {
        gsap.to(el, {
          scale: 1.25,
          opacity: 0.55,
          duration: 1.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 1.2 + i * 0.1,
          transformOrigin: "center center",
        });
      });
    },
    { dependencies: [isActive], scope },
  );

  return scope;
}
