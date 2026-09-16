"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// ponytail: entrance animation for hero sub-groups, one-shot on mount.
export function HeroIntro({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const heading = ref.current?.querySelector<HTMLElement>(
          "[data-hero-heading]",
        );
        const split = heading
          ? new SplitText(heading, { type: "words", wordsClass: "hero-word" })
          : null;
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        timeline
          .from("[data-hero-badge]", { opacity: 0, y: 16, duration: 0.45 })
          .from(
            split?.words ?? "[data-hero-heading]",
            { opacity: 0, yPercent: 80, duration: 0.75, stagger: 0.045 },
            "-=0.18",
          )
          .from(
            "[data-hero-copy], [data-hero-ctas], [data-hero-visual]",
            { opacity: 0, y: 24, duration: 0.65, stagger: 0.1 },
            "-=0.42",
          );

        return () => split?.revert();
      });
      return () => media.revert();
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}

// ponytail: scroll-triggered reveal for [data-reveal] elements.
export function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        targets.forEach((target) => {
          gsap.fromTo(
            target,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: Number(target.dataset.revealDelay ?? 0),
              ease: "power3.out",
              scrollTrigger: {
                trigger: target,
                start: "clamp(top 86%)",
                once: true,
              },
            },
          );
        });
      });
      return () => media.revert();
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}

// ponytail: spring lift + scale on hover, for cards.
export function SpringCard({ children }: { children: React.ReactNode }) {
  return <div className="spring-card">{children}</div>;
}

export function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          element,
          { y: 34, rotate: -2 },
          {
            y: -34,
            rotate: 2,
            ease: "none",
            scrollTrigger: {
              trigger: element.closest("section"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}

// ponytail: one-shot fade/rise for static pages, runs after hydration.
export function PageIntro({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(ref.current?.children ?? [], {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05,
      });
    },
    { scope: ref },
  );
  return <div ref={ref}>{children}</div>;
}
