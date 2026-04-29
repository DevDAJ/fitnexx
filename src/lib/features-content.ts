import {
  BarChart3,
  Dumbbell,
  type LucideIcon,
  MapPin,
  Ruler,
  ScanLine,
  Sparkles,
} from "lucide-react";

import { foodScansPerDay } from "@/lib/food-scan-limits";

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Expanded copy for the /features page */
  details: string;
};

export const features: FeatureItem[] = [
  {
    icon: MapPin,
    title: "Equipment at gyms we catalog",
    description:
      "For gyms in our database we list documented equipment so you know what’s on the floor on Free and Pro. Pro adds gym workout suggestions: AI-guided movements based on your programming and the gear actually available.",
    details:
      "This isn’t a facility ‘fit’ score. We surface inventory tied to venues on file so you can browse before or during your visit. Pro unlocks the suggestion layer when you train at a cataloged gym: options align with how your program progresses and what the room carries. Without Pro, listings stay informational and logging stays yours to drive.",
  },
  {
    icon: Dumbbell,
    title: "Performance tracking",
    description:
      "Log workouts, sets, and PRs with a flow built for the gym: fast taps, clear history, progress you can actually see.",
    details:
      "Built around how you actually train: quick logging between sets, exercises you reuse, and history that helps you plan the next session. PRs and volume stay visible without turning your workout into spreadsheet work.",
  },
  {
    icon: Ruler,
    title: "Body measurement tracking",
    description:
      "Log the numbers you care about (weight, circumference, custom fields), included on Free so comp and progress aren’t gated by Pro.",
    details:
      "Charts and history for the measurements you enable. Same privacy stance as the rest of Fitnexx: your numbers stay yours under your account controls. Higher OCR limits and gym or meal AI are Pro perks; baseline body tracking is not.",
  },
  {
    icon: ScanLine,
    title: "Macro tracking with OCR",
    description: `Snap nutrition labels or meals; OCR fills macros. Free includes ${foodScansPerDay.free} food scans per day; Pro allows up to ${foodScansPerDay.proMax} per day. Edits after a scan refine recognition. Personal information from those flows is not saved.`,
    details:
      "Daily allowances keep OCR sustainable to operate; tiers and resets are spelled out on Pricing. Photos and tweaks after a read improve parsing over time. Processing aims at recognition quality only. Fitnexx does not persist personal identifiers tied to imagery or corrections for profiling, resale, or advertising.",
  },
  {
    icon: Sparkles,
    title: "Daily meal AI overview (Pro)",
    description:
      "Pro unlocks one consolidated AI read of how your day stacked up (proteins, totals, gaps), distilled from logs and OCR so you skim progress without combing spreadsheets.",
    details:
      "The overview summarizes what you entered; it complements logging instead of bypassing accountability. Signals stay purpose-built for the summary Fitnexx shows: tier and privacy rules match what we advertise on Pricing, not covert profiling.",
  },
  {
    icon: BarChart3,
    title: "Insights that matter",
    description:
      "Trends over vanity metrics: volume, consistency, and nutrition patterns in one privacy-first place.",
    details:
      "Trend lines and summaries center what changes training: consistency, load, and intake patterns over time. Fewer gimmick dashboards, more signal, inside an experience that treats your data as yours.",
  },
];
