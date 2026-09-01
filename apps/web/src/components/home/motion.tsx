"use client";

import { animated, useSpring } from "@react-spring/web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ponytail: entrance animation for hero sub-groups, one-shot on mount.
export function HeroIntro({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from(
          "[data-hero-badge], [data-hero-heading], [data-hero-copy], [data-hero-ctas]",
          {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          },
        );
    }, el);
    return () => ctx.revert();
  }, []);
  return <div ref={ref}>{children}</div>;
}

// ponytail: scroll-triggered reveal for [data-reveal] elements.
export function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
      targets.forEach((target) => {
        const delay = parseFloat(target.dataset.revealDelay || "0");
        gsap.fromTo(
          target,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: target,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return <div ref={ref}>{children}</div>;
}

// ponytail: spring lift + scale on hover, for cards.
export function SpringCard({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const spring = useSpring({
    transform: hovered
      ? "translateY(-4px) scale(1.01)"
      : "translateY(0px) scale(1)",
    config: { mass: 1, tension: 220, friction: 18 },
  });
  return (
    <animated.div
      style={spring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </animated.div>
  );
}

// ponytail: one-shot fade/rise for static pages, runs after hydration.
export function PageIntro({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.04,
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return <div ref={ref}>{children}</div>;
}
