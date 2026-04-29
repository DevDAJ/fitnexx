import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocumentPage } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Cookie Policy | Fitnexx",
  description:
    "How Fitnexx uses cookies and similar technologies, including EEA/UK consent requirements.",
};

const updated = "April 29, 2026";

export default function CookiePolicyPage() {
  return (
    <LegalDocumentPage title="Cookie Policy" lastUpdated={updated}>
      <p>
        This Cookie Policy explains how Fitnexx (&ldquo;we,&rdquo;
        &ldquo;us&rdquo;) uses cookies and similar technologies on our websites
        and services. It is designed to support compliance with the ePrivacy
        Directive / GDPR (EEA, UK) and similar rules when we target or serve
        users there. For how we process personal data more broadly, see our{" "}
        <Link
          href="/privacy-policy"
          className="text-foreground underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. We also use similar
        technologies (e.g. local storage, SDK identifiers in apps) for
        comparable purposes as described below.
      </p>

      <h2>2. How we use cookies</h2>
      <ul>
        <li>
          <strong className="text-foreground">Strictly necessary</strong>: to
          run the site (e.g. security, load balancing, session continuity,
          cookie-banner memories). These do not require consent under EU law
          where they are strictly necessary to provide a service you asked for.
        </li>
        <li>
          <strong className="text-foreground">Preferences</strong>: remember
          choices such as theme (light/dark) where offered.
        </li>
        <li>
          <strong className="text-foreground">Analytics</strong>: understand
          aggregate usage to improve the product (only if enabled and, where
          required, consented to).
        </li>
        <li>
          <strong className="text-foreground">Marketing</strong>: measure
          campaigns or remarketing (only if enabled and, where required,
          consented to).
        </li>
      </ul>

      <h2>3. EEA, UK, and Switzerland</h2>
      <p>
        For visitors from the EEA, UK, or Switzerland, we aim to obtain valid
        consent before setting non-essential cookies and similar technologies,
        except where an exemption applies. You can withdraw consent at any time
        via our cookie controls (where available) and your browser settings.
        Withdrawing consent does not affect the lawfulness of processing before
        withdrawal.
      </p>

      <h2>4. Third parties</h2>
      <p>
        Some cookies may be set by analytics or infrastructure partners acting
        on our instructions. Their use is governed by our agreements and their
        policies where applicable.
      </p>

      <h2>5. How to control cookies</h2>
      <p>
        Use our in-product or on-site preferences where provided. You can also
        block or delete cookies through your browser; strict blocking may affect
        site functionality.
      </p>

      <h2>6. Retention</h2>
      <p>
        Session cookies expire when you close the browser; persistent cookies
        last for the period shown in your browser or our cookie inventory when
        we publish one. We minimize retention compatible with each purpose.
      </p>

      <h2>7. Updates</h2>
      <p>
        We may revise this Cookie Policy when our practices change. Material
        changes will be communicated as appropriate (e.g. banner or notice).
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions:&nbsp;
        <Link
          href="/contact"
          className="text-foreground underline underline-offset-4"
        >
          Contact form
        </Link>
        .
      </p>

      <p className="text-xs">
        Disclaimer: template; finalize cookie inventory &amp; vendor list with
        counsel and your analytics tooling.
      </p>
    </LegalDocumentPage>
  );
}
