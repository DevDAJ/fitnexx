import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Terms of Service | Fitnexx",
  description:
    "Terms governing use of Fitnexx: accounts, subscriptions, acceptable use, and disclaimers.",
};

const updated = "April 29, 2026";

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
        Fitnexx offers fitness logging, nutrition tools (including OCR where
        available), and optional premium features as described on our site and
        in-app. Features and limits (including free vs Pro) may change with
        notice where required.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide accurate registration information and safeguard your
        credentials. You are responsible for activity under your account.
      </p>

      <h2>3. Subscriptions and fees</h2>
      <p>
        Paid plans (e.g. Pro) are billed as shown at purchase in your app store
        or checkout flow. Prices on the marketing site are list prices in USD
        unless stated otherwise; taxes and currency conversion may apply.
        Subscriptions renew until cancelled per platform rules. Refunds follow
        the applicable store or payment provider policy.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>misuse, probe, or disrupt the Services or other users;</li>
        <li>upload malware or attempt unauthorized access;</li>
        <li>use the Services in violation of law or third-party rights; or</li>
        <li>
          reverse engineer or scrape the Services except as permitted by
          mandatory law.
        </li>
      </ul>

      <h2>5. Health and fitness disclaimer</h2>
      <p>
        Fitnexx is not medical advice. Consult a qualified professional before
        changing diet or exercise, especially if you have health conditions.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The Services, branding, and content are owned by Fitnexx or licensors.
        You receive a limited, revocable license to use the Services for
        personal, non-commercial use unless we agree otherwise in writing.
      </p>

      <h2>7. Warranty disclaimer</h2>
      <p>
        To the maximum extent permitted by law, the Services are provided
        &ldquo;as is&rdquo; without warranties of any kind, express or implied.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our aggregate liability arising
        out of the Services is limited to the greater of (a) amounts you paid us
        in the twelve months before the claim or (b) zero for free users, except
        where liability cannot be limited by law (e.g. certain jurisdictions).
      </p>

      <h2>9. Termination</h2>
      <p>
        We may suspend or terminate access for breach of these Terms or risk to
        the Services. You may stop using the Services at any time.
      </p>

      <h2>10. Governing law</h2>
      <p>
        Unless mandatory consumer law in your country says otherwise, these
        Terms are governed by the laws chosen for the operating entity, and
        courts in that jurisdiction have exclusive venue, subject to
        non-waivable rights you may have as a consumer.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms; continued use after notice may constitute
        acceptance where permitted.
      </p>

      <p className="text-xs">
        Disclaimer: template only; have counsel review for your entity and
        markets.
      </p>
    </LegalDocumentPage>
  );
}
