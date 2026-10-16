import type { Metadata } from "next";
import { DemoNotice, LegalSection, LegalShell } from "@/components/legal-shell";

export const metadata: Metadata = { title: "Imprint — Haribo Resseling" };

export default function ImpressumPage() {
  return (
    <LegalShell eyebrow="Legal" title="Imprint" updated="Last updated: January 2026">
      <DemoNotice />
      <LegalSection title="Information according to § 5 DDG">
        <p>Haribo Resseling (Demo Project)<br />Max Mustermann<br />Musterstraße 12<br />10115 Berlin, Germany</p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>Email: <a href="mailto:rankedgiyu@gmail.com" className="text-accent-glow underline-offset-4 transition-colors hover:text-white hover:underline">rankedgiyu@gmail.com</a><br />Support: 24/7 via Discord (access after purchase)</p>
      </LegalSection>
      <LegalSection title="Responsible for content">
        <p>Max Mustermann, address as above.</p>
      </LegalSection>
      <LegalSection title="Liability for content">
        <p>The contents of this website have been created with the greatest care. However, as part of this demo project, we cannot guarantee the accuracy, completeness or timeliness of the content.</p>
      </LegalSection>
    </LegalShell>
  );
}
