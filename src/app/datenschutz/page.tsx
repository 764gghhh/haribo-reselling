import type { Metadata } from "next";
import { DemoNotice, LegalSection, LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = { title: "Privacy Policy — Haribo Resseling" };

export default function DatenschutzPage() {
  return (
    <LegalShell eyebrow="Legal" title="Privacy Policy" updated="Last updated: January 2026">
      <DemoNotice />
      <LegalSection title="1. Controller">
        <p>Responsible for data processing on this website is Haribo Resseling (Demo Project), Musterstraße 12, 10115 Berlin — reachable at <a href="mailto:rankedgiyu@gmail.com" className="text-accent-glow underline-offset-4 transition-colors hover:text-white hover:underline">rankedgiyu@gmail.com</a>.</p>
      </LegalSection>
      <LegalSection title="2. Data we process">
        <p className="mb-3">When placing an order, we only process data you actively provide:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Discord username (for delivery and support)</li>
          <li>Selected products and plans</li>
          <li>Payment method and payment reference (transaction hash or code)</li>
          <li>Time of order</li>
        </ul>
        <p className="mt-3">No third-party tracking or analytics cookies are used.</p>
      </LegalSection>
      <LegalSection title="3. Purpose and legal basis">
        <p>Processing is carried out for contract fulfillment (Art. 6(1)(b) GDPR), i.e. to process your order, deliver your products and handle support requests.</p>
      </LegalSection>
      <LegalSection title="4. Your rights">
        <p>You have the right to access, rectification, deletion, restriction, portability, and objection at any time. Contact us at <a href="mailto:rankedgiyu@gmail.com" className="text-accent-glow underline-offset-4 transition-colors hover:text-white hover:underline">rankedgiyu@gmail.com</a>.</p>
      </LegalSection>
    </LegalShell>
  );
}
