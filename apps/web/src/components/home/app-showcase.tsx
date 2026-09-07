"use client";

import { Heading, Text, View, XStack, YStack } from "@fitnexx/ui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DashboardScreen,
  GymsScreen,
  LoggingScreen,
  MealsScreen,
  MeasurementsScreen,
  MusclesScreen,
  PhoneFrame,
  TemplatesScreen,
} from "./phone-mockup";

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    eyebrow: "Training",
    title: "Logging built for the gym.",
    copy: "Sets, reps, weight, and RPE between lifts. PRs get flagged the moment they happen.",
    bullets: [
      "Add sets between lifts, reuse exercises you log often",
      "Weight, reps, and optional RPE on every set",
      "Personal records flagged automatically",
    ],
    screen: <LoggingScreen />,
    accent: "#3b82f6",
    tab: 1,
  },
  {
    eyebrow: "Templates",
    title: "Start with your plan loaded.",
    copy: "Save any session as a template and jump straight into the next one.",
    bullets: [
      "Save any workout as a reusable template",
      "Load it next time in a single tap",
      "Free-form logging is still one tap away",
    ],
    screen: <TemplatesScreen />,
    accent: "#8b5cf6",
    tab: 1,
  },
  {
    eyebrow: "Analytics",
    title: "Trends, not vanity metrics.",
    copy: "PRs, volume, and weekly sets per muscle, computed from what you already log.",
    bullets: [
      "Automatic personal records and volume",
      "Weekly sets per muscle, updated as you train",
      "Consistency and rhythm from your history",
    ],
    screen: <DashboardScreen />,
    accent: "#f59e0b",
    tab: 0,
  },
  {
    eyebrow: "Milestones",
    title: "Muscle milestones.",
    copy: "Lifetime sets per muscle, weighted by set type, with tiers from Seedling to Legend.",
    bullets: [
      "Per-muscle volume over your whole history",
      "Nine tiers from Seedling to Legend",
      "A hypertrophy score for each body part",
    ],
    screen: <MusclesScreen />,
    accent: "#ef4444",
    tab: 3,
  },
  {
    eyebrow: "Nutrition",
    title: "Meals, photos, macros.",
    copy: "A daily calorie goal, a macro split, and a photo for every meal.",
    bullets: [
      "Daily calorie and macro goals",
      "Protein, carbs, and fat at a glance",
      "Snap a photo with each meal",
    ],
    screen: <MealsScreen />,
    accent: "#22c55e",
    tab: 2,
  },
  {
    eyebrow: "Body",
    title: "Trends you can see.",
    copy: "Body metrics with a reminder that keeps you honest.",
    bullets: [
      "Weight, body fat, and measurement history",
      "A recurring reminder at your day and time",
      "Progress framed against a target",
    ],
    screen: <MeasurementsScreen />,
    accent: "#06b6d4",
    tab: 4,
  },
  {
    eyebrow: "Nearby",
    title: "Know your gym's gear.",
    copy: "Save the gyms you train at and see what each one has before you go.",
    bullets: [
      "Gyms saved with their equipment lists",
      "See which gear each location has or lacks",
      "Current-gym check from inside the logger",
    ],
    screen: <GymsScreen />,
    accent: "#ec4899",
    tab: 4,
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AppShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Global scroll drives the phone: scrolling the page anywhere scrolls the
  // active slide's inner content, and only the active slide changes once its
  // content is fully read. Each slide owns its own full scroll range, so no
  // slide is short-changed and there is no early slide swap.
  const activeRef = useRef(0);
  const topRef = useRef(0);
  const stickyHRef = useRef(0);

  // Live measurement keeps the scroll math aligned with the page on mobile,
  // where the browser toolbar collapses/expands while scrolling (fires resize
  // + visualViewport resize) and 100dvh != a static cache.
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    topRef.current = wrap.getBoundingClientRect().top + window.scrollY;
    stickyHRef.current = window.innerHeight - 56;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    measure();
    const N = SLIDES.length;

    const apply = () => {
      const stickyH = stickyHRef.current;
      const top = topRef.current;
      const scrollable = N * stickyH;
      const s = Math.min(Math.max(window.scrollY - top, 0), scrollable);
      const unit = s / stickyH;
      const nextActive = Math.min(Math.floor(unit), N - 1);
      const localP = Math.min(Math.max(unit - nextActive, 0), 1);
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
      const scroller = document.querySelector<HTMLElement>(".pf-scroll");
      if (scroller) {
        const max = scroller.scrollHeight - scroller.clientHeight;
        scroller.scrollTop = Math.round(localP * max);
      }
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [measure]);

  const scrollToIndex = useCallback((i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const step = stickyHRef.current || window.innerHeight - 56;
    window.scrollTo({
      top: Math.max(0, top + step * i),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const top = wrap.getBoundingClientRect().top + window.scrollY;
      const range = wrap.offsetHeight - window.innerHeight;
      const inRange =
        window.scrollY >= top - 80 && window.scrollY <= top + range + 80;
      if (!inRange) return;
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(Math.min(active + 1, SLIDES.length - 1));
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        scrollToIndex(Math.max(active - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, scrollToIndex]);

  const slide = SLIDES[active];
  const progress = (active / (SLIDES.length - 1)) * 100;

  return (
    <View
      tag="section"
      aria-label="App showcase"
      borderTopWidth={1}
      borderBottomWidth={1}
      borderColor="$borderColor"
      backgroundColor="rgba(59,130,246,0.03)"
      paddingVertical={64}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 96 }}
      style={{ overflow: "clip" }}
    >
      <YStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={40}
      >
        <YStack
          maxWidth={640}
          gap={12}
          marginLeft="auto"
          marginRight="auto"
          alignItems="center"
        >
          <div data-reveal>
            <Heading
              tag="h2"
              fontSize={30}
              fontWeight="800"
              color="$color"
              textAlign="center"
              $sm={{ fontSize: 36 }}
            >
              Every feature, one page.
            </Heading>
          </div>
          <div data-reveal data-reveal-delay="0.06">
            <Text
              color="$muted"
              fontSize={15}
              lineHeight={24}
              textAlign="center"
            >
              Keep scrolling. Each feature is one stop. Use the arrows or your
              keyboard to jump between them.
            </Text>
          </div>
        </YStack>

        <div
          ref={wrapRef}
          style={{
            height: `calc(${(SLIDES.length + 1) * 100}dvh - ${(SLIDES.length + 1) * 56}px)`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 56,
              height: "calc(100dvh - 56px)",
              overflowY: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                zIndex: 5,
              }}
            >
              <span style={{ color: "#888", fontSize: 12, fontWeight: 600 }}>
                {active + 1} / {SLIDES.length}
              </span>
              <div
                style={{
                  width: 120,
                  height: 4,
                  background: "#222",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: 4,
                    background: slide.accent,
                    borderRadius: 999,
                    transition: "width 0.5s ease, background 0.8s ease",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: 48,
                padding: "24px 16px",
                width: "100%",
                maxWidth: 900,
              }}
            >
              <div data-reveal style={{ flex: 1, minWidth: 280 }}>
                <div style={{ position: "relative", height: 320 }}>
                  {SLIDES.map((s, i) => (
                    <div
                      key={s.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: active === i ? 1 : 0,
                        transform: `translateY(${
                          active === i ? 0 : active < i ? 24 : -24
                        }px)`,
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                        pointerEvents: active === i ? "auto" : "none",
                      }}
                    >
                      <YStack gap={10}>
                        <Text
                          color={s.accent}
                          fontSize={13}
                          fontWeight="700"
                          textTransform="uppercase"
                        >
                          {s.eyebrow}
                        </Text>
                        <Heading
                          tag="h3"
                          fontSize={24}
                          fontWeight="800"
                          color="$color"
                          $sm={{ fontSize: 30 }}
                        >
                          {s.title}
                        </Heading>
                        <Text color="$muted" fontSize={15} lineHeight={23}>
                          {s.copy}
                        </Text>
                        <YStack gap={8} marginTop={8}>
                          {s.bullets.map((b) => (
                            <XStack key={b} gap={10} alignItems="flex-start">
                              <View
                                width={6}
                                height={6}
                                borderRadius={999}
                                backgroundColor={s.accent}
                                style={{ marginTop: 8 }}
                              />
                              <Text color="$muted" fontSize={14}>
                                {b}
                              </Text>
                            </XStack>
                          ))}
                        </YStack>
                      </YStack>
                    </div>
                  ))}
                </div>
              </div>

              <div
                data-reveal
                data-reveal-delay="0.1"
                style={
                  {
                    width: 300,
                    maxWidth: "100%",
                    flexShrink: 0,
                    color: slide.accent,
                    "--pf-h": isMobile
                      ? "min(420px, 52vh)"
                      : "min(620px, 80vh)",
                  } as React.CSSProperties
                }
              >
                <div style={{ position: "relative" }}>
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: -24,
                      borderRadius: 999,
                      background: "currentColor",
                      filter: "blur(70px)",
                      opacity: 0.22,
                      transition: "color 0.8s ease",
                    }}
                  />
                  <PhoneFrame key={slide.title} tab={slide.tab}>
                    <div
                      key={active}
                      className="pf-screen"
                      style={{ minHeight: "100%" }}
                    >
                      {SLIDES[active].screen}
                    </div>
                  </PhoneFrame>
                </div>
              </div>
            </div>

            {!isMobile ? (
              <div
                style={{
                  position: "absolute",
                  right: 32,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 24,
                    height: 160,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: "#222",
                      borderRadius: 999,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: `${(active / (SLIDES.length - 1)) * 100}%`,
                      translate: "0 -50%",
                      width: 2,
                      height: 20,
                      background: slide.accent,
                      borderRadius: 999,
                      transition:
                        "top 0.5s ease, background 0.8s ease, height 0.5s ease",
                    }}
                  />
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      aria-label={`Go to: ${s.title}`}
                      aria-current={active === i}
                      onClick={() => scrollToIndex(i)}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        background: active === i ? "#fff" : "#374151",
                        transform: active === i ? "scale(1.5)" : "scale(1)",
                        transition: "all 0.3s",
                        zIndex: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 10,
              }}
            >
              <button
                type="button"
                aria-label="Previous feature"
                disabled={active === 0}
                onClick={() => scrollToIndex(Math.max(active - 1, 0))}
                style={{
                  background: "#161616",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: active === 0 ? "#232323" : "#2a2a2a",
                  borderRadius: 10,
                  padding: "8px 14px",
                  color: active === 0 ? "#444" : "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: active === 0 ? "default" : "pointer",
                }}
              >
                ← Prev
              </button>
              <button
                type="button"
                aria-label="Next feature"
                disabled={active === SLIDES.length - 1}
                onClick={() =>
                  scrollToIndex(Math.min(active + 1, SLIDES.length - 1))
                }
                style={{
                  background: "#161616",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor:
                    active === SLIDES.length - 1 ? "#232323" : "#2a2a2a",
                  borderRadius: 10,
                  padding: "8px 14px",
                  color: active === SLIDES.length - 1 ? "#444" : "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: active === SLIDES.length - 1 ? "default" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <Text color="$subtle" fontSize={13} textAlign="center">
          {slide.eyebrow} · everything stays on your device, no account, no
          cloud.
        </Text>
      </YStack>
    </View>
  );
}
