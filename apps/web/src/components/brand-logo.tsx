type BrandLogoProps = {
  size?: "sm" | "md";
};

export function BrandLogo({ size = "sm" }: BrandLogoProps) {
  const large = size === "md";

  return (
    <span
      role="img"
      aria-label="Fitnexx"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: large ? 11 : 8,
        lineHeight: 1,
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        width={large ? 38 : 31}
        height={large ? 38 : 31}
        fill="none"
      >
        <path
          d="M5.5 10.5 18 13.2l-7.4 8.3Z"
          fill="#172a48"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m31.5 27.5 11 11.8-8.4-2.7-8.2-7.4Z"
          fill="#172a48"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="28.3" cy="8.5" r="4.2" fill="#60a5fa" />
        <path
          d="M25.4 14.1c-4.2 3.3-6.2 7.1-4.3 10.5 1.7 3 7.4 3.2 9.6 6.2 1.1 1.6.8 3.5-.8 5.8"
          stroke="#f4f7fb"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m22.2 17.3-7.5-3.1-6.2 5.1M28.1 16.6l6 5.3 6.6-5.7"
          stroke="#60a5fa"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m23.1 26.5-5.7 7.3-8.7 8M27 28.6l7.7 6.3 6 7"
          stroke="#f4f7fb"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          fontSize: large ? 23 : 18,
          fontWeight: 850,
          letterSpacing: large ? "-1.2px" : "-0.9px",
        }}
      >
        <span style={{ color: "#f4f7fb" }}>Fit</span>
        <span style={{ color: "#60a5fa" }}>nexx</span>
      </span>
    </span>
  );
}
