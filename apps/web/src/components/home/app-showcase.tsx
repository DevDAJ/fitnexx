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
      "Rule-based suggestions, with optional AI when you tap Ask AI",
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
    copy: "See PRs, volume, and weekly sets per muscle, computed from what you already log.",
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

const SHOWCASE_CSS = `
.pf-showcase-track { height: var(--showcase-height); position: relative; }
.pf-showcase-stage {
  position: sticky;
  top: 56px;
  height: calc(100dvh - 56px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-showcase-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: 24px 16px;
  width: 100%;
  max-width: 900px;
}
.pf-showcase-copy { flex: 1; min-width: 280px; }
.pf-showcase-copy-active { animation: pfShowcaseCopy 0.5s ease both; }
.pf-showcase-phone {
  width: min(300px, calc((100dvh - 112px) * 0.51));
  max-width: 100%;
  flex-shrink: 0;
}
.pf-showcase-scroll-hint { display: none; }
.pf-showcase-dots {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
}
@keyframes pfShowcaseCopy {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}
@keyframes pfShowcaseFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (max-width: 800px) {
  .pf-showcase-section { padding-block: 0; }
  .pf-showcase-track { height: 100dvh; }
  .pf-showcase-stage {
    position: relative;
    top: auto;
    height: 100dvh;
    overflow: hidden;
    padding: 40px 0 48px;
  }
  .pf-showcase-layout {
    flex-direction: column;
    gap: 10px;
    padding: 0 16px;
  }
  .pf-showcase-copy {
    flex: none;
    width: 100%;
    min-width: 0;
    height: clamp(250px, calc(680px - 110vw), 328px);
  }
  .pf-showcase-copy-active { animation-name: pfShowcaseFade; }
  .pf-showcase-phone { width: min(300px, calc(100vw - 64px)); }
  .pf-showcase-phone .pf-scroll {
    overflow-y: auto;
    overscroll-behavior: contain;
    touch-action: pan-y;
  }
  .pf-showcase-scroll-hint {
    display: block;
    color: #888;
    font-size: 13px;
    text-align: center;
  }
  .pf-showcase-dots { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .pf-showcase-copy-active { animation: none; }
  .pf-showcase-transition { transition: none !important; }
}
`;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AppShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [mobileScale, setMobileScale] = useState(1);

  useEffect(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;
    const media = window.matchMedia("(max-width: 800px)");
    const fit = () => {
      setMobileScale(
        media.matches
          ? Math.min(1, (stage.clientHeight - 120) / content.scrollHeight)
          : 1,
      );
    };
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    observer.observe(content);
    media.addEventListener("change", fit);
    fit();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", fit);
    };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const media = gsap.matchMedia();

    media.add("(min-width: 801px)", () => {
      const apply = (progress: number) => {
        const unit = progress * SLIDES.length;
        const nextActive = Math.min(Math.floor(unit), SLIDES.length - 1);
        const localProgress = Math.min(Math.max(unit - nextActive, 0), 1);

        if (nextActive !== activeRef.current) {
          activeRef.current = nextActive;
          setActive(nextActive);
        }

        const scroller = wrap.querySelector<HTMLElement>(".pf-scroll");
        if (scroller) {
          scroller.scrollTop = Math.round(
            localProgress * (scroller.scrollHeight - scroller.clientHeight),
          );
        }
      };

      const trigger = ScrollTrigger.create({
        trigger: wrap,
        start: "top top+=56",
        end: "bottom bottom",
        onRefresh: (self) => apply(self.progress),
        onUpdate: (self) => apply(self.progress),
      });
      triggerRef.current = trigger;
      apply(trigger.progress);

      return () => {
        trigger.kill();
        triggerRef.current = null;
      };
    });

    return () => media.revert();
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) {
      activeRef.current = index;
      setActive(index);
      return;
    }

    window.scrollTo({
      top:
        trigger.start + ((trigger.end - trigger.start) / SLIDES.length) * index,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!triggerRef.current?.isActive) return;
      const current = activeRef.current;

      if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key)) {
        event.preventDefault();
        scrollToIndex(Math.min(current + 1, SLIDES.length - 1));
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        scrollToIndex(Math.max(current - 1, 0));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollToIndex]);

  const slide = SLIDES[active];
  const progress = (active / (SLIDES.length - 1)) * 100;

  return (
    <View
      tag="section"
      className="pf-showcase-section"
      aria-label="App showcase"
      borderTopWidth={1}
      borderBottomWidth={1}
      borderColor="$borderColor"
      backgroundColor="rgba(59,130,246,0.03)"
      paddingVertical={96}
      paddingHorizontal={16}
      $sm={{ paddingVertical: 0 }}
      style={{ overflow: "clip" }}
    >
      <style>{SHOWCASE_CSS}</style>
      <YStack
        maxWidth={1024}
        width="100%"
        marginLeft="auto"
        marginRight="auto"
        gap={40}
      >
        <YStack
          className="pf-showcase-intro"
          $sm={{ display: "none" }}
          maxWidth={640}
          gap={12}
          marginLeft="auto"
          marginRight="auto"
          alignItems="center"
        >
          <div data-reveal>
            <Heading
              tag="h2"
              fontSize={36}
              fontWeight="800"
              color="$color"
              textAlign="center"
              $sm={{ fontSize: 30 }}
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
              Explore each feature. Scroll on desktop, or use the controls to
              move between them.
            </Text>
          </div>
        </YStack>

        <div
          ref={wrapRef}
          className="pf-showcase-track"
          style={
            {
              "--showcase-height": `calc(${(SLIDES.length + 1) * 100}dvh - ${(SLIDES.length + 1) * 56}px)`,
            } as React.CSSProperties
          }
        >
          <div ref={stageRef} className="pf-showcase-stage">
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
                  className="pf-showcase-transition"
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
              ref={contentRef}
              className="pf-showcase-layout"
              style={{
                transform: `scale(${mobileScale})`,
                transformOrigin: "center",
              }}
            >
              <div data-reveal className="pf-showcase-copy" aria-live="polite">
                <div key={slide.title} className="pf-showcase-copy-active">
                  <YStack gap={10}>
                    <Text
                      color={slide.accent}
                      fontSize={13}
                      fontWeight="700"
                      textTransform="uppercase"
                    >
                      {slide.eyebrow}
                    </Text>
                    <Heading
                      tag="h3"
                      fontSize={30}
                      fontWeight="800"
                      color="$color"
                      $sm={{ fontSize: 24 }}
                    >
                      {slide.title}
                    </Heading>
                    <Text
                      className="pf-showcase-description"
                      color="$muted"
                      fontSize={15}
                      lineHeight={23}
                    >
                      {slide.copy}
                    </Text>
                    <YStack
                      className="pf-showcase-bullets"
                      gap={8}
                      marginTop={8}
                    >
                      {slide.bullets.map((bullet) => (
                        <XStack key={bullet} gap={10} alignItems="flex-start">
                          <View
                            width={6}
                            height={6}
                            borderRadius={999}
                            backgroundColor={slide.accent}
                            style={{ marginTop: 8 }}
                          />
                          <Text color="$muted" fontSize={14}>
                            {bullet}
                          </Text>
                        </XStack>
                      ))}
                    </YStack>
                  </YStack>
                </div>
              </div>

              <div className="pf-showcase-scroll-hint">
                Scroll inside the phone to explore this screen.
              </div>

              <div
                data-reveal
                data-reveal-delay="0.1"
                className="pf-showcase-phone"
                style={{ color: slide.accent }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    aria-hidden
                    className="pf-showcase-transition"
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
                      {slide.screen}
                    </div>
                  </PhoneFrame>
                </div>
              </div>
            </div>

            <div className="pf-showcase-dots">
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
                  className="pf-showcase-transition"
                  style={{
                    position: "absolute",
                    top: `${progress}%`,
                    translate: "0 -50%",
                    width: 2,
                    height: 20,
                    background: slide.accent,
                    borderRadius: 999,
                    transition:
                      "top 0.5s ease, background 0.8s ease, height 0.5s ease",
                  }}
                />
                {SLIDES.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Go to: ${item.title}`}
                    aria-current={active === index}
                    onClick={() => scrollToIndex(index)}
                    className="pf-showcase-transition"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      background: active === index ? "#fff" : "#374151",
                      transform: active === index ? "scale(1.5)" : "scale(1)",
                      transition: "all 0.3s",
                      zIndex: 2,
                    }}
                  />
                ))}
              </div>
            </div>

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

        <Text
          className="pf-showcase-footer"
          $sm={{ display: "none" }}
          color="$subtle"
          fontSize={13}
          textAlign="center"
        >
          {slide.eyebrow} · tracking stays local. Cloud AI runs only when you
          choose Ask AI.
        </Text>
      </YStack>
    </View>
  );
}
