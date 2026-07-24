import LegalPage from "./LegalPage";

const SECTIONS = [
  {
    heading: "1. Who we are",
    body: "Trackora provides inventory and operations software for hardware stores. This policy explains what information we collect when you use our website and application, why we collect it, and the choices you have.",
  },
  {
    heading: "2. Information we collect",
    body: [
      "Account and contact details you give us — such as your name, email, phone number, business name and location — when you request an account, book a demo, or contact us.",
      "Business data you enter into the application, such as products, stock movements, sales, customers and staff accounts.",
      "Technical information collected automatically, such as your IP address, device and browser type, and basic usage logs used to keep the service secure and working.",
    ],
  },
  {
    heading: "3. How we use your information",
    body: [
      "To create and manage your account, provide the service, and keep your data available across your devices.",
      "To respond to enquiries, provide support, and help you set up and import your stock.",
      "To protect the service against abuse and to meet our legal obligations.",
    ],
  },
  {
    heading: "4. How we store and protect it",
    body: "Your data is stored on secure servers, not on the device in your shop. Connections are encrypted in transit, and backups run automatically so your information is not lost if a device is lost or stolen. We restrict access to your data to what is needed to run and support the service.",
  },
  {
    heading: "5. Sharing your information",
    body: "We do not sell your data. We share it only with service providers who help us run Trackora (such as hosting and infrastructure providers), and only as needed to provide the service, or where required by law.",
  },
  {
    heading: "6. Your choices and rights",
    body: "You can ask us to access, correct or delete your personal information, and you can close your account at any time. To make a request, contact us using the details below.",
  },
  {
    heading: "7. Data retention",
    body: "We keep your information for as long as your account is active and as needed to provide the service. If you close your account, we delete or anonymise your personal data within a reasonable period, except where we must keep it to meet legal obligations.",
  },
  {
    heading: "8. Changes to this policy",
    body: "We may update this policy from time to time. When we make material changes, we will update the date at the top of this page and, where appropriate, notify you in the application.",
  },
  {
    heading: "9. Contact us",
    body: "For any question about this policy or your data, email hello@trackora.app.",
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="23 July 2026"
      intro="Your business data is yours. This policy explains what we collect, how we use it, and how we keep it safe."
      sections={SECTIONS}
    />
  );
}
