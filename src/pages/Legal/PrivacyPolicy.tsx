import React from "react";
import LegalPageTemplate from "./LegalPageTemplate";
import type { LegalPageContent } from "../../types";

const defaultContent: LegalPageContent = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  subtitle:
    "We take your privacy seriously. This policy explains how DJ Giveaways collects, uses, stores, and protects your personal data when you interact with us.",
  sections: [
    {
      heading: "Information We Collect",
      body: [
        "Contact details such as your name, email address, postal address, and phone number when you register or enter a competition.",
        "Payment information processed securely through our payment providers (we do not store full card details).",
        "Technical data including IP address, browser type, device information, and cookies for analytics and security.",
      ],
    },
    {
      heading: "How We Use Your Data",
      body: [
        "To manage your competition entries, process payments, and deliver prizes.",
        "To send transactional emails, service notifications, and—if opted in—marketing communications about upcoming competitions.",
        "To comply with legal obligations, prevent fraud, and maintain the integrity of our competitions.",
      ],
    },
    {
      heading: "Data Retention & Security",
      body: [
        "We retain personal data only for as long as necessary to fulfil the purposes we collected it for, including any legal, accounting, or reporting requirements.",
        "We employ appropriate technical and organisational measures to safeguard your data against loss, misuse, and unauthorised access.",
      ],
    },
    {
      heading: "Your Rights",
      body: [
        "You have the right to access, rectify, or erase your personal data, and to restrict or object to certain processing activities.",
        "You can withdraw consent for marketing communications at any time by updating your preferences or contacting our support team.",
        "If you are unhappy with how we handle your data, you may lodge a complaint with the Information Commissioner's Office (ICO) or your local supervisory authority.",
      ],
    },
    {
      heading: "Contacting Us",
      body: [
        "For privacy-related enquiries, email privacy@mckinneycompetitions.com or write to us at Unit 6, Hamilton Business Park, 132 Tamnamore Road, BT716HW.",
      ],
    },
  ],
};

const PrivacyPolicy: React.FC = () => (
  <LegalPageTemplate slug="privacy-policy" defaultContent={defaultContent} />
);

export default PrivacyPolicy;


