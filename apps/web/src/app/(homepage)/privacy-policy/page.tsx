import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocumentPage } from "@/components/legal-document-page";
import { createMetadata } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How Fitnexx handles local fitness data, optional accounts, AI requests, subscriptions, cookies, and your privacy rights.",
  path: "/privacy-policy",
});

const updated = "September 8, 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage title="Privacy Policy" lastUpdated={updated}>
      <p>
        This Privacy Policy explains how Fitnexx (&ldquo;we,&rdquo;
        &ldquo;us&rdquo;) handles personal information when you use our
        websites, apps, and related services (the &ldquo;Services&rdquo;). If
        you are in the European Economic Area (EEA), UK, or Switzerland,
        additional rights under the GDPR (or local equivalent) apply as
        described below.
      </p>

      <h2>1. Data we process</h2>
      <p>
        Core workout, nutrition, body measurement, AI settings, and AI usage
        metadata are stored locally on your mobile device. Fitnexx does not
        receive that local data unless you use a feature that sends a request to
        an external service, such as an AI provider, or you contact us and
        include it in your message.
      </p>
      <p>
        Optional email and password authentication is provided through Supabase.
        Supabase processes your email address, account ID, and session data.
        Accounts are required only to use Pro features.
      </p>

      <h2>2. AI processing</h2>
      <p>
        If you use your own API key (&ldquo;BYOK&rdquo;), the key is kept in
        secure storage on your device and excluded from Fitnexx backups and
        sync. Request context is sent directly from your device to the provider
        you select: OpenAI, Anthropic, Google Gemini, OpenRouter, or an
        OpenAI-compatible endpoint you enter. The selected provider&apos;s terms
        and privacy policy apply. Fitnexx does not receive your BYOK keys,
        prompts, responses, or local usage ledger.
      </p>
      <p>
        If you use Pro, authenticated AI requests pass through the Fitnexx web
        service to the selected provider using Fitnexx-managed keys. Fitnexx
        application code does not store prompt or response content or maintain
        server-side AI usage records. Our infrastructure and the selected
        provider may process request data transiently and may create security or
        operational logs under their applicable policies.
      </p>

      <h2>3. Purposes and legal bases (including GDPR)</h2>
      <ul>
        <li>
          <strong className="text-foreground">Provide the Services</strong>:
          process account, session, AI request, and subscription information as
          needed to perform our contract with you and provide requested
          features.
        </li>
        <li>
          <strong className="text-foreground">Communicate with you</strong>:
          process the information you submit through our contact form so we can
          respond.
        </li>
        <li>
          <strong className="text-foreground">Compliance and security</strong>:
          rely on legal obligations or legitimate interests for fraud
          prevention, service protection, and required records.
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

      <h2>4. Sharing and service providers</h2>
      <p>
        We do not sell your personal information. Depending on the features you
        use, Supabase processes account and session data; the AI provider you
        select processes AI requests; RevenueCat processes subscription status
        and related purchase data; and Apple or Google processes app store
        subscriptions and payments. Hosting, security, and support providers may
        also process limited information on our behalf. We may disclose
        information if required by law or to protect rights and safety.
      </p>

      <h2>5. Retention</h2>
      <p>
        Data stored locally remains until you delete it or remove the app,
        subject to your device&apos;s backup and deletion behavior. BYOK keys
        are excluded from Fitnexx backups and sync. Account, session,
        subscription, contact, security, and legal records are retained only as
        needed for their purpose and applicable legal requirements. AI providers
        and other service providers apply their own retention practices to data
        they process.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Fitnexx and its service providers may process information outside your
        country. Where required by law, we use appropriate safeguards, such as
        Standard Contractual Clauses.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on your region, you may have rights to access, rectify, erase,
        restrict, port, object to processing, withdraw consent where processing
        is consent-based, and lodge a complaint with a supervisory authority.
      </p>

      <h2>8. Children</h2>
      <p>
        The Services are not directed at children under the age digital consent
        allows in their region; we do not knowingly collect personal information
        from children in violation of applicable law.
      </p>

      <h2>9. Updates</h2>
      <p>
        We may revise this Privacy Policy; material changes will be highlighted
        in-app or on this site where reasonable. Continued use after the
        effective date may constitute acknowledgment where permitted by law.
      </p>

      <h2>10. Contact</h2>
      <p>
        For privacy inquiries or GDPR requests:&nbsp;
        <Link
          href="/contact"
          className="text-foreground underline underline-offset-4"
        >
          Contact form
        </Link>
        . Include a reply address and jurisdiction so we can respond.
      </p>

      <p className="text-xs">
        Disclaimer: this template must be reviewed and finalized by counsel
        before launch.
      </p>
    </LegalDocumentPage>
  );
}
