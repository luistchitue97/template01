"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { cn } from "@/lib/cn";

/**
 * Global atmospheric aurora — mounted once at the root layout so the same
 * animation continues across slides (all 12) and route changes (deck ↔
 * /customize).
 *
 * Built from six independent, heavily blurred radial-gradient blobs in
 * vivid hues (plus one that picks up the user's accent color so the
 * aurora reacts to customize changes), and one ultra-soft pass of the
 * source PNG as a final texture grain. The blobs are large, overlapping,
 * and slowly drifting so the discrete colors read as a soup rather than
 * separate dots.
 *
 * Blend modes are theme-aware:
 *  - graphite (dark): `screen` works cleanly here because each blob is a
 *    color → transparent gradient (no white background to brighten). The
 *    colors glow over the dark canvas where the blobs are, and graphite
 *    stays graphite everywhere else, so text contrast is preserved.
 *  - any light tone:  `multiply` so the same shapes read as a rich
 *    watercolor wash on the warm cream.
 */
type Blob = {
  /** `R G B` triplet (space-separated) usable inside rgb() / for accent uses a CSS var token instead */
  rgb: string;
  /** Tailwind positioning + sizing for the wrapper */
  className: string;
  /** Gaussian blur in px on this blob's gradient */
  blurPx: number;
  /** How far from the gradient center the alpha fades to zero (0..1). */
  spread: number;
};

const BLOBS: Blob[] = [
  // Violet — anchors the top-left, classic aurora purple.
  {
    rgb: "139 92 246",
    className: "absolute -top-[12%] -left-[10%] h-[78vh] w-[58vw]",
    blurPx: 90,
    spread: 0.7,
  },
  // Cyan — top-right, matches the source PNG's natural direction.
  {
    rgb: "34 211 238",
    className: "absolute top-[2%] -right-[12%] h-[74vh] w-[56vw]",
    blurPx: 80,
    spread: 0.7,
  },
  // Hot pink — mid right, the explosive accent.
  {
    rgb: "236 72 153",
    className: "absolute top-[34%] right-[18%] h-[58vh] w-[46vw]",
    blurPx: 100,
    spread: 0.65,
  },
  // Indigo — bottom-left, deep cold tone.
  {
    rgb: "99 102 241",
    className: "absolute -bottom-[18%] left-[12%] h-[72vh] w-[56vw]",
    blurPx: 95,
    spread: 0.72,
  },
  // Amber — bottom-right, the warm counter-balance.
  {
    rgb: "251 146 60",
    className: "absolute -bottom-[12%] -right-[8%] h-[66vh] w-[50vw]",
    blurPx: 90,
    spread: 0.7,
  },
  // The user's chosen accent color — ties the aurora to their theme.
  {
    rgb: "var(--accent-rgb)",
    className: "absolute top-[22%] left-[34%] h-[58vh] w-[52vw]",
    blurPx: 110,
    spread: 0.68,
  },
];

function blobStyle({ rgb, blurPx, spread }: Blob): CSSProperties {
  const fadeStart = `${Math.round(spread * 100)}%`;
  return {
    background:
      `radial-gradient(circle at 50% 50%, ` +
      `rgb(${rgb}) 0%, ` +
      `rgb(${rgb} / 0.7) 20%, ` +
      `rgb(${rgb} / 0.35) 45%, ` +
      `transparent ${fadeStart})`,
    filter: `blur(${blurPx}px) saturate(1.3)`,
  };
}

export function AuroraBackdrop() {
  const isDark = useCustomize().config.theme.backgroundTone === "graphite";
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const layers = Array.from(
        el.querySelectorAll<HTMLElement>("[data-aurora-layer]"),
      );
      if (!layers.length) return;

      // Discrete but explosive: enough opacity that each color reads, but
      // not so much that the whole canvas glows uniformly. Dark mode runs
      // a touch lower because screen blends are perceptually punchier.
      const lightOpacities = [0.55, 0.5, 0.45, 0.5, 0.4, 0.45];
      const darkOpacities = [0.45, 0.42, 0.38, 0.42, 0.32, 0.4];
      const targetOpacities = isDark ? darkOpacities : lightOpacities;

      gsap.fromTo(
        layers,
        { autoAlpha: 0, scale: 1.15 },
        {
          autoAlpha: (i) => targetOpacities[i] ?? 0.4,
          scale: 1,
          duration: 2.4,
          stagger: 0.18,
          ease: "power3.out",
        },
      );

      // Slow, independent motion per blob — discrete movement, no
      // formation-orbiting.
      layers.forEach((layer, i) => {
        const sign = i % 2 === 0 ? 1 : -1;
        const altSign = i % 3 === 0 ? 1 : -1;
        gsap.to(layer, {
          xPercent: 12 * sign,
          yPercent: -8 * altSign,
          duration: 22 + i * 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(layer, {
          rotation: `+=${360 * sign}`,
          duration: 220 + i * 35,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
        gsap.to(layer, {
          scale: 1.15,
          duration: 13 + i * 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 1.6 + i * 0.2,
        });
      });

      // Pointer parallax — depth-scaled nudges.
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        layers.forEach((layer, i) => {
          const depth = (i + 1) * 16;
          gsap.to(layer, {
            x: -cx * depth,
            y: -cy * depth,
            duration: 1.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { dependencies: [isDark], scope: root },
  );

  const blendClass = isDark ? "mix-blend-screen" : "mix-blend-multiply";

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          data-aurora-layer
          className={cn("will-change-transform", blob.className, blendClass)}
          style={blobStyle(blob)}
        />
      ))}

      {/* Source-image texture — keeps a thread of the original asset in the
          mix. Heavy blur + low opacity so it just adds character, not shape. */}
      <div
        data-aurora-layer
        className={cn(
          "absolute -top-[15%] -right-[10%] h-[110%] w-[80%] will-change-transform",
          blendClass,
        )}
        style={{
          filter: "blur(70px) saturate(1.1)",
          maskImage:
            "radial-gradient(ellipse 70% 75% at 50% 50%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 75% at 50% 50%, black 0%, transparent 80%)",
        }}
      >
        <img
          src="/template-01.png"
          alt=""
          draggable={false}
          className="h-full w-full object-cover opacity-70"
        />
      </div>

      {/* Vignette — pulls the corners back toward the active background so
          edge content (sidebars, deck chrome) stays legible. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          isDark
            ? "bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(var(--bg-rgb)/0.55)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(var(--bg-rgb)/0.55)_100%)]",
        )}
      />
    </div>
  );
}
