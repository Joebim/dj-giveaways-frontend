import React from "react";
import LegalPageTemplate from "./LegalPageTemplate";
import type { LegalPageContent } from "../../types";

const defaultContent: LegalPageContent = {
  slug: "terms-and-conditions",
  title: "Terms & Conditions",
  subtitle:
    "Please read these terms carefully before participating in any DJ Giveaways promotions. By using our website, entering competitions, or purchasing tickets, you agree to abide by the following conditions.",
  sections: [
    {
      heading: "Eligibility",
      body: [
        "DJ Giveaways is open to residents of the United Kingdom and Ireland who are aged 18 years or older at the time of entry.",
        "We reserve the right to request proof of age and eligibility at any point. Failure to provide satisfactory evidence will result in disqualification and forfeiture of prizes.",
      ],
      list: {
        title: "Ineligible participants include:",
        items: [
          "Employees of DJ Giveaways or any affiliated companies.",
          "Immediate family members of employees or contractors.",
          "Professional competition or raffle entrants acting on behalf of another person.",
        ],
      },
    },
    {
      heading: "Competition Entries",
      body: [
        "Each competition specifies the total number of tickets available and the entry price per ticket. Entries are accepted on a first-come, first-served basis.",
        "Entrants must provide accurate contact information to receive confirmation emails, order receipts, and winner notifications.",
        "In the event of a competition cancellation (e.g., due to insufficient entries), all participants will receive a full refund using the original payment method.",
      ],
    },
    {
      heading: "Winner Selection & Notification",
      body: [
        "Draws are conducted using verified random selection tools. The winning ticket number is matched against our database to identify the entrant.",
        "Winners will be notified via email and/or phone. If we are unable to reach a winner within 14 days, the prize may be redrawn or substituted at our discretion.",
        "Prizes are non-transferable unless explicitly stated. Cash alternatives may be offered for certain competitions as detailed in the prize description.",
      ],
    },
    {
      heading: "Liability & Responsibilities",
      body: [
        "DJ Giveaways is not liable for entries that are lost, delayed, misdirected, or fail due to technical issues outside of our control.",
        "By entering our competitions, you accept that images, names, and testimonials of winners may be used for marketing purposes, both online and offline.",
        "These terms are governed by the laws of Northern Ireland. Any disputes shall be subject to the exclusive jurisdiction of the Northern Irish courts.",
      ],
    },
  ],
};

const TermsAndConditions: React.FC = () => (
  <LegalPageTemplate slug="terms-and-conditions" defaultContent={defaultContent} />
);

export default TermsAndConditions;


