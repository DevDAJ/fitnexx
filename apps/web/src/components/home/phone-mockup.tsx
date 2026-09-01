import { useState } from "react";

const PHONE_CSS = `
.pf-app { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
.pf-app button {
  appearance: none;
  -webkit-appearance: none;
  font-family: inherit;
  line-height: 1;
  box-sizing: border-box;
  margin: 0;
}
.pf-app button:focus { outline: none; }
.pf-scroll { scrollbar-width: none; -ms-overflow-style: none; }
.pf-scroll::-webkit-scrollbar { display: none; }
.pf-float { animation: pfFloat 3.2s ease-in-out infinite alternate; }
@keyframes pfFloat { from { transform: translateY(-6px); } to { transform: translateY(6px); } }
.pf-screen { animation: pfScreen 0.55s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
@keyframes pfScreen { from { opacity: 0; transform: translateY(14px) scale(0.985); } to { opacity: 1; transform: none; } }
.pf-barx { transform-origin: left; animation: pfBarX 0.9s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
@keyframes pfBarX { from { transform: scaleX(0.05); } to { transform: scaleX(1); } }
.pf-drift { animation: pfDrift 14s ease-in-out infinite alternate; }
@keyframes pfDrift { from { transform: translate(0, 0) scale(1); } to { transform: translate(24px, -28px) scale(1.12); } }
@media (prefers-reduced-motion: reduce) {
  .pf-float, .pf-screen, .pf-barx, .pf-drift { animation: none; }
}
`;

const CARD: React.CSSProperties = {
  background: "#161616",
  borderRadius: 14,
  padding: 16,
  borderWidth: 1,

  borderStyle: "solid",
  borderColor: "#222",
};

const LABEL: React.CSSProperties = {
  color: "#888",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

function sparkPoints(data: number[], width: number, height: number): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;
  return data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (width - pad * 2);
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const tabIconStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  display: "block",
};

