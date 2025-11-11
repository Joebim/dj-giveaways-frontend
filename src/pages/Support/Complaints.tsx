import React from "react";
import LegalPageTemplate from "../Legal/LegalPageTemplate";
import type { LegalPageContent } from "../../types";

const defaultContent: LegalPageContent = {
  slug: "complaints-procedure",
  title: "Complaints Procedure",
  subtitle:
    "We aim to deliver a premium experience for every entrant. If something goes wrong, please follow the steps below so we can resolve your issue quickly and fairly.",
  sections: [
    {
      heading: "How to Raise a Complaint",
      body: [
        "Email complaints@mckinneycompetitions.com with your full name, contact details, order number (if applicable), and a clear description of your concern.",
        "We acknowledge all complaints within two working days and aim to provide a full response within ten working days.",
      ],
    },
    {
      heading: "Investigation Process",
      body: [
        "A dedicated member of our compliance team will review your case, gather evidence, and contact you for any additional information required.",
        "We strive to resolve complaints at the first point of contact. If you are not satisfied, you may request escalation to a senior manager.",
      ],
    },
    {
      heading: "Independent Adjudication",
      body: [
        "If, after our internal review, you remain dissatisfied, you may refer the case to an independent Alternative Dispute Resolution (ADR) provider within 45 days of our final response.",
        "Details of the ADR provider will be supplied in our final communication. We fully cooperate with external adjudicators and abide by their decisions.",
      ],
    },
    {
      heading: "Keeping Records",
      body: [
        "Please retain copies of all correspondence, receipts, and screenshots relating to your complaint. This helps us investigate efficiently.",
        "We use complaint data to improve our services and ensure competitions remain transparent, secure, and enjoyable for everyone.",
      ],
    },
  ],
};

const Complaints: React.FC = () => (
  <LegalPageTemplate slug="complaints-procedure" defaultContent={defaultContent} />
);

export default Complaints;


