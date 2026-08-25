import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocumentPage } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Fitnexx",
  description:
    "No account identifiers in core processing; anonymous training and body data via self-hosted LLM without retention; plus OCR, cookies, and your rights.",
};

const updated = "April 29, 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage title="Privacy Policy" lastUpdated={updated}>
      <p>
        This Privacy Policy explains how Fitnexx (&ldquo;we,&rdquo;
        &ldquo;us&rdquo;) handles personal information when
        you use our websites, apps, and related services (the
        &ldquo;Services&rdquo;). If you are in the European Economic Area (EEA),
        UK, or Switzerland, additional rights under the GDPR (or local
        equivalent) apply as described below.
      </p>

      <h2>1. Data we process</h2>
      <p>
        We do <strong className="text-foreground">not</strong> process
        persistent account identifiers (for example email-based account IDs) as
        part of core Fitnexx processing. Training and body measurement data you
        generate is sent for processing{" "}
        <strong className="text-foreground">anonymously</strong> through our{" "}
        <strong className="text-foreground">self-hosted LLM</strong>; we{" "}
        <strong className="text-foreground">do not retain</strong> those inputs
        or outputs after that processing completes, except where a separate,
        narrowly scoped technical log is strictly required for security or abuse
        prevention (and minimized). OCR and nutrition features follow the
        promises in product copy regarding images and model improvement.
      </p>

      <h2>2. Purposes and legal bases (including GDPR)</h2>
      <ul>
        <li>
          <strong className="text-foreground">Provide the Services</strong>:
          delivering features with the anonymous-by-design processing in section
          1, plus contract or pre-contract steps and, where applicable,
          legitimate interests in operating a secure fitness product.
        </li>
        <li>
          <strong className="text-foreground">Communicate with you</strong>:
          where you reach out (e.g. via the contact form), only what you submit
          for that message and replies as appropriate, separate from the
          anonymous training and body-measurement pipelines described above.
        </li>
        <li>
          <strong className="text-foreground">Improve OCR and models</strong>:
          only as described in-app; flows run through our own infrastructure and
          remain aligned with our promises, including no retained storage of
          anonymous training or body-measurement payloads described above.
        </li>
        <li>
          <strong className="text-foreground">Compliance and security</strong>:
          fraud prevention, logging, and legal obligations.
        </li>
        <li>
          <strong className="text-foreground">Non-essential cookies</strong>:
          where required, consent (see our{" "}
          <Link
            href="/cookie-policy"
            className="text-foreground underline underline-offset-4"
          >
            Cookie Policy
          </Link>
          ).
        </li>
      </ul>

      <h2>3. Retention</h2>
      <p>
        Anonymous LLM processing for training and body measurements is
        ephemeral. We do not retain those inputs or derived outputs for that
        purpose. Narrow security or legal logs, if any, follow minimization and
        shortest retention we can apply. You may still have rights regarding any
        voluntary contact data or cookies per sections above and our Cookie
        Policy.
      </p>

      <h2>4. International transfers</h2>
      <p>
        If we transfer data outside your country, we use appropriate safeguards
        (such as Standard Contractual Clauses) where required by law.
      </p>

      <h2>5. Sharing</h2>
      <p>
        We do not sell your personal information. Anonymous training and body
        measurement streams processed on our self-hosted LLM are not provided to
        third parties for their own model training. Where we use other
        infrastructure or service providers (&ldquo;processors&rdquo;) for
        disjoint services (e.g. hosting, billing, or support mail), they process
        under contractual terms. We may disclose information if required by law
        or to protect rights and safety.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Depending on your region, you may have rights to access, rectify, erase,
        restrict, port, object to processing, withdraw consent where processing
        is consent-based, and lodge a complaint with a supervisory authority.
      </p>

      <h2>7. Children</h2>
      <p>
        The Services are not directed at children under the age digital consent
        allows in their region; we do not knowingly collect personal information
        from children in violation of applicable law.
      </p>

      <h2>8. Updates</h2>
      <p>
        We may revise this Privacy Policy; material changes will be highlighted
        in-app or on this site where reasonable. Continued use after the
        effective date may constitute acknowledgment where permitted by law.
      </p>

      <h2>9. Contact</h2>
      <p>
        For privacy inquiries or GDPR requests:&nbsp;
        <Link
          href="/contact"
          className="text-foreground underline underline-offset-4"
        >
          Contact form
        </Link>
        . Include a reply address and jurisdiction so we can respond; that
        channel is separate from anonymous product processing above.
      </p>

      <p className="text-xs">
        Disclaimer: generic template aligned with Fitnexx marketing copy;
        finalize with counsel before launch regions.
      </p>
    </LegalDocumentPage>
  );
}