function TabBar({ active }: { active: number }) {
  const items = [
    {
      label: "Dashboard",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={tabIconStyle}
        >
          <title>Dashboard</title>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="15" />
        </svg>
      ),
    },
    {
      label: "Workouts",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={tabIconStyle}
        >
          <title>Workouts</title>
          <path d="M6.5 6.5v11M17.5 6.5v11M4 9v6M20 9v6M6.5 12h11" />
        </svg>
      ),
    },
    {
      label: "Meals",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={tabIconStyle}
        >
          <title>Meals</title>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v5" />
        </svg>
      ),
    },
    {
      label: "Muscles",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={tabIconStyle}
        >
          <title>Muscles</title>
          <circle cx="12" cy="6" r="3" />
          <path d="M5 20c1-5 3-7 7-7s6 2 7 7" />
        </svg>
      ),
    },
    {
      label: "Settings",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={tabIconStyle}
        >
          <title>Settings</title>
          <line x1="21" y1="4" x2="14" y2="4" />
          <line x1="10" y1="4" x2="3" y2="4" />
          <line x1="21" y1="12" x2="12" y2="12" />
          <line x1="8" y1="12" x2="3" y2="12" />
          <line x1="21" y1="20" x2="16" y2="20" />
          <line x1="12" y1="20" x2="3" y2="20" />
          <line x1="14" y1="2" x2="14" y2="6" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="16" y1="18" x2="16" y2="22" />
        </svg>
      ),
    },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#111111",
        borderTopStyle: "solid",
        borderTopWidth: 1,
        borderTopColor: "#222222",
        paddingTop: 8,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex" }}>
        {items.map((it, i) => {
          const on = active === i;
          return (
            <div
              key={it.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                opacity: on ? 1 : 0.4,
              }}
            >
              <div style={{ color: on ? "#3b82f6" : "#666" }}>{it.icon}</div>
              <div
                style={{
                  color: on ? "#3b82f6" : "#666",
                  fontSize: 10,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "9px 0 9px",
        }}
      >
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 999,
            background: "#333",
          }}
        />
      </div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
  tab,
}: {
  children: React.ReactNode;
  className?: string;
  tab?: number;
}) {
  return (
    <div className={className} style={{ width: 300, maxWidth: "100%" }}>
      <style>{PHONE_CSS}</style>
      <div className="pf-float" style={{ willChange: "transform" }}>
        <div
          style={{
            borderRadius: 46,
            border: "6px solid #1c1c1e",
            background: "#050505",
            padding: 8,
            boxShadow:
              "0 46px 90px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "var(--pf-h, 560px)",
              borderRadius: 40,
              overflow: "hidden",
              background: "#0a0a0a",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 92,
                height: 22,
                borderRadius: 999,
                background: "#141416",
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 8,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#3b82f6",
                  opacity: 0.8,
                }}
              />
            </div>
            <div
              className="pf-scroll"
              style={{
                position: "absolute",
                inset: 0,
                paddingTop: 48,
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: tab !== undefined ? 80 : 16,
                overflow: "hidden",
              }}
            >
              {children}
            </div>
            {tab !== undefined ? <TabBar active={tab} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const SCREEN_ROOT: React.CSSProperties = {
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  color: "#fff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

function KpiCard({
  title,
  value,
  subtitle,
  delta,
  deltaColor = "#666",
  color = "#3b82f6",
  sparkData,
}: {
  title: string;
  value: string;
  subtitle: string;
  delta?: string;
  deltaColor?: string;
  color?: string;
  sparkData?: number[];
}) {
  return (
    <div style={{ ...CARD, flex: 1, minWidth: 140 }}>
      <div style={LABEL}>{title}</div>
      <div
        style={{ color: "#fff", fontSize: 28, fontWeight: 800, marginTop: 6 }}
      >
        {value}
      </div>
      <div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
        {subtitle}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        {delta && (
          <span style={{ color: deltaColor, fontSize: 13, fontWeight: 700 }}>
            {delta}
          </span>
        )}
        {sparkData && sparkData.length >= 2 ? (
          <svg width="80" height="32" viewBox="0 0 80 32">
            <title>{title} sparkline</title>
            <polyline
              points={sparkPoints(sparkData, 80, 32)}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>
    </div>
  );
}

function areaGeom(values: number[], W: number, H: number, pad: number) {
  const max = Math.max(...values) || 1;
  const pts = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (W - pad * 2),
    y: H - pad - (v / max) * (H - pad * 2),
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${pts[0].x},${H - pad} ${line} ${pts[pts.length - 1].x},${H - pad}`;
  return { line, area, max };
}

function ChartLabels({
  labels,
  W,
  H,
  pad,
}: {
  labels: string[];
  W: number;
  H: number;
  pad: number;
}) {
  const idx = [0, Math.floor((labels.length - 1) / 2), labels.length - 1];
  return (
    <>
      <line
        x1={pad}
        y1={H - pad}
        x2={W - pad}
        y2={H - pad}
        stroke="#333"
        strokeWidth="1"
      />
      {idx.map((i) => (
        <text
          key={labels[i]}
          x={pad + (i / (labels.length - 1)) * (W - pad * 2)}
          y={H - 8}
          fill="#666"
          fontSize="10"
          textAnchor="middle"
        >
          {labels[i]}
        </text>
      ))}
    </>
  );
}

function PrTrendCard() {
  const counts = [1, 3, 2, 4, 3, 6];
  const labels = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const W = 260;
  const H = 120;
  const pad = 24;
  const { line, area, max } = areaGeom(counts, W, H, pad);
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 8 }}>PR Trend</div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <title>PR trend</title>
        <polygon points={area} fill="#3b82f6" opacity="0.15" />
        <polyline
          points={line}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ChartLabels labels={labels} W={W} H={H} pad={pad} />
        <text x={4} y={pad + 4} fill="#666" fontSize="10">
          {max}
        </text>
      </svg>
    </div>
  );
}

function VolumeDensityCard() {
  const labels = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const volume = [34, 41, 38, 47, 43, 52];
  const density = [16, 19, 17, 21, 20, 24];
  const W = 260;
  const H = 120;
  const pad = 24;
  const [mode, setMode] = useState<"volume" | "density">("volume");
  const values = mode === "volume" ? volume : density;
  const { line, area, max } = areaGeom(values, W, H, pad);
  return (
    <div style={CARD}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={LABEL}>Volume & Density</div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["volume", "density"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: "4px 10px",
                borderRadius: 10,
                background: mode === m ? "#3b82f6" : "#222",
                border: "none",
                color: mode === m ? "#fff" : "#888",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "capitalize",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <title>Volume and density</title>
        {mode === "volume" ? (
          <>
            <polygon points={area} fill="#3b82f6" opacity="0.15" />
            <polyline
              points={line}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          density.map((v, i) => {
            const barW = Math.min((W - pad * 2) / density.length - 4, 30);
            const barH = (v / max) * (H - pad * 2);
            const x = pad + (i / density.length) * (W - pad * 2) + 2;
            return (
              <rect
                key={labels[i]}
                x={x}
                y={H - pad - barH}
                width={barW}
                height={barH}
                fill="#22c55e"
                rx="3"
              />
            );
          })
        )}
        <ChartLabels labels={labels} W={W} H={H} pad={pad} />
        <text x={4} y={pad + 4} fill="#666" fontSize="10">
          {max}
        </text>
      </svg>
    </div>
  );
}

function MuscleTrendCard() {
  const layers = ["Chest", "Back", "Shoulders", "Biceps", "Abs"];
  const layerColors = [
    ...layers.map((m) => MUSCLE_COLORS[m] || "#666"),
    "#666",
  ];
  const allKeys = [...layers, "Other"];
  const weeks = [
    {
      label: "Sep",
      sets: { Chest: 9, Back: 8, Shoulders: 6, Biceps: 5, Abs: 3, Other: 4 },
    },
    {
      label: "Oct",
      sets: { Chest: 8, Back: 8, Shoulders: 6, Biceps: 5, Abs: 3, Other: 4 },
    },
    {
      label: "Nov",
      sets: { Chest: 10, Back: 9, Shoulders: 7, Biceps: 6, Abs: 4, Other: 4 },
    },
    {
      label: "Dec",
      sets: { Chest: 9, Back: 9, Shoulders: 7, Biceps: 6, Abs: 4, Other: 5 },
    },
    {
      label: "Jan",
      sets: { Chest: 11, Back: 10, Shoulders: 8, Biceps: 7, Abs: 5, Other: 5 },
    },
    {
      label: "Feb",
      sets: { Chest: 12, Back: 11, Shoulders: 9, Biceps: 8, Abs: 6, Other: 6 },
    },
  ];
  const W = 260;
  const H = 120;
  const pad = 24;
  const maxTotal = Math.max(
    ...weeks.map((w) => Object.values(w.sets).reduce((a, b) => a + b, 0)),
  );
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 8 }}>Muscle Trend</div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <title>Muscle trend</title>
        <line
          x1={pad}
          y1={H - pad}
          x2={W - pad}
          y2={H - pad}
          stroke="#333"
          strokeWidth="1"
        />
        {allKeys.map((key, li) => {
          const color = layerColors[li];
          const tops: string[] = [];
          const bots: string[] = [];
          weeks.forEach((_w, i) => {
            const x = pad + (i / (weeks.length - 1)) * (W - pad * 2);
            let base = 0;
            for (let k = 0; k < li; k++)
              base += weeks[i].sets[allKeys[k] as keyof (typeof weeks)[number]["sets"]] || 0;
            const val = weeks[i].sets[key as keyof (typeof weeks)[number]["sets"]] || 0;
            const bot = H - pad - (base / maxTotal) * (H - pad * 2);
            const top = H - pad - ((base + val) / maxTotal) * (H - pad * 2);
            tops.push(`${x},${top}`);
            bots.unshift(`${x},${bot}`);
          });
          return (
            <polygon
              key={key}
              points={`${tops.join(" ")} ${bots.join(" ")}`}
              fill={color}
              opacity="0.7"
            />
          );
        })}
        <ChartLabels labels={weeks.map((w) => w.label)} W={W} H={H} pad={pad} />
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {allKeys.map((key, li) => (
          <span
            key={key}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: layerColors[li],
              }}
            />
            <span style={{ color: "#aaa", fontSize: 11 }}>{key}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function WeeklySetsChart() {
  const items = [
    { m: "Chest", v: 9 },
    { m: "Back", v: 8 },
    { m: "Quads", v: 7 },
    { m: "Shoulders", v: 6 },
    { m: "Biceps", v: 5 },
    { m: "Triceps", v: 4 },
    { m: "Hamstrings", v: 4 },
    { m: "Abs", v: 3 },
  ];
  const max = Math.max(...items.map((it) => it.v));
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 12 }}>Weekly Sets per Muscle</div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}
      >
        {items.map((it) => (
          <span
            key={it.m}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              className="pf-barx"
              style={{
                width: "100%",
                height: (it.v / max) * 96,
                borderRadius: 4,
                background: MUSCLE_COLORS[it.m] || "#666",
              }}
            />
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {items.map((it) => (
          <span
            key={it.m}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: MUSCLE_COLORS[it.m] || "#666",
              }}
            />
            <span style={{ color: "#aaa", fontSize: 11 }}>
              {it.m} ({it.v})
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

const INTENSITY_ZONES = [
  { key: "endurance", label: "Endurance (13+)", color: "#22c55e" },
  { key: "hypertrophy", label: "Hypertrophy (6-12)", color: "#3b82f6" },
  { key: "strength", label: "Strength (1-5)", color: "#ef4444" },
];

function IntensityEvolutionCard() {
  const weeks = [
    { label: "Sep", strength: 4, hypertrophy: 14, endurance: 6 },
    { label: "Oct", strength: 5, hypertrophy: 15, endurance: 7 },
    { label: "Nov", strength: 5, hypertrophy: 16, endurance: 8 },
    { label: "Dec", strength: 6, hypertrophy: 17, endurance: 9 },
    { label: "Jan", strength: 7, hypertrophy: 18, endurance: 10 },
    { label: "Feb", strength: 8, hypertrophy: 20, endurance: 12 },
  ];
  const W = 260;
  const H = 120;
  const pad = 24;
  const maxTotal = Math.max(
    ...weeks.map((w) => w.endurance + w.hypertrophy + w.strength),
  );
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 8 }}>Intensity Zones</div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <title>Intensity zones</title>
        <line
          x1={pad}
          y1={H - pad}
          x2={W - pad}
          y2={H - pad}
          stroke="#333"
          strokeWidth="1"
        />
        {INTENSITY_ZONES.map((zone) => {
          const tops: string[] = [];
          const bots: string[] = [];
          weeks.forEach((w, i) => {
            const x = pad + (i / (weeks.length - 1)) * (W - pad * 2);
            let base = 0;
            if (zone.key === "hypertrophy") base = w.endurance;
            else if (zone.key === "strength")
              base = w.endurance + w.hypertrophy;
            const val = w[zone.key as keyof typeof w] as number;
            const bot = H - pad - (base / maxTotal) * (H - pad * 2);
            const top = H - pad - ((base + val) / maxTotal) * (H - pad * 2);
            tops.push(`${x},${top}`);
            bots.unshift(`${x},${bot}`);
          });
          return (
            <polygon
              key={zone.key}
              points={`${tops.join(" ")} ${bots.join(" ")}`}
              fill={zone.color}
              opacity="0.7"
            />
          );
        })}
        <ChartLabels labels={weeks.map((w) => w.label)} W={W} H={H} pad={pad} />
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 8,
        }}
      >
        {INTENSITY_ZONES.map((z) => (
          <span
            key={z.key}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: z.color,
              }}
            />
            <span style={{ color: "#aaa", fontSize: 10 }}>{z.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const RHYTHM_DAYS = [
  { day: "Mon", sessions: 1 },
  { day: "Tue", sessions: 0 },
  { day: "Wed", sessions: 2 },
  { day: "Thu", sessions: 1 },
  { day: "Fri", sessions: 0 },
  { day: "Sat", sessions: 1 },
  { day: "Sun", sessions: 0 },
];

function WeeklyRhythmCard() {
  const max = Math.max(...RHYTHM_DAYS.map((d) => d.sessions), 1);
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 8 }}>Weekly Rhythm</div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          height: 120,
        }}
      >
        {RHYTHM_DAYS.map((d) => (
          <span
            key={d.day}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: "100%",
                height: d.sessions > 0 ? (d.sessions / max) * 96 : 4,
                borderRadius: 3,
                background: d.sessions > 0 ? "#3b82f6" : "#222",
              }}
            />
            <span style={{ color: "#666", fontSize: 10 }}>{d.day}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const TOP_EXERCISES = [
  { name: "Bench Press", v: 48200 },
  { name: "Squat", v: 41000 },
  { name: "Deadlift", v: 36600 },
  { name: "Incline DB Press", v: 21400 },
  { name: "Pull Ups", v: 18900 },
];

function TopExercisesCard() {
  const maxVol = Math.max(...TOP_EXERCISES.map((d) => d.v), 1);
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 12 }}>Top Exercises</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TOP_EXERCISES.map((d) => {
          const pct = d.v / maxVol;
          return (
            <div key={d.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{ color: "#e5e5e5", fontSize: 13, fontWeight: 600 }}
                >
                  {d.name}
                </span>
                <span style={{ color: "#888", fontSize: 12 }}>
                  {d.v.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: "#222",
                  overflow: "hidden",
                }}
              >
                <div
                  className="pf-barx"
                  style={{
                    height: 6,
                    borderRadius: 3,
                    width: `${pct * 100}%`,
                    background: "#3b82f6",
                    opacity: 0.6 + pct * 0.4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  ok: { bg: "#22c55e22", fg: "#22c55e" },
  watch: { bg: "#f59e0b22", fg: "#f59e0b" },
  flag: { bg: "#ef444422", fg: "#ef4444" },
};

const TREND_ARROW: Record<string, string> = {
  closing: "↘",
  widening: "↗",
  stable: "→",
};

const BALANCE_FINDINGS = [
  { pair: "Left vs Right Bench", ratio: 1.04, status: "ok", trend: "→" },
  { pair: "Push vs Pull", ratio: 0.87, status: "watch", trend: "↗" },
  { pair: "Quad vs Hamstring", ratio: 0.64, status: "flag", trend: "↘" },
];

function StrengthBalanceCard() {
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 4 }}>Strength Balance</div>
      {BALANCE_FINDINGS.map((f, i) => {
        const st = STATUS_STYLE[f.status];
        return (
          <div
            key={f.pair}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 10,
              paddingBottom: 10,
              borderTopStyle: "solid",
              borderTopWidth: i > 0 ? 1 : 0,
              borderTopColor: "#222",
            }}
          >
            <span
              style={{
                color: "#e5e5e5",
                fontSize: 13,
                fontWeight: 600,
                flex: 1,
              }}
            >
              {f.pair}
            </span>
            <span
              style={{
                color: "#e5e5e5",
                fontSize: 13,
                fontWeight: 700,
                marginLeft: 8,
                marginRight: 8,
              }}
            >
              {f.ratio.toFixed(2)}x
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#666", fontSize: 14 }}>
                {TREND_ARROW[f.trend]}
              </span>
              <span
                style={{
                  paddingLeft: 6,
                  paddingRight: 6,
                  paddingTop: 2,
                  paddingBottom: 2,
                  borderRadius: 6,
                  background: st.bg,
                }}
              >
                <span
                  style={{
                    color: st.fg,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {f.status}
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

const PLATEAUS = [
  { name: "Bench Press", sessions: 6 },
  { name: "Lateral Raises", sessions: 4 },
];

function PlateauCard() {
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 4 }}>Plateaus</div>
      {PLATEAUS.map((p, i) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            paddingBottom: 10,
            borderTopStyle: "solid",
            borderTopWidth: i > 0 ? 1 : 0,
            borderTopColor: "#222",
          }}
        >
          <span style={{ flex: 1 }}>
            <span
              style={{
                display: "block",
                color: "#e5e5e5",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {p.name}
            </span>
            <span
              style={{
                display: "block",
                color: "#666",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Stuck for {p.sessions} sessions
            </span>
          </span>
          <span
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 6,
              background: "#f59e0b22",
            }}
          >
            <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700 }}>
              Plateau
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function InjuryRiskCard() {
  const score = 24;
  const riskLevel = "low";
  const factors = { acwr: 0.9, recovery: 22, imbalance: 15 };
  const risk = (v: number) =>
    v < 30 ? "#22c55e" : v <= 60 ? "#f59e0b" : "#ef4444";
  const badge = { backgroundColor: "#22c55e22", color: "#22c55e" };
  return (
    <div style={CARD}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={LABEL}>Injury Risk</div>
        <span
          style={{
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 8,
            background: badge.backgroundColor,
          }}
        >
          <span
            style={{
              color: badge.color,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {riskLevel}
          </span>
        </span>
      </div>
      <div
        style={{
          color: risk(score),
          fontSize: 48,
          fontWeight: 800,
          textAlign: "center",
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        {score}
      </div>
      {(["acwr", "recovery", "imbalance"] as const).map((key) => (
        <div key={key} style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ color: "#aaa", fontSize: 12 }}>
              {key === "acwr"
                ? "ACWR"
                : key === "recovery"
                  ? "Recovery"
                  : "Imbalance"}
            </span>
            <span style={{ color: "#888", fontSize: 12 }}>{factors[key]}</span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: "#222",
              overflow: "hidden",
            }}
          >
            <div
              className="pf-barx"
              style={{
                height: 6,
                borderRadius: 3,
                width: `${Math.min(factors[key], 100) * (key === "acwr" ? 100 : 1)}%`,
                background: risk(factors[key]),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrainingTimelineCard() {
  return (
    <div style={CARD}>
      <div style={{ ...LABEL, marginBottom: 8 }}>Training Journey</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 28 }}>👑</span>
        <span>
          <span
            style={{
              display: "block",
              color: "#e5e5e5",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Master
          </span>
          <span style={{ display: "block", color: "#888", fontSize: 12 }}>
            19400 lifetime sets
          </span>
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: "#222",
          overflow: "hidden",
          marginTop: 14,
        }}
      >
        <div
          className="pf-barx"
          style={{
            height: 8,
            borderRadius: 4,
            width: "54%",
            background: "#3b82f6",
          }}
        />
      </div>
      <div
        style={{
          color: "#666",
          fontSize: 11,
          textAlign: "right",
          marginTop: 4,
        }}
      >
        54%
      </div>
      <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>
        Next: <span style={{ color: "#e5e5e5", fontWeight: 700 }}>Legend</span>{" "}
        in ~9 weeks
      </div>
    </div>
  );
}

const HEAT_WEEKS: {
  key: string;
  cells: { key: string; intensity: number }[];
}[] = (() => {
  const out = [];
  for (let w = 0; w < 20; w++) {
    const cells = [];
    for (let d = 0; d < 7; d++) {
      const n = (w * 7 + d) % 11;
      cells.push({ key: `c${w}-${d}`, intensity: n < 2 ? 0 : n / 11 });
    }
    out.push({ key: `w${w}`, cells });
  }
  return out;
})();

function heatColor(intensity: number): string {
  if (intensity === 0) return "#1a1a1a";
  if (intensity < 0.25) return "#0e4429";
  if (intensity < 0.5) return "#006d32";
  if (intensity < 0.75) return "#26a641";
  return "#39d353";
}

function ActivityHeatmap() {
  return (
    <div style={CARD}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={LABEL}>Activity</div>
        <span style={{ color: "#666", fontSize: 12 }}>72% consistency</span>
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {HEAT_WEEKS.map((week) => (
          <span
            key={week.key}
            style={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {week.cells.map((day) => (
              <span
                key={day.key}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: heatColor(day.intensity),
                }}
              />
            ))}
          </span>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 10,
          justifyContent: "flex-end",
        }}
      >
        <span style={{ color: "#666", fontSize: 10 }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((i) => (
          <span
            key={i}
            style={{
              width: 11,
              height: 11,
              borderRadius: 2,
              background: heatColor(i),
            }}
          />
        ))}
        <span style={{ color: "#666", fontSize: 10 }}>More</span>
      </div>
    </div>
  );
}

export function DashboardScreen() {
  return (
    <div className="pf-app" style={SCREEN_ROOT}>
      <div style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>
        Dashboard
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <KpiCard
          title="PRs"
          value="6"
          subtitle="last 30 days"
          delta="↑ 50.0%"
          deltaColor="#22c55e"
          color="#fbbf24"
          sparkData={[2, 3, 4, 4, 5, 6]}
        />
        <KpiCard
          title="Volume"
          value="48.2k"
          subtitle="last 30 days"
          delta="↑ 14.3%"
          deltaColor="#22c55e"
          color="#3b82f6"
          sparkData={[23, 27, 30, 34, 39, 45, 48]}
        />
      </div>
      <KpiCard
        title="Weekly Sets"
        value="31.2"
        subtitle="avg sets / muscle / week"
        delta="→ 0.0%"
        color="#8b5cf6"
      />
      <PrTrendCard />
      <VolumeDensityCard />
      <MuscleTrendCard />
      <StrengthBalanceCard />
      <WeeklySetsChart />
      <IntensityEvolutionCard />
      <WeeklyRhythmCard />
      <TopExercisesCard />
      <PlateauCard />
      <InjuryRiskCard />
      <TrainingTimelineCard />
      <ActivityHeatmap />
    </div>
  );
}

function MealFieldRow() {
  const fields = [
    { label: "Cal", placeholder: "0" },
    { label: "Protein", placeholder: "0g" },
    { label: "Carbs", placeholder: "0g" },
    { label: "Fat", placeholder: "0g" },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {fields.map((f) => (
        <div key={f.label} style={{ flex: 1 }}>
          <div
            style={{
              color: "#666",
              fontSize: 11,
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            {f.label}
          </div>
          <div
            style={{
              background: "#161616",
              borderRadius: 10,
              padding: "12px 0",
              color: "#fff",
              fontSize: 16,
              borderWidth: 1,

              borderStyle: "solid",
              borderColor: "#2a2a2a",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#444" }}>{f.placeholder}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MealsScreen() {
  return (
    <div className="pf-app" style={SCREEN_ROOT}>
      <div style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>Meals</div>
      <SegmentedControl options={["Log", "History"]} />
      <div style={{ ...CARD, padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
            1480{" "}
            <span style={{ color: "#888", fontSize: 14, fontWeight: 500 }}>
              / 2400 kcal
            </span>
          </span>
          <span style={{ color: "#3b82f6", fontSize: 13, fontWeight: 700 }}>
            Edit goal
          </span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: "#222",
            marginTop: 10,
            overflow: "hidden",
          }}
        >
          <div
            className="pf-barx"
            style={{ height: 8, width: "62%", background: "#22c55e" }}
          />
        </div>
        <div style={{ color: "#666", fontSize: 12, marginTop: 5 }}>
          Today: P128g C184g F64g
        </div>
      </div>
      <div style={CARD}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#888", fontSize: 12 }}>Current</div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
              86.4 kg
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#888", fontSize: 12 }}>Target</div>
            <div style={{ color: "#22c55e", fontSize: 20, fontWeight: 700 }}>
              83 kg
            </div>
          </div>
          <div>
            <div style={{ color: "#888", fontSize: 12, textAlign: "right" }}>
              TDEE
            </div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
              2800
            </div>
          </div>
        </div>
        <div
          style={{
            color: "#3b82f6",
            fontSize: 12,
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Update in Settings
        </div>
      </div>
      <div style={LABEL}>Log Meal</div>
      <div
        style={{
          background: "#161616",
          borderRadius: 10,
          padding: "13px 14px",
          color: "#555",
          fontSize: 16,
          borderWidth: 1,

          borderStyle: "solid",
          borderColor: "#2a2a2a",
        }}
      >
        Meal name (optional)
      </div>
      <MealFieldRow />
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            flex: 1,
            background: "#161616",
            borderRadius: 10,
            padding: "13px 0",
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#2a2a2a",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#8b5cf6", fontSize: 13, fontWeight: 600 }}>
            Take Photo
          </span>
        </div>
        <div
          style={{
            flex: 1,
            background: "#161616",
            borderRadius: 10,
            padding: "13px 0",
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#2a2a2a",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#8b5cf6", fontSize: 13, fontWeight: 600 }}>
            Pick from Gallery
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            flex: 2,
            background: "#22c55e",
            borderRadius: 14,
            padding: "15px 0",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>
            Save Meal
          </span>
        </div>
        <div
          style={{
            flex: 1,
            background: "#161616",
            borderRadius: 14,
            padding: "15px 0",
            textAlign: "center",
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#f59e0b",
          }}
        >
          <span style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700 }}>
            Save for later
          </span>
        </div>
      </div>
      <div style={{ ...LABEL, marginTop: 4 }}>Saved Meals</div>
      <div style={{ color: "#666", fontSize: 12, marginBottom: 6 }}>
        Swipe left to reveal Delete; swipe all the way to delete.
      </div>
      {[
        { name: "Oatmeal & Berries", cal: 420, p: 12, c: 72, f: 8 },
        { name: "Chicken & Rice Bowl", cal: 620, p: 45, c: 70, f: 16 },
      ].map((m) => (
        <div
          key={m.name}
          style={{
            background: "#161616",
            borderRadius: 10,
            padding: 14,
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#2a2a2a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            <span
              style={{
                display: "block",
                color: "#e5e5e5",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {m.name}
            </span>
            <span
              style={{
                display: "block",
                color: "#666",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {m.cal} cal | P{m.p} C{m.c} F{m.f}
            </span>
          </span>
          <span style={{ color: "#3b82f6", fontSize: 12 }}>Use</span>
        </div>
      ))}
    </div>
  );
}

const MUSCLE_TIERS = [
  { name: "Seedling", minSets: 0, icon: "🌱" },
  { name: "Sprout", minSets: 10, icon: "🌿" },
  { name: "Sapling", minSets: 30, icon: "🌳" },
  { name: "Foundation", minSets: 60, icon: "🏗️" },
  { name: "Builder", minSets: 120, icon: "🔨" },
  { name: "Sculptor", minSets: 250, icon: "🗿" },
  { name: "Elite", minSets: 500, icon: "⭐" },
  { name: "Master", minSets: 1000, icon: "👑" },
  { name: "Legend", minSets: 2000, icon: "🏆" },
];

function tierOf(sets: number) {
  for (let i = MUSCLE_TIERS.length - 1; i >= 0; i--) {
    if (sets >= MUSCLE_TIERS[i].minSets) return MUSCLE_TIERS[i];
  }
  return MUSCLE_TIERS[0];
}

function progressToNext(sets: number): number {
  const idx = MUSCLE_TIERS.indexOf(tierOf(sets));
  const cur = MUSCLE_TIERS[idx];
  const next = MUSCLE_TIERS[idx + 1];
  if (!next) return 100;
  return Math.min(
    Math.round(((sets - cur.minSets) / (next.minSets - cur.minSets)) * 100),
    100,
  );
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Optimal";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Low";
  return "Minimal";
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#84cc16";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#f97316";
  return "#ef4444";
}

const MUSCLE_COLORS: Record<string, string> = {
  Chest: "#ef4444",
  Back: "#3b82f6",
  Shoulders: "#f59e0b",
  Biceps: "#10b981",
  Triceps: "#8b5cf6",
  Forearms: "#6b7280",
  Quads: "#ec4899",
  Hamstrings: "#f97316",
  Glutes: "#14b8a6",
  Calves: "#a855f7",
  Abs: "#06b6d4",
  Obliques: "#84cc16",
  Traps: "#e11d48",
  "Rear Delts": "#0ea5e9",
};

const MUSCLE_STATS: Record<string, { sets: number; score: number }> = {
  Chest: { sets: 1240, score: 96 },
  Back: { sets: 980, score: 88 },
  Shoulders: { sets: 720, score: 80 },
  Biceps: { sets: 610, score: 76 },
  Triceps: { sets: 540, score: 72 },
  Quads: { sets: 480, score: 68 },
  Hamstrings: { sets: 320, score: 58 },
  Glutes: { sets: 210, score: 50 },
  Calves: { sets: 140, score: 42 },
  Abs: { sets: 118, score: 40 },
  Obliques: { sets: 92, score: 36 },
  Traps: { sets: 76, score: 34 },
  Forearms: { sets: 44, score: 30 },
  "Rear Delts": { sets: 28, score: 22 },
};

const MUSCLE_PATH_GROUPS: {
  muscle: string;
  front: string[] | null;
  back: string[] | null;
}[] = [
  {
    muscle: "Traps",
    front: null,
    back: [
      "M322.97 170.3V123.19C322.97 122.78 322.8 122.39 322.47 122.1 320.3 120.22 319.17 120.25 317.64 122.39 317.57 122.5 317.51 122.61 317.47 122.73 313.76 132.89 301.82 154.46 283.05 167.12 265.17 179.19 232.31 191.25 216.56 196.55 215.37 196.95 215.03 198.27 215.91 199.07 241.1 221.75 267.01 199.05 266.72 275.35 266.5 336.25 299.91 371.42 320.28 383.65 321.45 384.35 322.97 383.59 322.97 382.35V227.6C322.97 203.73 304.83 198.95 304.83 194.18 304.83 189.4 322.97 186.22 322.97 170.3Z",
      "M330.23 170.3V123.19C330.23 122.78 330.4 122.39 330.73 122.1 332.9 120.22 334.03 120.25 335.56 122.39 335.64 122.5 335.69 122.61 335.74 122.73 339.44 132.89 351.39 154.46 370.15 167.12 388.03 179.19 420.89 191.25 436.64 196.55 437.83 196.95 438.18 198.27 437.29 199.07 412.1 221.75 386.19 199.05 386.48 275.35 386.7 336.25 353.29 371.42 332.92 383.65 331.75 384.35 330.23 383.59 330.23 382.35V227.6C330.23 203.73 348.37 198.95 348.37 194.18 348.37 189.4 330.23 186.22 330.23 170.3Z",
    ],
  },
  {
    muscle: "Shoulders",
    front: [
      "M196.21 262.62c17.48-30.67 37.81-47.22 49.97-52.56 1.5-0.66 1.6-2.75 0.06-3.32-87.09-22.28-116.12 28.65-90.44 91.91a1.74 1.53 0 0 0 2.63 1.04c12.53-6.98 29.21-22.02 37.78-37.07z",
      "M464.75 262.62c-17.48-30.67-37.81-47.22-49.97-52.56-1.5-0.66-1.59-2.75-0.05-3.32 87.09-22.28 116.12 28.65 90.44 91.91a1.74 1.53 0 0 1-2.63 1.04c-12.53-6.98-29.21-22.02-37.79-37.07z",
    ],
    back: [
      "M161.69 295.86C172.61 286.25 189.16 272.07 217.73 265.8 238.25 261.3 257.45 249.89 255.84 237.15 253.62 219.65 231.14 217.72 221.36 210.1 163.3 179.85 125.2 237.15 158.73 295.25 159.15 296.36 160.75 296.69 161.69 295.86Z",
      "M491.52 295.86C480.59 286.25 464.04 272.07 435.47 265.8 414.95 261.3 395.75 249.89 397.36 237.15 399.58 219.65 422.06 217.72 431.84 210.1 489.9 179.85 528.01 237.15 494.47 295.25 494.05 296.36 492.46 296.69 491.52 295.86Z",
    ],
  },
  {
    muscle: "Chest",
    front: [
      "M326.86 238.75v65.25c0 0.88-0.8 1.59-1.81 1.6-11.83 0.1-36.98 1.14-56.26 4.77-25.4 4.77-41.73-6.37-48.99-17.51-5.42-8.31-18.17-10.63-26.1-11.06-1.35-0.07-2.16-1.3-1.43-2.29 3.51-4.78 11.39-14.43 16.65-23.26 22.83-38.34 46.81-45.19 58.06-44.56 8.06 0.45 40.28 8.91 48.99 12.73 8.71 3.82 10.89 11.14 10.89 14.33z",
      "M334.11 238.75v65.25c0 0.88 0.8 1.59 1.81 1.6 11.83 0.1 36.98 1.14 56.26 4.77 25.4 4.77 41.73-6.37 48.99-17.51 5.42-8.31 18.17-10.63 26.1-11.06 1.35-0.07 2.16-1.3 1.43-2.29-3.5-4.78-11.39-14.43-16.65-23.26-22.83-38.34-46.81-45.19-58.06-44.56-8.05 0.45-40.28 8.91-48.99 12.73-8.71 3.82-10.89 11.14-10.89 14.33z",
    ],
    back: null,
  },
  {
    muscle: "Biceps",
    front: [
      "M163.43 307.24c-24.36 10.63-49.59 95.91-14.39 90.67 10.24-1.31 48.99-33.42 47.17-66.85-1.81-9.55 13.36-34.61 5.45-38.2-15.17-6.87-21.74 4.24-37.99 14.25a1.84 1.61 0 0 1-0.24 0.13z",
      "M497.54 307.24c24.36 10.63 49.59 95.91 14.39 90.67-10.24-1.31-48.99-33.42-47.18-66.85 1.81-9.55-13.36-34.61-5.44-38.2 15.18-6.87 21.74 4.24 37.98 14.25a2.14 1.88 0 0 0 0.25 0.13z",
    ],
    back: null,
  },
  {
    muscle: "Triceps",
    front: null,
    back: [
      "M197.65 339.77C194.94 326.89 190.76 297.79 196.83 282.81 196.87 282.71 196.9 282.6 196.91 282.49 197.09 280.07 191.98 281.34 187.17 286.59 168.53 306.93 160.49 345.97 163.32 358.98 165.39 368.47 150.58 382.01 150.27 389.56 150.22 390.58 151.52 390.99 152.46 390.37 168.11 380.12 199.86 350.26 197.65 339.77Z",
      "M455.55 339.77C458.26 326.89 462.44 297.79 456.37 282.81 456.33 282.71 456.3 282.6 456.29 282.49 456.11 280.07 461.23 281.34 466.04 286.59 484.68 306.93 492.71 345.97 489.88 358.98 487.81 368.47 502.62 382.01 502.94 389.56 502.98 390.58 501.68 390.99 500.74 390.37 485.09 380.12 453.35 350.26 455.55 339.77Z",
      "M128.86 354.05C132.05 326.61 151.34 311.25 164.43 301.79 166.01 300.65 168.84 302.61 168.02 304.26 159.95 320.53 154.75 340.17 155.01 350.97 155.03 351.59 154.65 352.17 154.02 352.45 150.36 354.06 146.9 355.78 142.71 371.08 140.97 377.43 137.33 386.39 126.62 392.99 125.54 393.66 124.08 393.03 123.95 391.87 122.01 373.61 127.03 369.84 128.86 354.05Z",
      "M524.34 354.05C521.15 326.61 501.86 311.25 488.78 301.79 487.2 300.65 484.37 302.61 485.18 304.26 493.25 320.53 498.45 340.17 498.19 350.97 498.18 351.59 498.55 352.17 499.18 352.45 502.84 354.06 506.31 355.78 510.49 371.08 512.23 377.43 515.87 386.39 526.59 392.99 527.67 393.66 529.13 393.03 529.25 391.87 531.19 373.61 526.17 369.84 524.34 354.05Z",
    ],
  },
  {
    muscle: "Forearms",
    front: [
      "M85.53 436.11c0-17.71 20.74-40.27 31.86-45.78a1.7 1.49 0 0 1 1.62-0.01c9.98 4.51 13 6.83 6.19 37.83-9.99 45.43-69.65 82.24-65.18 73.41a1.84 1.61 0 0 1 0.24-0.33c9.1-9.74 25.28-44.52 25.27-65.12z",
      "M575.43 436.11c0-17.71-20.74-40.27-31.85-45.78a1.71 1.5 0 0 0-1.63-0.01c-9.98 4.51-13 6.83-6.18 37.83 9.99 45.43 69.65 82.24 65.17 73.41a1.79 1.57 0 0 0-0.23-0.33c-9.1-9.74-25.28-44.52-25.28-65.12z",
      "M138.92 405.32c7.46 2.54 18.1 2.29 26.54-5.23 1.23-1.1 3.6-0.43 3.59 1.11-0.18 17.16-4.92 37.64-39.97 65.15-33.69 26.44-46.58 49.84-50.54 55.35a1.63 1.43 0 0 1-0.72 0.54c-10.78 4.32-19.22-0.8-22.22-3.85-0.58-0.6-0.36-1.48 0.35-1.96 71.37-48.24 77.56-75.27 80.2-109.66 0.09-1.16 1.53-1.87 2.77-1.45z",
      "M522.05 405.32c-7.46 2.54-18.09 2.29-26.54-5.23-1.23-1.1-3.61-0.43-3.59 1.11 0.18 17.16 4.92 37.64 39.97 65.15 33.69 26.44 46.59 49.84 50.54 55.35a1.65 1.45 0 0 0 0.72 0.54c10.79 4.32 19.23-0.8 22.22-3.85 0.59-0.6 0.36-1.48-0.36-1.96-71.37-48.24-77.56-75.27-80.19-109.66-0.09-1.16-1.53-1.87-2.77-1.45z",
    ],
    back: [
      "M111.98 470.47C139.41 450.33 168.77 420.84 167.14 393.82 167.07 392.71 165.74 392.07 164.64 392.62 150.79 399.49 136.33 413.66 130.64 421.78L130.54 421.92C125.14 429.64 111.55 449.05 109.17 469.19 109 470.55 110.78 471.34 111.98 470.47Z",
      "M541.22 470.47C513.8 450.33 484.43 420.84 486.06 393.82 486.13 392.71 487.47 392.07 488.57 392.62 502.41 399.49 516.87 413.66 522.56 421.78L522.66 421.92C528.06 429.64 541.65 449.05 544.04 469.19 544.2 470.55 542.42 471.34 541.22 470.47Z",
      "M50.83 508.13C51.29 512.68 59.52 518.42 69.57 518.85 70.29 518.88 70.94 518.5 71.25 517.92 77.57 506.11 101.61 477.27 101.61 469.53 101.61 443.04 125.18 431.63 115.01 385.04 114.73 383.77 112.93 383.3 111.93 384.26 103.26 392.58 85.6 410.56 81.65 431.33 77.33 454.08 60.14 492.29 51.01 507.39 50.87 507.62 50.8 507.87 50.83 508.13Z",
      "M602.38 508.13C601.91 512.68 593.68 518.42 583.64 518.85 582.91 518.88 582.26 518.5 581.95 517.92 575.63 506.11 551.59 477.27 551.59 469.53 551.59 443.04 528.02 431.63 538.19 385.04 538.47 383.77 540.27 383.3 541.27 384.26 549.95 392.58 567.6 410.56 571.55 431.33 575.87 454.08 593.06 492.29 602.19 507.39 602.33 507.62 602.4 507.87 602.38 508.13Z",
    ],
  },
  {
    muscle: "Abs",
    front: [
      "M268.79 359.71c19.32-10.59 37-21.59 56.25-22.25a1.87 1.64 0 0 0 1.82-1.62v-21.81c0-0.31-0.09-0.63-0.37-0.83-5.43-4.17-45.62 0.48-68.58 5.12-24.6 4.98-3.63 49.34 10.88 41.39z",
      "M326.86 383.26v-37.73a1.76 1.54 0 0 0-1.96-1.56c-23.21 2.59-52.88 20.54-52.48 25.29 0.4 4.65 6.97 24.01 14.52 20.69 9.81-4.32 28.02-5.98 37.77-5.04a1.92 1.69 0 0 0 2.15-1.65z",
      "M392.18 359.71c-19.32-10.59-37-21.59-56.25-22.25a1.87 1.64 0 0 1-1.82-1.62v-21.81c0-0.31 0.09-0.63 0.37-0.83 5.44-4.17 45.62 0.48 68.58 5.12 24.6 4.98 3.63 49.34-10.88 41.39z",
      "M334.11 383.26v-37.73c0-0.93 0.91-1.67 1.96-1.56 23.21 2.59 52.88 20.54 52.48 25.29-0.4 4.65-6.97 24.01-14.52 20.69-9.81-4.32-28.01-5.98-37.77-5.04a1.92 1.69 0 0 1-2.15-1.65z",
      "M326.86 444.07v-51.59c0-0.58-0.36-1.12-1-1.27-5.6-1.38-24.32-0.31-31.66 3.52-20.01 10.41-11.59 49.95 7.25 50.93 2.48 0.13 15.84 0.02 23.59 0a1.81 1.59 0 0 0 1.82-1.59z",
      "M326.86 577.76v-124.14c0-0.88-0.81-1.59-1.82-1.61-10.05-0.15-30.95-1.19-32.66 4.79-14.44 50.68 17.35 117.23 32.72 122.25 0.94 0.31 1.75-0.41 1.76-1.29z",
      "M334.11 444.07v-51.59c0-0.58 0.36-1.12 1-1.27 5.6-1.38 24.32-0.31 31.66 3.52 20.01 10.41 11.59 49.95-7.25 50.93-2.48 0.13-15.84 0.02-23.6 0a1.81 1.59 0 0 1-1.81-1.59z",
      "M334.11 577.76v-124.14c0-0.88 0.81-1.59 1.82-1.61 10.05-0.15 30.96-1.19 32.66 4.79 14.45 50.68-17.35 117.23-32.72 122.25-0.94 0.31-1.76-0.41-1.76-1.29z",
    ],
    back: null,
  },
  {
    muscle: "Obliques",
    front: [
      "M233.25 447.74c-4.39 9.46-4.45 22.44-2.56 29.75 11.04 26.5 25.97 40.26 41.59 46.95a1.65 1.45 0 0 0 2.38-1.05c2.5-13.49-4.72-40.09-7.68-44.31-9.75-13.9-21.59-23.31-30.87-31.77-0.88-0.8-2.39-0.6-2.86 0.43z",
      "M427.72 447.74c4.39 9.46 4.45 22.44 2.56 29.75-11.04 26.5-25.96 40.26-41.59 46.95a1.65 1.45 0 0 1-2.39-1.05c-2.5-13.49 4.72-40.09 7.69-44.31 9.75-13.9 21.59-23.31 30.86-31.77 0.88-0.8 2.39-0.6 2.87 0.43z",
      "M271.02 464.2c1.07-5.49 0.91-17.89 1.15-23.32 0.38-8.66-16.01-17.3-28.24-24.14a1.92 1.68 0 0 0-2.88 1.08c-1.89 7.59-6.03 17.17-1.29 21.47 10.91 9.9 18.58 16.3 28.81 25.45 0.87 0.78 2.25 0.53 2.45-0.54z",
      "M389.95 464.2c-1.07-5.49-0.91-17.89-1.15-23.32-0.38-8.66 16.01-17.3 28.24-24.14a1.92 1.68 0 0 1 2.88 1.08c1.9 7.59 6.03 17.17 1.29 21.47-10.91 9.9-18.58 16.3-28.81 25.45-0.87 0.78-2.24 0.53-2.45-0.54z",
      "M274.4 422c0.32-21.15-5.49-49.21-33.04-55.3-1.42-0.32-2.58 0.98-2.06 2.18 4.71 10.91 6.78 28.57 5.9 36.99 0.08 3.81 16.21 9.23 25.62 17.25 1.23 1.05 3.56 0.38 3.58-1.12z",
      "M386.57 422c-0.32-21.15 5.48-49.21 33.04-55.3 1.42-0.32 2.58 0.98 2.06 2.18-4.7 10.91-6.78 28.57-5.91 36.99-0.08 3.81-16.21 9.23-25.61 17.25-1.23 1.05-3.56 0.38-3.58-1.12z",
      "M236.78 318.02c-5.9-1.81-14.54-7.9-20.41-14.13-1.18-1.24-4.06-0.53-4.37 1.06-1.52 8.2-5.81 14.76-6.69 22.77a1.82 1.59 0 0 0 0 0.31c2.93 24.59 15.58 43.89 26.02 54.34 1.07 1.07 2.91 0.38 2.71-1.03-1.3-9.05-6.54-15.37-3.35-20.04 5.38-7.86 11.76-13.23 7.42-41.89a2 1.75 0 0 0-1.33-1.39z",
      "M424.19 318.02c5.9-1.81 14.54-7.9 20.42-14.13 1.17-1.24 4.06-0.53 4.35 1.06 1.53 8.2 5.82 14.76 6.71 22.77a1.67 1.46 0 0 1-0.01 0.31c-2.93 24.59-15.58 43.89-26.02 54.34-1.07 1.07-2.91 0.38-2.71-1.03 1.3-9.05 6.55-15.37 3.35-20.04-5.37-7.86-11.75-13.23-7.43-41.89a2 1.75 0 0 1 1.34-1.39z",
    ],
    back: [
      "M248.58 490.22C253.21 472.48 245.98 437.53 240.38 421.71 239.81 420.11 237.41 420.48 237.13 422.14 235.12 433.92 228.35 441.69 226.81 455.21 224.93 471.69 232.53 472.67 232.49 496.93 232.48 498.65 235.78 499.52 237.21 498.35 242.47 494.05 246.99 496.31 248.58 490.22Z",
      "M404.62 490.22C399.99 472.48 407.22 437.53 412.82 421.71 413.39 420.11 415.79 420.48 416.08 422.14 418.09 433.92 424.86 441.69 426.4 455.21 428.28 471.69 420.68 472.67 420.72 496.93 420.72 498.65 417.43 499.52 415.99 498.35 410.73 494.05 406.21 496.31 404.62 490.22Z",
    ],
  },
  {
    muscle: "Back",
    front: null,
    back: [
      "M260.65 288.92C260.65 275.6 260.65 266.09 258.93 255.47 258.71 254.1 256.71 253.64 255.64 254.66 235.32 274.06 202.5 272.61 206.85 278.54 223.6 301.42 260.65 292.03 260.65 289.12V288.92Z",
      "M392.55 288.92C392.55 275.6 392.55 266.09 394.27 255.47 394.49 254.1 396.49 253.64 397.56 254.66 417.88 274.06 450.7 272.61 446.35 278.54 429.6 301.42 392.55 292.03 392.55 289.12V288.92Z",
      "M258.75 297.08C235.82 305.77 215.28 295.28 205.65 287.14 204.59 286.24 202.77 286.66 202.51 287.93 196.59 317.03 211.12 365.52 232.25 385.18 240.64 392.98 246.53 414.56 251.89 431.9 252.08 432.52 252.67 432.99 253.41 432.98 269 432.9 318.07 404.24 322.67 392.6 322.92 391.98 322.54 391.33 321.89 391 281.97 370.56 263.75 319.76 261.48 298.47 261.36 297.32 259.96 296.62 258.75 297.08Z",
      "M394.45 297.08C417.38 305.77 437.92 295.28 447.55 287.14 448.61 286.24 450.43 286.66 450.7 287.93 456.61 317.03 442.08 365.52 420.95 385.18 412.57 392.98 406.67 414.56 401.31 431.9 401.12 432.52 400.53 432.99 399.8 432.98 384.21 432.9 335.14 404.24 330.53 392.6 330.29 391.98 330.66 391.33 331.31 391 371.24 370.56 389.45 319.76 391.73 298.47 391.85 297.32 393.25 296.62 394.45 297.08Z",
      "M322.97 511.89V405.15C322.97 403.7 320.94 403.01 319.8 404.05 299.86 422.4 285.4 430.65 257.31 438.86 256.47 439.11 255.94 439.86 256.07 440.63 259.3 459.73 259.42 476.05 257.91 488.32 257.78 489.31 258.72 490.16 259.85 490.13 289.79 489.13 309.69 502.75 318.71 513 319.89 514.34 322.97 513.58 322.97 511.89Z",
      "M330.23 511.89V405.15C330.23 403.7 332.26 403.01 333.4 404.05 353.34 422.4 367.8 430.65 395.89 438.86 396.74 439.11 397.26 439.86 397.14 440.63 393.91 459.73 393.78 476.05 395.3 488.32 395.42 489.31 394.49 490.16 393.35 490.13 363.41 489.13 343.52 502.75 334.49 513 333.31 514.34 330.23 513.58 330.23 511.89Z",
    ],
  },
  {
    muscle: "Glutes",
    front: null,
    back: [
      "M322.97 596.71V533.41C322.97 533.27 322.95 533.13 322.91 532.99 311.8 498.09 238.09 473.48 230.44 526.83 230.44 552.3 232.25 588.91 234.06 596.86 250.36 642.94 315.48 627.16 322.93 597.03 322.96 596.92 322.97 596.82 322.97 596.71Z",
      "M330.23 596.71V533.41C330.23 533.27 330.25 533.13 330.29 532.99 341.4 498.09 415.11 473.48 422.77 526.83 422.77 552.3 420.95 588.91 419.14 596.86 402.84 642.94 337.72 627.16 330.27 597.03 330.24 596.92 330.23 596.82 330.23 596.71Z",
    ],
  },
  {
    muscle: "Quads",
    front: [
      "M228.87 791.04c-31.43-14.83-39.45-153.68-11.73-175.04 1.07-0.82 2.54-0.04 2.43 1.2-2.23 25.71-10.14 85.41 5.68 118.14 19.71 40.79 9.5 58.48 3.62 55.7z",
      "M432.09 791.04c31.43-14.83 39.45-153.68 11.74-175.04-1.07-0.82-2.54-0.04-2.43 1.2 2.23 25.71 10.14 85.41-5.68 118.14-19.71 40.79-9.5 58.48-3.63 55.7z",
      "M262.62 532.67c25.94 27.9 23.79 215.1-15.01 218.54a1.54 1.35 0 0 1-1.07-0.24c-37.07-23.14-21.5-187.12 13.79-218.36 0.68-0.6 1.68-0.6 2.3 0.06z",
      "M398.34 532.67c-25.94 27.9-23.79 215.1 15.01 218.54a1.55 1.36 0 0 0 1.07-0.24c37.08-23.14 21.5-187.12-13.79-218.36-0.68-0.6-1.68-0.6-2.29 0.06z",
      "M301.45 733.74c0-11.94-6.3-44.89-11.55-61.98-0.52-1.7-2.86-1.34-2.9 0.42-0.54 26.52-7.72 65.74-27.28 88.62-18.54 21.68-14.52 50.93 12.7 57.3s29.03-62.02 29.03-84.36z",
      "M359.52 733.74c0-11.94 6.3-44.89 11.55-61.98 0.52-1.7 2.86-1.34 2.9 0.42 0.54 26.52 7.72 65.74 27.28 88.62 18.54 21.68 14.52 50.93-12.7 57.3s-29.03-62.02-29.03-84.36z",
    ],
    back: null,
  },
  {
    muscle: "Hamstrings",
    front: null,
    back: [
      "M284.87 630.29C298.07 627.72 306.53 625.14 312.16 621.73 313.52 620.9 315.6 621.75 315.53 623.2 313.76 661.38 310.39 680.46 304.03 712.7 303.72 714.25 301.38 714.51 300.72 713.05 286.19 680.8 281.5 630.94 284.87 630.29Z",
      "M368.33 630.29C355.13 627.72 346.67 625.14 341.04 621.73 339.69 620.9 337.6 621.75 337.67 623.2 339.45 661.38 342.81 680.46 349.17 712.7 349.48 714.25 351.82 714.51 352.48 713.05 367.02 680.8 371.7 630.94 368.33 630.29Z",
      "M275.53 630.83C269.71 630.66 264.06 629.85 260.6 629 259.91 628.83 259.18 628.96 258.76 629.48 246.29 644.92 243.2 737.77 246.77 783.08 249.66 819.85 268.75 828.53 276.74 859.92 277.11 861.37 279.27 861.7 279.96 860.34 294.64 831.23 301.13 754.06 301.2 729.35 301.2 729.09 301.12 728.85 300.98 728.62 280.7 695.68 276.41 645.29 277.48 632.78 277.56 631.78 276.67 630.87 275.53 630.83Z",
      "M377.67 630.83C383.49 630.66 389.14 629.85 392.6 629 393.29 628.83 394.03 628.96 394.45 629.48 406.92 644.92 410 737.77 406.44 783.08 403.55 819.85 384.46 828.53 376.46 859.92 376.09 861.37 373.93 861.7 373.24 860.34 358.56 831.23 352.07 754.06 352 729.35 352 729.09 352.08 728.85 352.22 728.62 372.51 695.68 376.79 645.29 375.73 632.78 375.64 631.78 376.53 630.87 377.67 630.83Z",
      "M250.71 625.7C247.64 624.21 245.37 622.71 243.1 620.76 242.21 619.99 240.72 620.15 240.14 621.12 224.97 646.7 201.4 697.96 201.99 732.81 202.44 759.3 222.45 786.37 214.22 826.73 213.88 828.38 216.24 829.4 217.39 828.06 227.52 816.22 240.35 796.15 238.97 770.52 235.23 701.02 243.32 646.76 251.58 627.75 251.92 626.97 251.54 626.1 250.71 625.7Z",
      "M402.5 625.7C405.56 624.21 407.84 622.71 410.11 620.76 410.99 619.99 412.49 620.15 413.06 621.12 428.24 646.7 451.81 697.96 451.21 732.81 450.76 759.3 430.75 786.37 438.98 826.73 439.32 828.38 436.96 829.4 435.82 828.06 425.68 816.22 412.85 796.15 414.23 770.52 417.97 701.02 409.88 646.76 401.62 627.75 401.28 626.97 401.66 626.1 402.5 625.7Z",
      "M235.41 613.43C232.23 609.01 229.85 603.9 228.74 599.68 228.4 598.37 226.48 597.79 225.41 598.75 193.08 627.64 195.04 653.27 198.02 710.23 201.03 675.92 225.38 630.65 235.48 615.1 235.82 614.57 235.78 613.94 235.41 613.43Z",
      "M417.79 613.43C420.98 609.01 423.35 603.9 424.46 599.68 424.8 598.37 426.72 597.79 427.79 598.75 460.12 627.64 458.16 653.27 455.18 710.23 452.17 675.92 427.83 630.65 417.73 615.1 417.39 614.57 417.42 613.94 417.79 613.43Z",
      "M224.99 587.31C224.94 585.01 223.86 572.68 223.39 561.33 223.32 559.55 220.44 559.13 219.79 560.82 212.72 579.22 203.23 607.08 204.59 609.48 204.75 609.75 205.12 609.46 205.31 609.21 210.95 601.29 225.07 590.72 224.99 587.31Z",
      "M428.21 587.31C428.26 585.01 429.35 572.68 429.81 561.33 429.89 559.55 432.76 559.13 433.41 560.82 440.48 579.22 449.97 607.08 448.61 609.48 448.46 609.75 448.08 609.46 447.9 609.21 442.25 601.29 428.13 590.72 428.21 587.31Z",
    ],
  },
  {
    muscle: "Calves",
    front: [
      "M230.69 921.56c-9.97-11.37-13.9-22.1-18.73-41.21-0.38-1.52-2.65-1.72-3.2-0.23-12.41 34.06-10.5 118.51 12.86 162.4 12.7 23.87 23.59 74.81 27.21 66.85s0-167.12-18.14-187.81z",
      "M430.28 921.56c9.98-11.37 13.91-22.1 18.73-41.21 0.38-1.52 2.65-1.72 3.19-0.23 12.41 34.06 10.5 118.51-12.85 162.4-12.7 23.87-23.59 74.81-27.22 66.85s0-167.12 18.15-187.81z",
      "M276.62 1010.98c19.5-44.87 10.18-93.64 2.52-116.11-0.46-1.34-2.15-1.39-2.47-0.02-4.71 20.14-7.32 106.33-1.63 116.47 0.4 0.71 1.26 0.4 1.58-0.34z",
      "M384.35 1010.98c-19.5-44.87-10.18-93.64-2.52-116.11 0.46-1.34 2.15-1.39 2.47-0.02 4.71 20.14 7.32 106.33 1.63 116.47-0.4 0.71-1.26 0.4-1.58-0.34z",
    ],
    back: [
      "M288.5 940.66C276.23 869.95 260.58 830.42 248.08 824.92 247.34 824.59 246.48 824.89 246.22 825.59 240.19 841.46 252.21 945.07 252.21 990 252.21 1007.51 269.89 1034.05 275.8 1020.24 281.24 1007.51 292.9 966.02 288.5 940.66Z",
      "M364.7 940.66C376.97 869.95 392.62 830.42 405.12 824.92 405.87 824.59 406.72 824.89 406.99 825.59 413.01 841.46 400.99 945.07 400.99 990 400.99 1007.51 383.31 1034.05 377.41 1020.24 371.96 1007.51 360.31 966.02 364.7 940.66Z",
      "M244.95 977.26C246.77 990 244.95 1020.82 221.36 1017.06 197.78 1013.29 197.36 945.43 199.59 910.42 202.36 866.9 210.66 840.46 231.93 824.7 232.14 824.55 232.4 824.4 232.66 824.48 239.37 826.42 236.06 914.84 244.95 977.26Z",
      "M408.25 977.26C406.44 990 408.25 1020.82 431.84 1017.06 455.43 1013.29 455.84 945.43 453.61 910.42 450.84 866.9 442.55 840.46 421.27 824.7 421.07 824.55 420.8 824.4 420.54 824.48 413.83 826.42 417.15 914.84 408.25 977.26Z",
      "M221.36 1023.42C218.34 1023.42 215.7 1022.12 213.73 1020.86 212.46 1020.05 211.18 1020.82 211.61 1022.15 231.09 1082.7 233.73 1111.08 231.01 1131.15 230.82 1132.54 232.39 1133.26 233.19 1132.05 246.15 1112.45 226.77 1023.42 221.36 1023.42Z",
      "M431.84 1023.42C434.86 1023.42 437.51 1022.12 439.47 1020.86 440.75 1020.05 442.02 1020.82 441.59 1022.15 422.11 1082.7 419.47 1111.08 422.19 1131.15 422.38 1132.54 420.81 1133.26 420.01 1132.05 407.05 1112.45 426.43 1023.42 431.84 1023.42Z",
    ],
  },
];

const ADDUCTOR_PATHS_FRONT = [
  "M253.05 526.63c-19.81 23.31-28.93 72.91-41.96 87.3-0.87 0.97-2.43 0.49-2.45-0.74-0.25-18.34 25.68-60.66 25.95-99.64 0.01-1.71 3.04-2.5 4.18-1.1 4.84 5.98 9.71 9.4 13.82 11.82a1.89 1.66 0 0 1 0.46 2.36z",
  "M407.92 526.63c19.81 23.31 28.93 72.91 41.96 87.3 0.88 0.97 2.43 0.49 2.45-0.74 0.25-18.34-25.68-60.66-25.95-99.64-0.01-1.71-3.04-2.5-4.18-1.1-4.84 5.98-9.71 9.4-13.81 11.82a1.89 1.66 0 0 0-0.47 2.36z",
  "M314.15 606.41c-6.38-6.74-18.21-23.23-25.71-33.97-1.05-1.51-3.78-0.58-3.47 1.17 10.19 55.65 2.01 76.88 5.6 82.14 8.25 12.11 9.05 20.49 12.57 40.67 0.08 0.45 0.41 0.96 0.92 0.87 7.8-1.36 14.37-86.36 10.09-90.88z",
  "M346.81 606.41c6.38-6.74 18.21-23.23 25.72-33.97 1.06-1.51 3.78-0.58 3.46 1.17-10.19 55.65-2.01 76.88-5.59 82.14-8.25 12.11-9.05 20.49-12.57 40.67-0.08 0.45-0.41 0.96-0.92 0.87-7.8-1.36-14.37-86.36-10.1-90.88z",
];

function BodyMap({
  stats,
  selected,
  onSelect,
}: {
  stats: Record<string, number>;
  selected: string | null;
  onSelect: (m: string | null) => void;
}) {
  const [view, setView] = useState<"front" | "back">("front");
  const intensity = (m: string) => Math.min((stats[m] ?? 0) / 100, 1);
  const MAP_BODY_W = 116;
  const MAP_BODY_H = (MAP_BODY_W * 1206.46) / 660.46;
  const onMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget) return;
    const muscle = (e.target as Element).getAttribute("data-muscle");
    onSelect(muscle || null);
  };
  return (
    <div
      style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["front", "back"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            style={{
              padding: "7px 20px",
              borderRadius: 8,
              background: view === v ? "#3b82f6" : "#161616",
              borderWidth: 1,

              borderStyle: "solid",
              borderColor: view === v ? "#3b82f6" : "#2a2a2a",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "capitalize",
              color: view === v ? "#fff" : "#888",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {v}
          </button>
        ))}
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative mockup map, pointer-only works */}
      <svg
        width={MAP_BODY_W}
        height={MAP_BODY_H}
        viewBox="0 0 660.46 1206.46"
        onClick={onMapClick}
        style={{ cursor: "pointer" }}
      >
        <title>Body map</title>
        <rect x="0" y="0" width="660.46" height="1206.46" fill="transparent" />
        {view === "front" &&
          ADDUCTOR_PATHS_FRONT.map((d) => {
            const sel = selected === "Quads";
            return (
              <path
                key={d}
                d={d}
                data-muscle="Quads"
                fill={MUSCLE_COLORS.Quads}
                opacity={sel ? 0.9 : 0.15 + intensity("Quads") * 0.65}
                stroke={sel ? "#fff" : "rgba(255,255,255,0.08)"}
                strokeWidth={sel ? 2 : 0.5}
              />
            );
          })}
        {MUSCLE_PATH_GROUPS.map((g) => {
          const paths = view === "front" ? g.front : g.back;
          if (!paths) return null;
          const color = MUSCLE_COLORS[g.muscle] || "#666";
          const sel = selected === g.muscle;
          return (
            <g
              key={g.muscle}
              transform={
                g.muscle === "Calves" && view === "front"
                  ? "translate(0, -90)"
                  : undefined
              }
            >
              {paths.map((d, i) => (
                <path
                  key={`${g.muscle}-${i}`}
                  d={d}
                  data-muscle={g.muscle}
                  fill={color}
                  opacity={sel ? 0.9 : 0.15 + intensity(g.muscle) * 0.65}
                  stroke={sel ? "#fff" : "rgba(255,255,255,0.08)"}
                  strokeWidth={sel ? 2 : 0.5}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MuscleRow({
  name,
  color,
  sets,
}: {
  name: string;
  color: string;
  sets: number;
}) {
  const tier = tierOf(sets);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "#222",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: color,
          marginRight: 10,
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1 }}>
        <span
          style={{
            display: "block",
            color: "#e5e5e5",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {name}
        </span>
        <span style={{ display: "block", color: "#666", fontSize: 11 }}>
          {sets} sets
        </span>
      </span>
      <span style={{ fontSize: 16, marginRight: 8 }}>{tier.icon}</span>
      <span style={{ color: "#888", fontSize: 12 }}>{tier.name}</span>
    </div>
  );
}

function MuscleDetailCard({
  muscle,
  sets,
  score,
}: {
  muscle: string;
  sets: number;
  score: number;
}) {
  const color = MUSCLE_COLORS[muscle] || "#666";
  const tier = tierOf(sets);
  const pct = progressToNext(sets);
  return (
    <div style={{ ...CARD, borderColor: color }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
          {muscle}
        </span>
        <span style={{ fontSize: 24 }}>{tier.icon}</span>
      </div>
      <div style={{ color, fontSize: 14, fontWeight: 600, marginTop: 4 }}>
        {tier.name}
      </div>
      <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
        {sets} lifetime sets
      </div>
      <div style={{ marginTop: 10 }}>
        <div
          style={{
            height: 6,
            background: "#222",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            className="pf-barx"
            style={{
              height: 6,
              width: `${pct}%`,
              background: color,
              borderRadius: 3,
            }}
          />
        </div>
        <div style={{ color: "#666", fontSize: 11, marginTop: 4 }}>
          {pct}% to next tier
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          paddingTop: 12,
          borderTopStyle: "solid",
          borderTopWidth: 1,
          borderTopColor: "#222",
        }}
      >
        <div>
          <div style={{ color: "#666", fontSize: 11 }}>HYPERTROPHY SCORE</div>
          <div
            style={{
              color: scoreColor(score),
              fontSize: 22,
              fontWeight: 800,
              marginTop: 2,
            }}
          >
            {score}
          </div>
        </div>
        <div
          style={{
            background: `${scoreColor(score)}20`,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: 6,
          }}
        >
          <span
            style={{ color: scoreColor(score), fontSize: 12, fontWeight: 600 }}
          >
            {scoreLabel(score)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MusclesScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const muscles = Object.entries(MUSCLE_STATS)
    .map(([name, s]) => ({ name, sets: s.sets, score: s.score }))
    .sort((a, b) => b.sets - a.sets);
  const scores: Record<string, number> = Object.fromEntries(
    Object.entries(MUSCLE_STATS).map(([name, s]) => [name, s.score]),
  );
  const selData = selected ? MUSCLE_STATS[selected] : null;
  return (
    <div className="pf-app" style={SCREEN_ROOT}>
      <div style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>
        Muscles
      </div>
      <BodyMap
        stats={scores}
        selected={selected}
        onSelect={(m) => setSelected(m === selected ? null : m)}
      />
      {selData && (
        <MuscleDetailCard
          muscle={selected!}
          sets={selData.sets}
          score={selData.score}
        />
      )}
      <div style={{ ...CARD, padding: 16 }}>
        <div style={LABEL}>All Muscles</div>
        {muscles.map((m) => (
          <MuscleRow
            key={m.name}
            name={m.name}
            color={MUSCLE_COLORS[m.name]}
            sets={m.sets}
          />
        ))}
      </div>
    </div>
  );
}

function SegmentedControl({ options }: { options: [string, string] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: "#161616",
        borderRadius: 12,
        padding: 3,
        borderWidth: 1,

        borderStyle: "solid",
        borderColor: "#222",
      }}
    >
      <div
        style={{
          flex: 1,
          paddingTop: 9,
          paddingBottom: 9,
          borderRadius: 9,
          textAlign: "center",
          background: "#3b82f6",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {options[0]}
      </div>
      <div
        style={{
          flex: 1,
          paddingTop: 9,
          paddingBottom: 9,
          borderRadius: 9,
          textAlign: "center",
          color: "#888",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {options[1]}
      </div>
    </div>
  );
}

const setInput: React.CSSProperties = {
  background: "#1a1a1a",
  borderRadius: 8,
  padding: "8px 0",
  color: "#fff",
  fontSize: 14,
  textAlign: "center",
  borderWidth: 1,

  borderStyle: "solid",
  borderColor: "#2a2a2a",
};

function SetRowMock({
  index,
  weight,
  reps,
  rpe,
  isPr,
}: {
  index: number;
  weight: string;
  reps: string;
  rpe: string;
  isPr?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      <span
        style={{ color: "#666", fontSize: 13, width: 24, textAlign: "center" }}
      >
        {index}
      </span>
      <span style={{ ...setInput, width: 65 }}>{weight}</span>
      <span style={{ ...setInput, width: 55 }}>{reps}</span>
      <span style={{ ...setInput, width: 50 }}>{rpe}</span>
      <span style={{ flex: 1 }} />
      {isPr && (
        <span
          style={{
            background: "#fbbf24",
            borderRadius: 6,
            padding: "2px 6px",
            color: "#000",
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          PR
        </span>
      )}
    </div>
  );
}

function ExerciseBlock({ name = "Bench Press" }: { name?: string }) {
  const statHead: React.CSSProperties = {
    color: "#555",
    fontSize: 11,
    textAlign: "center",
  };
  return (
    <div style={CARD}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 8,
            background: "#1a1a1a",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <span style={{ color: "#666", fontSize: 10 }}>IMG</span>
        </div>
        <span
          style={{ color: "#e5e5e5", fontSize: 15, fontWeight: 700, flex: 1 }}
        >
          {name}
        </span>
        <span style={{ color: "#ef4444", fontSize: 13 }}>Remove</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 4,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <span style={{ ...statHead, width: 65 }}>KG</span>
        <span style={{ ...statHead, width: 55 }}>REPS</span>
        <span style={{ ...statHead, width: 50 }}>RPE</span>
      </div>
      <SetRowMock index={1} weight="100" reps="10" rpe="7" />
      <SetRowMock index={2} weight="100" reps="8" rpe="8" />
      <SetRowMock index={3} weight="105" reps="6" rpe="9" isPr />
      <div
        style={{
          marginTop: 8,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#2a2a2a",
          textAlign: "center",
        }}
      >
        <span style={{ color: "#3b82f6", fontSize: 14, fontWeight: 600 }}>
          + Add Set
        </span>
      </div>
    </div>
  );
}

export function LoggingScreen() {
  return (
    <div className="pf-app" style={SCREEN_ROOT}>
      <div style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>
        Workouts
      </div>
      <SegmentedControl options={["Log", "History"]} />
      <div
        style={{
          alignSelf: "flex-start",
          background: "#102a1a",
          borderRadius: 10,
          padding: "8px 12px",
          borderWidth: 1,

          borderStyle: "solid",
          borderColor: "#22c55e",
        }}
      >
        <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 700 }}>
          ✓ At Powerhouse
        </span>
      </div>
      <div style={{ ...CARD, borderColor: "#3b82f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#3b82f6",
            }}
          />
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>
            Today: Push Day
          </span>
        </div>
        <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
          Push / Pull / Legs (4 exercises)
        </div>
        <div
          style={{
            background: "#3b82f6",
            borderRadius: 10,
            padding: 12,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
            Start Workout
          </span>
        </div>
      </div>
      <div
        style={{
          background: "#161616",
          borderRadius: 10,
          padding: 14,
          borderWidth: 1,

          borderStyle: "solid",
          borderColor: "#2a2a2a",
          textAlign: "center",
        }}
      >
        <span style={{ color: "#8b5cf6", fontSize: 14, fontWeight: 600 }}>
          Schedule
        </span>
      </div>
      <div
        style={{
          background: "#161616",
          borderRadius: 10,
          padding: "13px 14px",
          borderWidth: 1,

          borderStyle: "solid",
          borderColor: "#2a2a2a",
          color: "#555",
          fontSize: 16,
        }}
      >
        Workout title (optional)
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            flex: 1,
            background: "#161616",
            borderRadius: 10,
            padding: "13px 0",
            textAlign: "center",
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#2a2a2a",
          }}
        >
          <span style={{ color: "#8b5cf6", fontSize: 14, fontWeight: 600 }}>
            Load Template
          </span>
        </div>
        <div
          style={{
            flex: 1,
            background: "#161616",
            borderRadius: 10,
            padding: "13px 0",
            textAlign: "center",
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#2a2a2a",
          }}
        >
          <span style={{ color: "#f59e0b", fontSize: 14, fontWeight: 600 }}>
            Save as Template
          </span>
        </div>
      </div>
      <ExerciseBlock />
      <div
        style={{
          background: "#161616",
          borderRadius: 14,
          padding: "13px 0",
          textAlign: "center",
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#3b82f6",
          color: "#3b82f6",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        + Add Exercise
      </div>
      <ExerciseBlock name="Incline DB Press" />
      <div style={CARD}>
        <div
          style={{
            color: "#888",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 10,
          }}
        >
          Rest Timer
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {[60, 90, 120, 180].map((p) => (
            <span
              key={p}
              style={{
                background: p === 90 ? "#3b82f6" : "#1a1a1a",
                borderRadius: 8,
                padding: "8px 14px",
                borderWidth: 1,

                borderStyle: "solid",
                borderColor: p === 90 ? "#3b82f6" : "#2a2a2a",
                color: p === 90 ? "#fff" : "#888",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {p}s
            </span>
          ))}
        </div>
        <div
          style={{
            background: "#22c55e",
            borderRadius: 10,
            padding: 12,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>
            Start
          </span>
        </div>
      </div>
      <div
        style={{
          background: "#22c55e",
          borderRadius: 14,
          padding: 18,
          textAlign: "center",
        }}
      >
        <span style={{ color: "#fff", fontSize: 17, fontWeight: 800 }}>
          Save Workout
        </span>
        <div
          style={{ color: "#fff", fontSize: 13, opacity: 0.8, marginTop: 2 }}
        >
          2 exercises | 4.9k volume
        </div>
      </div>
      <div style={CARD}>
        <div
          style={{
            color: "#f59e0b",
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Suggestions
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
            Chest{" "}
            <span style={{ color: "#888", fontWeight: 400 }}>
              -- lagging, hit it mid-week
            </span>
          </div>
          <div style={{ color: "#3b82f6", fontSize: 13, marginTop: 2 }}>
            Try: Incline DB Press, Cable Fly
          </div>
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
            Back{" "}
            <span style={{ color: "#888", fontWeight: 400 }}>
              -- volume down last month
            </span>
          </div>
          <div style={{ color: "#3b82f6", fontSize: 13, marginTop: 2 }}>
            Try: Pull Ups, Seated Row
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplatesScreen() {
  const templates = [
    { name: "Push Day", ex: 4 },
    { name: "Pull Day", ex: 4 },
    { name: "Leg Day", ex: 5 },
    { name: "Upper / Lower Split", ex: 6 },
    { name: "Arm Day", ex: 3 },
  ];
  return (
    <div className="pf-app" style={SCREEN_ROOT}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
          Workout Templates
        </span>
        <span style={{ color: "#3b82f6", fontSize: 16 }}>Done</span>
      </div>
      {templates.map((t) => (
        <div
          key={t.name}
          style={{
            background: "#161616",
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#222",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            <span
              style={{
                display: "block",
                color: "#e5e5e5",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {t.name}
            </span>
            <span
              style={{
                display: "block",
                color: "#666",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {t.ex} exercises
            </span>
          </span>
          <span style={{ color: "#ef4444", fontSize: 13 }}>Delete</span>
        </div>
      ))}
    </div>
  );
}

export function MeasurementsScreen() {
  const history = [
    { w: 86.4, d: "Feb 28" },
    { w: 86.9, d: "Feb 21" },
    { w: 87.1, d: "Feb 14" },
    { w: 87.6, d: "Feb 7" },
    { w: 87.9, d: "Jan 31" },
    { w: 88.2, d: "Jan 24" },
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="pf-app" style={SCREEN_ROOT}>
      <div style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>
        Settings
      </div>
      <div style={CARD}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div style={LABEL}>Profile & Body Metrics</div>
          <span style={{ color: "#3b82f6", fontSize: 13, fontWeight: 700 }}>
            Update
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            <span style={{ display: "block", color: "#888", fontSize: 11 }}>
              Current
            </span>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
              86.4 kg
            </span>
          </span>
          <span style={{ textAlign: "center" }}>
            <span style={{ display: "block", color: "#888", fontSize: 11 }}>
              Goal
            </span>
            <span style={{ color: "#22c55e", fontSize: 20, fontWeight: 700 }}>
              83 kg
            </span>
          </span>
          <span style={{ textAlign: "right" }}>
            <span style={{ display: "block", color: "#888", fontSize: 11 }}>
              Height
            </span>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
              178cm
            </span>
          </span>
        </div>
        <div style={{ color: "#666", fontSize: 12 }}>
          16.2% BF | 27 yrs | Male | Moderately Active
        </div>
        <div
          style={{
            ...LABEL,
            marginTop: 14,
            marginBottom: 6,
          }}
        >
          Weight History
        </div>
        {history.map((h, i) => (
          <div
            key={h.d}
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 7,
              paddingBottom: 7,
              borderTopStyle: "solid",
              borderTopWidth: i > 0 ? 1 : 0,
              borderTopColor: "#222",
            }}
          >
            <span style={{ color: "#e5e5e5", fontSize: 14, fontWeight: 600 }}>
              {h.w} kg
            </span>
            <span style={{ color: "#888", fontSize: 12 }}>{h.d}</span>
          </div>
        ))}
      </div>
      <div style={CARD}>
        <div style={{ ...LABEL, marginBottom: 10 }}>Metrics Reminder</div>
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 10,
            padding: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#3b82f6",
          }}
        >
          <span style={{ color: "#e5e5e5", fontSize: 15, fontWeight: 600 }}>
            Reminder on
          </span>
          <span
            style={{
              width: 44,
              height: 26,
              borderRadius: 13,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 4px",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: "#fff",
              }}
            />
          </span>
        </div>
        <div
          style={{
            color: "#888",
            fontSize: 11,
            marginTop: 12,
            marginBottom: 6,
          }}
        >
          FREQUENCY
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["daily", "weekly"].map((f) => (
            <span
              key={f}
              style={{
                flex: 1,
                background: f === "weekly" ? "#3b82f6" : "#1a1a1a",
                borderRadius: 10,
                padding: 12,
                textAlign: "center",
                borderWidth: 1,

                borderStyle: "solid",
                borderColor: f === "weekly" ? "#3b82f6" : "#2a2a2a",
                color: f === "weekly" ? "#fff" : "#888",
                fontSize: 14,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {f}
            </span>
          ))}
        </div>
        <div
          style={{
            color: "#888",
            fontSize: 11,
            marginTop: 12,
            marginBottom: 6,
          }}
        >
          DAY
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {weekdays.map((label, i) => {
            const on = i === 1;
            return (
              <span
                key={label}
                style={{
                  flex: 1,
                  background: on ? "#3b82f6" : "#1a1a1a",
                  borderRadius: 8,
                  paddingTop: 8,
                  paddingBottom: 8,
                  textAlign: "center",
                  borderWidth: 1,

                  borderStyle: "solid",
                  borderColor: on ? "#3b82f6" : "#2a2a2a",
                  color: on ? "#fff" : "#888",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
            );
          })}
        </div>
        <div
          style={{
            color: "#888",
            fontSize: 11,
            marginTop: 12,
            marginBottom: 6,
          }}
        >
          TIME
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#1a1a1a",
              borderWidth: 1,

              borderStyle: "solid",
              borderColor: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            -
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
              flex: 1,
              textAlign: "center",
            }}
          >
            08
          </span>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#1a1a1a",
              borderWidth: 1,

              borderStyle: "solid",
              borderColor: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            +
          </div>
          <div style={{ width: 2, height: 26, background: "#222" }} />
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#1a1a1a",
              borderWidth: 1,

              borderStyle: "solid",
              borderColor: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            -
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
              flex: 1,
              textAlign: "center",
            }}
          >
            00
          </span>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#1a1a1a",
              borderWidth: 1,

              borderStyle: "solid",
              borderColor: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            +
          </div>
        </div>
      </div>
      <div style={CARD}>
        <div style={{ ...LABEL, marginBottom: 12 }}>Weight Unit</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["kg", "lbs"].map((u) => {
            const on = u === "kg";
            return (
              <span
                key={u}
                style={{
                  flex: 1,
                  background: on ? "#3b82f6" : "#1a1a1a",
                  borderRadius: 10,
                  padding: 14,
                  textAlign: "center",
                  borderWidth: 1,

                  borderStyle: "solid",
                  borderColor: on ? "#3b82f6" : "#2a2a2a",
                  color: on ? "#fff" : "#888",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {u.toUpperCase()}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const equipmentChip: React.CSSProperties = {
  background: "#252525",
  borderRadius: 6,
  padding: "4px 8px",
  color: "#aaa",
  fontSize: 11,
};

export function GymsScreen() {
  const gymEquip = ["Barbell", "Squat Rack", "Bench", "Dumbbells", "Cable"];
  const exercises = [
    {
      name: "Bench Press",
      sessions: 28,
      badge: "↑ 2.5%",
      badgeColor: "#22c55e",
    },
    { name: "Squat", sessions: 24, badge: "New PR", badgeColor: "#3b82f6" },
    { name: "Deadlift", sessions: 21, badge: "— 0.0%", badgeColor: "#666" },
    {
      name: "Incline DB Press",
      sessions: 19,
      badge: "↑ 1.1%",
      badgeColor: "#22c55e",
    },
    { name: "Pull Ups", sessions: 17, badge: "↑ 3.0%", badgeColor: "#22c55e" },
  ];
  return (
    <div className="pf-app" style={SCREEN_ROOT}>
      <div style={{ color: "#fff", fontSize: 28, fontWeight: 800 }}>
        Exercises
      </div>
      <div style={{ ...CARD, padding: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div style={LABEL}>My Gyms</div>
          <span style={{ color: "#3b82f6", fontSize: 14, fontWeight: 700 }}>
            + Add Gym
          </span>
        </div>
        <div
          style={{
            background: "#102a1a",
            borderRadius: 10,
            padding: 12,
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#22c55e",
          }}
        >
          <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 700 }}>
            ✓ At Powerhouse
          </div>
          <div style={{ color: "#7fae8f", fontSize: 12, marginTop: 2 }}>
            Showing exercises available at this gym.
          </div>
        </div>
        <div
          style={{
            marginTop: 8,
            background: "#1a1a1a",
            borderRadius: 10,
            padding: 12,
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#2a2a2a",
          }}
        >
          <div style={{ color: "#e5e5e5", fontSize: 14, fontWeight: 600 }}>
            Powerhouse <span style={{ color: "#22c55e" }}>●</span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 8,
            }}
          >
            {gymEquip.map((e) => (
              <span key={e} style={equipmentChip}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          background: "#161616",
          borderRadius: 10,
          padding: 12,
          borderWidth: 1,

          borderStyle: "solid",
          borderColor: "#2a2a2a",
          color: "#555",
          fontSize: 14,
        }}
      >
        Search exercises...
      </div>
      {exercises.map((ex) => (
        <div
          key={ex.name}
          style={{
            background: "#161616",
            borderRadius: 12,
            padding: 10,
            borderWidth: 1,

            borderStyle: "solid",
            borderColor: "#222",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 8,
              background: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            IMG
          </div>
          <span style={{ flex: 1 }}>
            <span
              style={{
                display: "block",
                color: "#e5e5e5",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {ex.name}
            </span>
            <span
              style={{
                display: "block",
                color: "#666",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {ex.sessions} sessions
            </span>
          </span>
          <span
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 3,
              paddingBottom: 3,
              borderRadius: 6,
              background: `${ex.badgeColor}22`,
              color: ex.badgeColor,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {ex.badge}
          </span>
        </div>
      ))}
    </div>
  );
}
