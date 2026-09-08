import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocumentPage } from "@/components/legal-document-page";
import { createMetadata } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Terms governing use of Fitnexx: accounts, subscriptions, acceptable use, and disclaimers.",
  path: "/terms-of-service",
});

const updated = "September 8, 2026";

export default function TermsOfServicePage() {
  return (
    <LegalDocumentPage title="Terms of Service" lastUpdated={updated}>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of Fitnexx websites, applications, and related services
        (&ldquo;Services&rdquo;) provided by Fitnexx. By using the Services, you
        agree to these Terms.
      </p>

      <h2>1. The Services</h2>
      <p>
        Fitnexx offers workout, nutrition, and body measurement tools, AI
        features, and optional Pro features. Core workout, nutrition, body
        measurement, AI settings, and AI usage metadata are stored locally on
        your mobile device. Features and limits may change with notice where
        required.
      </p>

      <h2>2. Accounts</h2>
      <p>
        An account is optional unless you use Pro. Email and password accounts
        are provided through Supabase. You must provide accurate registration
        information, safeguard your credentials, and remain responsible for
        activity under your account.
      </p>

      <h2>3. Subscriptions and fees</h2>
      <p>
        Pro costs $3.99 per month, subject to taxes and currency conversion. The
        subscription automatically renews unless you cancel it through the Apple
        App Store or Google Play before renewal. RevenueCat and the applicable
        app store process subscription and payment data. Refunds follow the
        applicable store&apos;s rules.
      </p>
      <p>
        &ldquo;Unlimited&rdquo; means Pro has no per-scan credit allowance. Use
        remains subject to fair use, technical and model limits, service
        availability, and these acceptable-use rules.
      </p>

      <h2>4. AI services and BYOK</h2>
      <p>
        With BYOK, request context goes directly from your device to OpenAI,
        Anthropic, Google Gemini, OpenRouter, or an OpenAI-compatible endpoint
        you enter. Your key stays in secure device storage and is excluded from
        Fitnexx backups and sync. The selected provider&apos;s terms and privacy
        policy apply. Fitnexx does not receive BYOK prompts, responses, keys, or
        your local usage ledger.
      </p>
      <p>
        Pro AI requests are authenticated and pass through the Fitnexx web
        service to your selected provider using Fitnexx-managed keys. Fitnexx
        application code does not store prompt or response content or maintain
        server-side AI usage records. Infrastructure and providers may process
        requests transiently and create security or operational logs.
      </p>
      <p>
        You are responsible for the content you submit, your selected provider
        and endpoint, your right to submit that content, and your use of AI
        output. AI output may be inaccurate or incomplete and must not replace
        professional medical advice. You must comply with the selected
        provider&apos;s terms and applicable law.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>misuse, probe, or disrupt the Services or other users;</li>
        <li>upload malware or attempt unauthorized access;</li>
        <li>
          use AI features to generate, submit, or distribute illegal, harmful,
          abusive, deceptive, or rights-infringing content;
        </li>
        <li>evade fair-use, model, technical, or access limits;</li>
        <li>use the Services in violation of law or third-party rights;</li>
        <li>
          reverse engineer or scrape the Services except as permitted by
          mandatory law.
        </li>
      </ul>

      <h2>6. Health and fitness disclaimer</h2>
      <p>
        Fitnexx is not medical advice. Consult a qualified professional before
        changing diet or exercise, especially if you have health conditions.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The Services, branding, and content are owned by Fitnexx or licensors.
        You receive a limited, revocable license to use the Services for
        personal, non-commercial use unless we agree otherwise in writing.
      </p>

      <h2>8. Warranty disclaimer</h2>
      <p>
        To the maximum extent permitted by law, the Services are provided
        &ldquo;as is&rdquo; without warranties of any kind, express or implied.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our aggregate liability arising
        out of the Services is limited to the greater of (a) amounts you paid us
        in the twelve months before the claim or (b) zero for free users, except
        where liability cannot be limited by law (e.g. certain jurisdictions).
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or terminate access for breach of these Terms or risk to
        the Services. You may stop using the Services at any time.
      </p>

      <h2>11. Governing law</h2>
      <p>
        Unless mandatory consumer law in your country says otherwise, these
        Terms are governed by the laws chosen for the operating entity, and
        courts in that jurisdiction have exclusive venue, subject to
        non-waivable rights you may have as a consumer.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms; continued use after notice may constitute
        acceptance where permitted.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms:&nbsp;
        <Link
          href="/contact"
          className="text-foreground underline underline-offset-4"
        >
          Contact form
        </Link>
        .
      </p>

      <p className="text-xs">
        Disclaimer: this template must be reviewed and finalized by counsel
        before launch.
      </p>
    </LegalDocumentPage>
  );
}
