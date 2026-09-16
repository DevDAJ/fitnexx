import Image from "next/image";

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
      <Image
        aria-hidden="true"
        src="/assets/logo.png"
        alt=""
        width={large ? 38 : 31}
        height={large ? 38 : 31}
        style={{ objectFit: "contain" }}
      />
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
