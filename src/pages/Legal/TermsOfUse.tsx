import React from "react";
import LegalPageTemplate from "./LegalPageTemplate";
import type { LegalPageContent } from "../../types";

const defaultContent: LegalPageContent = {
  slug: "terms-of-use",
  title: "Website Terms of Use",
  subtitle:
    "These terms explain how you may use the DJ Giveaways website, apps, and associated services. By accessing our platforms you confirm that you accept these terms and agree to comply with them.",
  sections: [
    {
      heading: "Using Our Website",
      body: [
        "The content on this website is provided for general information only. We make reasonable efforts to update the information, but we make no representations, warranties or guarantees that the content is accurate, complete or up to date.",
        "You may download and print content for personal, non-commercial use, provided that you do not alter any copyright or proprietary notices.",
      ],
    },
    {
      heading: "Account Security",
      body: [
        "If you choose or are provided with a login, password, or any other piece of security information, you must treat such information as confidential.",
        "You are responsible for all activities that occur under your account. Please notify us immediately if you suspect unauthorised use of your account.",
      ],
    },
    {
      heading: "Prohibited Activities",
      body: [
        "You must not misuse our website by knowingly introducing viruses, trojans, worms, logic bombs or other material that is malicious or technologically harmful.",
        "You must not attempt to gain unauthorised access to the website, the server on which the website is stored or any server, computer or database connected to the website.",
      ],
      list: {
        title: "You also agree not to:",
        items: [
          "Use automated scripts to collect information from or otherwise interact with the website.",
          "Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.",
          "Engage in any activity that interferes with or disrupts the website or the servers and networks connected to the website.",
        ],
      },
    },
    {
      heading: "Changes to These Terms",
      body: [
        "We may update our Terms of Use from time to time. All changes are effective immediately when we post them and apply to all access to and use of the website thereafter.",
        "By continuing to use the website after changes are posted, you accept and agree to the modifications.",
      ],
    },
  ],
};

const TermsOfUse: React.FC = () => (
  <LegalPageTemplate slug="terms-of-use" defaultContent={defaultContent} />
);

export default TermsOfUse;


