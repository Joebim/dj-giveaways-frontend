import React from "react";
import LegalPageTemplate from "./LegalPageTemplate";
import type { LegalPageContent } from "../../types";

const defaultContent: LegalPageContent = {
  slug: "acceptable-use",
  title: "Acceptable Use Policy",
  subtitle:
    "This Acceptable Use Policy sets out the terms between you and DJ Giveaways under which you may access our website and services. It applies to all users and visitors.",
  sections: [
    {
      heading: "Overview",
      body: [
        "You must comply with both the letter and the spirit of this policy. This policy supplements our Terms & Conditions and Terms of Use and is not exhaustive.",
        "We reserve the right to remove any content or suspend access if we suspect that you have breached any part of this policy.",
      ],
    },
    {
      heading: "Prohibited Content",
      body: [
        "You must not upload, post, or share any content that is defamatory, obscene, hateful, discriminatory, or otherwise objectionable.",
        "Content that infringes another person's intellectual property rights or breaches confidentiality is strictly forbidden.",
      ],
    },
    {
      heading: "Fair Participation",
      body: [
        "Entries must be made in good faith. Automated bots, scripts, or coordinated entry schemes that manipulate the outcome of a competition are prohibited.",
        "Multiple accounts created to circumvent ticket limits or entry restrictions will be closed, and any related entries disqualified.",
      ],
    },
    {
      heading: "Reporting Concerns",
      body: [
        "Please contact us immediately if you believe a user is acting in breach of this Acceptable Use Policy.",
        "We will investigate all reports and take appropriate action which may include suspension, account removal, or escalation to law enforcement.",
      ],
    },
  ],
};

const AcceptableUse: React.FC = () => (
  <LegalPageTemplate slug="acceptable-use" defaultContent={defaultContent} />
);

export default AcceptableUse;


