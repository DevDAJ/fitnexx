import Link from "next/link";
import type { ReactNode } from "react";

interface LegalPage {
  title: string;
  lastUpdated: string;
  descriptionMetadata: string;
  descriptionContent: ReactNode;
  pointsOfInterest: {
    title: string;
    content: ReactNode;
  }[];
}

export const legalPages: Record<string, LegalPage> = {
  "privacy-policy": {
    title: "Privacy Policy",
    lastUpdated: "April 29, 2026",
    descriptionMetadata: "Privacy policy for Fitnexx",
    descriptionContent: (
      <p>
        This Privacy Policy explains how Fitnexx (&ldquo;we,&rdquo;
        &ldquo;us&rdquo;) handles personal information when you use our
        websites, apps, and related services (the &ldquo;Services&rdquo;). If
        you are in the European Economic Area (EEA), UK, or Switzerland,
        additional rights under the GDPR (or local equivalent) apply as
        described below.
      </p>
    ),
    pointsOfInterest: [
      {
        title: "Data we process",
        content: (
          <p>
            We do <strong className="text-foreground">not</strong> process
            persistent account identifiers (for example email-based account IDs)
            as part of core Fitnexx processing. Training and body measurement
            data you generate is sent for processing{" "}
            <strong className="text-foreground">anonymously</strong> through our{" "}
            <strong className="text-foreground">self-hosted LLM</strong>; we{" "}
            <strong className="text-foreground">do not retain</strong> those
            inputs or outputs after that processing completes, except where a
            separate, narrowly scoped technical log is strictly required for
            security or abuse prevention (and minimized). OCR and nutrition
            features follow the promises in product copy regarding images and
            model improvement.
          </p>
        ),
      },
      {
        title: "Purposes and legal bases (including GDPR)",
        content: (
          <ul>
            <li>
              <strong className="text-foreground">Provide the Services</strong>:
              delivering features with the anonymous-by-design processing
              described above, plus contract or pre-contract steps and, where
              applicable, legitimate interests in operating a secure fitness
              product.
            </li>
            <li>
              <strong className="text-foreground">Communicate with you</strong>:
              where you reach out (e.g. via the contact form), only what you
              submit for that message and replies as appropriate, separate from
              the anonymous training and body-measurement pipelines described
              above.
            </li>
            <li>
              <strong className="text-foreground">
                Improve OCR and models
              </strong>
              : only as described in-app; flows run through our own
              infrastructure and remain aligned with our promises, including no
              retained storage of anonymous training or body-measurement
              payloads described above.
            </li>
            <li>
              <strong className="text-foreground">
                Compliance and security
              </strong>
              : fraud prevention, logging, and legal obligations.
            </li>
            <li>
              <strong className="text-foreground">Non-essential cookies</strong>
              : where required, consent (see our{" "}
              <Link
                href="/cookie-policy"
                className="text-foreground underline underline-offset-4"
              >
                Cookie Policy
              </Link>
              ).
            </li>
          </ul>
        ),
      },
      {
        title: "Retention",
        content: (
          <p>
            Anonymous LLM processing for training and body measurements is
            ephemeral. We do not retain those inputs or derived outputs for that
            purpose. Narrow security or legal logs, if any, follow minimization
            and shortest retention we can apply. You may still have rights
            regarding any voluntary contact data or cookies per sections above
            and our Cookie Policy.
          </p>
        ),
      },
      {
        title: "International transfers",
        content: (
          <p>
            If we transfer data outside your country, we use appropriate
            safeguards (such as Standard Contractual Clauses) where required by
            law.
          </p>
        ),
      },
      {
        title: "Sharing",
        content: (
          <p>
            We do not sell your personal information. Anonymous training and
            body measurement streams processed on our self-hosted LLM are not
            provided to third parties for their own model training. Where we use
            other infrastructure or service providers (&ldquo;processors&rdquo;)
            for disjoint services (e.g. hosting, billing, or support mail), they
            process under contractual terms. We may disclose information if
            required by law or to protect rights and safety.
          </p>
        ),
      },
      {
        title: "Your rights",
        content: (
          <p>
            Depending on your region, you may have rights to access, rectify,
            erase, restrict, port, object to processing, withdraw consent where
            processing is consent-based, and lodge a complaint with a
            supervisory authority.
          </p>
        ),
      },
      {
        title: "Children",
        content: (
          <p>
            The Services are not directed at children under the age digital
            consent allows in their region; we do not knowingly collect personal
            information from children in violation of applicable law.
          </p>
        ),
      },
      {
        title: "Updates",
        content: (
          <p>
            We may revise this Privacy Policy; material changes will be
            highlighted in-app or on this site where reasonable. Continued use
            after the effective date may constitute acknowledgment where
            permitted by law.
          </p>
        ),
      },
      {
        title: "Contact",
        content: (
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
        ),
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    lastUpdated: "April 29, 2026",
    descriptionMetadata: "Cookie policy for Fitnexx",
    descriptionContent: (
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
    ),
    pointsOfInterest: [
      {
        title: "What are cookies?",
        content: (
          <p>
            Cookies are small text files stored on your device. We also use
            similar technologies (e.g. local storage, SDK identifiers in apps)
            for comparable purposes as described below.
          </p>
        ),
      },
      {
        title: "How we use cookies",
        content: (
          <ul>
            <li>
              <strong className="text-foreground">Strictly necessary</strong>:
              to run the site (e.g. security, load balancing, session
              continuity, cookie-banner memories). These do not require consent
              under EU law where they are strictly necessary to provide a
              service you asked for.
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
        ),
      },
      {
        title: "EEA, UK, and Switzerland",
        content:
          "For visitors from the EEA, UK, or Switzerland, we aim to obtain valid consent before setting non-essential cookies and similar technologies, except where an exemption applies. You can withdraw consent at any time via our cookie controls (where available) and your browser settings. Withdrawing consent does not affect the lawfulness of processing before withdrawal.",
      },
      {
        title: "Third parties",
        content: (
          <p>
            Some cookies may be set by analytics or infrastructure partners
            acting on our instructions. Their use is governed by our agreements
            and their policies where applicable.
          </p>
        ),
      },
      {
        title: "How to control cookies",
        content: (
          <p>
            Use our in-product or on-site preferences where provided. You can
            also block or delete cookies through your browser; strict blocking
            may affect site functionality.
          </p>
        ),
      },
      {
        title: "Retention",
        content: (
          <p>
            Session cookies expire when you close the browser; persistent
            cookies last for the period shown in your browser or our cookie
            inventory when we publish one. We minimize retention compatible with
            each purpose.
          </p>
        ),
      },
      {
        title: "Updates",
        content: (
          <p>
            We may revise this Cookie Policy when our practices change. Material
            changes will be communicated as appropriate (e.g. banner or notice).
          </p>
        ),
      },
      {
        title: "Contact",
        content: (
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
        ),
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    lastUpdated: "April 29, 2026",
    descriptionMetadata:
      "Terms governing use of Fitnexx: accounts, subscriptions, acceptable use, and disclaimers.",
    descriptionContent: (
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of Fitnexx websites, applications, and related services
        (&ldquo;Services&rdquo;) provided by Fitnexx. By using the Services, you
        agree to these Terms.
      </p>
    ),
    pointsOfInterest: [
      {
        title: "The Services",
        content: (
          <p>
            Fitnexx offers fitness logging, nutrition tools (including OCR where
            available), and optional premium features as described on our site
            and in-app. Features and limits (including free vs Pro) may change
            with notice where required.
          </p>
        ),
      },
      {
        title: "Accounts",
        content: (
          <p>
            You must provide accurate registration information and safeguard
            your credentials. You are responsible for activity under your
            account.
          </p>
        ),
      },
      {
        title: "Subscriptions and fees",
        content: (
          <p>
            Paid plans (e.g. Pro) are billed as shown at purchase in your app
            store or checkout flow. Prices on the marketing site are list prices
            in USD unless stated otherwise; taxes and currency conversion may
            apply. Subscriptions renew until cancelled per platform rules.
            Refunds follow the applicable store or payment provider policy.
          </p>
        ),
      },
      {
        title: "Acceptable use",
        content: (
          <p>
            You agree not to: misuse, probe, or disrupt the Services or other
            users; upload malware or attempt unauthorized access; use the
            Services in violation of law or third-party rights; or reverse
            engineer or scrape the Services except as permitted by mandatory
            law.
          </p>
        ),
      },
      {
        title: "Health and fitness disclaimer",
        content: (
          <p>
            Fitnexx is not medical advice. Consult a qualified professional
            before changing diet or exercise, especially if you have health
            conditions.
          </p>
        ),
      },
      {
        title: "Intellectual property",
        content: (
          <p>
            The Services, branding, and content are owned by Fitnexx or
            licensors. You receive a limited, revocable license to use the
            Services for personal, non-commercial use unless we agree otherwise
            in writing.
          </p>
        ),
      },
      {
        title: "Warranty disclaimer",
        content: (
          <p>
            To the maximum extent permitted by law, the Services are provided
            &ldquo;as is&rdquo; without warranties of any kind, express or
            implied.
          </p>
        ),
      },
      {
        title: "Limitation of liability",
        content: (
          <p>
            To the maximum extent permitted by law, our aggregate liability
            arising out of the Services is limited to the greater of (a) amounts
            you paid us in the twelve months before the claim or (b) zero for
            free users, except where liability cannot be limited by law (e.g.
            certain jurisdictions).
          </p>
        ),
      },
      {
        title: "Termination",
        content: (
          <p>
            We may suspend or terminate access for breach of these Terms or risk
            to the Services. You may stop using the Services at any time.
          </p>
        ),
      },
      {
        title: "Governing law",
        content: (
          <p>
            Unless mandatory consumer law in your country says otherwise, these
            Terms are governed by the laws chosen for the operating entity, and
            courts in that jurisdiction have exclusive venue, subject to
            non-waivable rights you may have as a consumer.
          </p>
        ),
      },
      {
        title: "Changes",
        content: (
          <p>
            We may update these Terms; continued use after notice may constitute
            acceptance where permitted.
          </p>
        ),
      },
    ],
  },
};
