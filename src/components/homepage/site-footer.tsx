import Link from "next/link";

const primaryLinks = [
  { href: "/mission", label: "Mission & vision" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <nav
          aria-label="Contact and policies"
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 sm:justify-start"
        >
          {primaryLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-muted-foreground text-center text-xs sm:text-start">
          © {new Date().getFullYear()} Fitnexx. Built with privacy in
          mind.
        </p>
      </div>
    </footer>
  );
}
