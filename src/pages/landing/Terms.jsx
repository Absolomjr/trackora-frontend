import LegalPage from "./LegalPage";

const SECTIONS = [
  {
    heading: "1. Agreement to these terms",
    body: "By creating an account or using Trackora, you agree to these terms. If you are using Trackora on behalf of a business, you confirm you are authorised to accept these terms for that business.",
  },
  {
    heading: "2. The service",
    body: "Trackora provides web-based inventory and operations software, including product and stock management, sales and orders, reporting, and role-based user accounts. We may add, change or remove features to improve the service.",
  },
  {
    heading: "3. Accounts and access",
    body: [
      "You are responsible for the accounts you create, including keeping login details secure and setting appropriate roles for your staff.",
      "You are responsible for activity that happens under your accounts. Tell us promptly if you believe an account has been used without authorisation.",
    ],
  },
  {
    heading: "4. Acceptable use",
    body: "You agree not to misuse the service — including attempting to disrupt it, access data that is not yours, or use it to break the law. We may suspend access where use threatens the security or integrity of the service.",
  },
  {
    heading: "5. Your data",
    body: "You keep ownership of the business data you enter into Trackora. You grant us the permissions needed to host and process that data to provide the service. Our handling of personal information is described in our Privacy Policy.",
  },
  {
    heading: "6. Fees",
    body: "Paid plans are billed as agreed when you sign up. Fees are described at the point of purchase or in your quote. Where a free period is offered, we will make clear when it ends.",
  },
  {
    heading: "7. Availability",
    body: "We work to keep Trackora available and reliable, but we do not guarantee uninterrupted service. Maintenance, updates or events outside our control may cause temporary interruptions.",
  },
  {
    heading: "8. Liability",
    body: "The service is provided on a reasonable-efforts basis. To the extent permitted by law, we are not liable for indirect or consequential losses. Nothing in these terms limits liability that cannot be limited by law.",
  },
  {
    heading: "9. Ending the agreement",
    body: "You can stop using Trackora and close your account at any time. We may suspend or end access where these terms are broken. On termination, you may request an export of your data within a reasonable period.",
  },
  {
    heading: "10. Changes and contact",
    body: "We may update these terms from time to time; the date at the top shows when. For questions about these terms, email hello@trackora.app.",
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="23 July 2026"
      intro="These terms set out the agreement between you and Trackora when you use our website and application."
      sections={SECTIONS}
    />
  );
}
