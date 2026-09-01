import {
  Activity,
  BarChart3,
  Camera,
  Dumbbell,
  type LucideIcon,
  MapPin,
  Repeat,
  Ruler,
} from "lucide-react";

// TODO(user): build these before advertising them (see also /pricing):
// - OCR food scanning (labels/meals) with daily caps
// - Daily meal AI overview (Pro)
// - AI-guided gym workout suggestions (Pro)
// - In-app purchase for the Pro analytics unlock in the Expo app

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Expanded copy for the /features page */
  details: string;
};

export const features: FeatureItem[] = [
  {
    icon: Dumbbell,
    title: "Performance logging",
    description:
      "Log exercises, sets, reps, and weight with a flow built for the gym. PRs and volume are flagged automatically across your history.",
    details:
      "Tap to add sets between lifts, reuse the exercises you log often, and build a session fast. Personal records and total volume update as you train, so progress stays visible without turning your workout into spreadsheet work.",
  },
  {
    icon: Repeat,
    title: "Workout templates",
    description:
      "Save any session as a template and start the next one with your plan already loaded.",
    details:
      "Name a template once and reuse it whenever you open the logger. Moving between template and free-form logging is a single tap, so planning and adapting both stay low-friction.",
  },
  {
    icon: BarChart3,
    title: "Analytics that matter",
    description:
      "Trends over vanity metrics: PRs, volume, load intensity, and consistency computed from your own training history.",
    details:
      "The dashboard reads your logs instead of asking for more input: PR trends, weekly volume per muscle, volume density, exercise intensity and frequency, weekly rhythm, top exercises, and a consistent-activity heatmap all update as you train.",
  },
  {
    icon: Activity,
    title: "Muscle analysis",
    description:
      "Per-muscle volume and milestones, from first sets to lifetime tiers.",
    details:
      "Muscle-specific weekly sets and a milestone track for each group keep lagging or leading body parts obvious. Training leans on evidence instead of guesses.",
  },
  {
    icon: Camera,
    title: "Meal tracking with photos",
    description:
      "Log meals with calories, protein, and carbs; snap a photo from the camera or gallery to keep a visual record.",
    details:
      "Set a daily calorie goal and watch today's totals and macro split fill in as you log. Save common meals to reuse later. Entry is manual with an optional photo; food-label scanning is on the roadmap.",
  },
  {
    icon: Ruler,
    title: "Body measurement tracking",
    description:
      "Log weight, circumference, and activity level, with gentle reminders so tracking doesn't slip.",
    details:
      "Chart and history the measurements you enable, pick kg or lbs, and let configurable reminders keep you consistent. Your numbers stay on your device.",
  },
  {
    icon: MapPin,
    title: "Gym equipment on file",
    description:
      "Keep your gyms and their gear on hand; Fitnexx detects when you're there and flags moves the room can't do.",
    details:
      "Gyms are stored locally with their equipment, and your location picks the venue automatically. Availability checks warn you before you pick an exercise that requires gear the gym doesn't have, and suggestions respect what's actually on the floor.",
  },
];
