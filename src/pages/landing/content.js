/**
 * All landing-page copy lives here as data so the section components stay
 * presentational. Text is sourced from docs/landing-page-design.md.
 */
import {
  LuBoxes,
  LuReceipt,
  LuChartColumnBig,
  LuShieldCheck,
  LuTriangleAlert,
  LuNotebookPen,
  LuClock,
  LuEyeOff,
  LuUserX,
  LuMapPinOff,
} from "react-icons/lu";

export const HERO = {
  eyebrow: "Inventory simplified. Profits maximized.",
  headlineLead: "Modern inventory for modern ",
  headlineAccent: "hardware stores.",
  subheadline:
    "Trackora helps hardware retailers track stock, sales and purchases in real time — so you can stop guessing and start growing.",
  bullets: [
    { title: "Real-time stock visibility", text: "" },
    { title: "Reduce stockouts and overstock", text: "" },
    { title: "Stronger margins, happier customers", text: "" },
  ],
  ctaSupport: "",
};

export const TRUST_ITEMS = [
  "Works on any phone or laptop",
  "Automatic backups",
  "Set up in a day",
  "Support in English & Luganda",
];

export const PROBLEM = {
  label: "The daily reality",
  headline: "Running a hardware store on paper costs you more than you think.",
  subheadline:
    "Stores rarely lose money in one big event. They lose it in small, daily leaks.",
  items: [
    { icon: LuTriangleAlert, title: "You find out you're out of stock when the customer does.", text: "The sale walks out the door and buys from the shop next door." },
    { icon: LuNotebookPen, title: "The counter book never matches the shelf.", text: "Somebody wrote it down wrong, or didn't write it down at all." },
    { icon: LuClock, title: "Stock-taking closes the shop.", text: "A full count takes a day, and by morning it's already out of date." },
    { icon: LuEyeOff, title: "You can't tell which items actually make money.", text: "Fast-moving isn't the same as profitable, and the book won't tell you which is which." },
    { icon: LuUserX, title: "Nobody is accountable.", text: "When stock goes missing, there's no record of who moved it or when." },
    { icon: LuMapPinOff, title: "You can't check the shop unless you're in the shop.", text: "Travel for a day and you're working blind." },
  ],
};

export const SOLUTION = {
  label: "How Trackora fixes it",
  headline: "Every leak, closed — in one system your whole team can use.",
  subheadline:
    "Each feature removes one specific problem from your day.",
  items: [
    { feature: "Real-time stock levels", outcome: "No more guessing what's in the back room. The number on screen is the number on the shelf." },
    { feature: "Automatic low-stock alerts", outcome: "Reorder before you run out, instead of after a customer has already left." },
    { feature: "Every sale updates stock instantly", outcome: "The counter book and the shelf can never drift apart again." },
    { feature: "A permanent stock in/out ledger", outcome: "Every movement is recorded with a date and a name attached to it." },
    { feature: "Profit and margin per product", outcome: "See which items genuinely earn, and which just move." },
    { feature: "Roles for admin, manager and staff", outcome: "Attendants sell; only you see the money and change the prices." },
  ],
};

export const CLUSTERS = [
  {
    icon: LuBoxes,
    tone: "blue",
    title: "Inventory & stock control",
    description: "Keep an accurate count of every item you sell, and know the moment something is about to run out.",
    points: [
      "Add products with a photo, SKU, category, unit and price.",
      "Set a reorder level per product and get flagged automatically when stock runs low.",
      "Record stock in and out — every entry permanent and traceable.",
    ],
  },
  {
    icon: LuReceipt,
    tone: "green",
    title: "Sales & orders",
    description: "Serve customers faster at the counter, and keep a clean record of every sale without extra paperwork.",
    points: [
      "Ring up a sale by picking products and quantities — the total calculates itself.",
      "Record the payment method and attach the sale to a customer, or leave it walk-in.",
      "Cancel a wrong order and Trackora returns the stock to the shelf automatically.",
    ],
  },
  {
    icon: LuChartColumnBig,
    tone: "orange",
    title: "Reports & insights",
    description: "Understand your shop in numbers, so you order and price with confidence instead of instinct.",
    points: [
      "See daily and monthly sales trends over the last 7, 30 or 90 days.",
      "Know your revenue, cost of goods, profit and margin — not just what came in.",
      "See your best sellers and low-stock list side by side, so you reorder what sells.",
    ],
  },
  {
    icon: LuShieldCheck,
    tone: "purple",
    title: "Roles & staff control",
    description: "Give your team exactly the access they need to do their job, and nothing more.",
    points: [
      "Three roles out of the box: admin, manager and staff.",
      "Attendants sell and record stock; only managers and admins change prices or cancel orders.",
      "Every stock movement and order records who made it — so questions have answers.",
    ],
  },
];

export const STEPS = [
  { title: "Add your products", text: "Enter your items with prices, units and a reorder level. Start with your top 20 sellers and build from there." },
  { title: "Set up your team", text: "Create accounts for your attendants and managers. Pick what each person can see and change." },
  { title: "Start selling", text: "Record sales at the counter. Stock counts update themselves as you go — no separate book to maintain." },
  { title: "Watch your numbers", text: "Check the dashboard each morning for sales, profit and anything running low. Reorder before you run out." },
];

export const TESTIMONIAL = {
  quote:
    "Before Trackora I was counting cement bags twice a week and still getting it wrong. Now I open the dashboard in the morning and I know what sold, what's low and what I need to order. Last month I caught that we were losing money on two items I thought were doing well.",
  name: "Nakabugo Sarah",
  business: "Owner, Bugolobi Hardware & Building Supplies, Kampala",
  meta: "3 branches · 1,200+ products",
};

export const FAQS = [
  { q: "How much does Trackora cost?", a: "We charge one monthly fee per shop, with no setup cost and no charge per user — add as many attendants as you need. Start free while you set up and test it with your own products. Book a demo and we'll quote you based on your shop size." },
  { q: "Do I need internet all the time?", a: "You need a connection to record sales and see live stock, and Trackora works fine on ordinary mobile data — it's built to be light. If your connection is unreliable, mention it during the demo and we'll walk you through how other stores handle it." },
  { q: "Is my business data safe? What if my computer is stolen?", a: "Your data lives on secure servers, not on the machine in your shop. If a laptop or phone is lost, nothing is lost with it — sign in on another device and everything is exactly where you left it. Backups run automatically, and connections are encrypted." },
  { q: "Who can see my prices and profit?", a: "You decide. Staff accounts can record sales and stock but never see cost prices, profit or reports. Managers see reports. Only admins can add users or change roles." },
  { q: "Will you help us set it up and train my staff?", a: "Yes. We help you load your first batch of products and run a training session with your team. After that you can reach us by phone, WhatsApp or email during business hours." },
  { q: "I have more than one branch. Does that work?", a: "Yes — talk to us during the demo. We'll set your branches up so each one keeps its own stock while you see the whole business from one login." },
  { q: "Can I use it on my phone?", a: "Yes. Trackora runs in your phone's browser with no app to install. The dashboard, product list and sales screens all adjust to a small screen, so you can check your shop from anywhere." },
  { q: "I already have my stock in an Excel file. Do I retype everything?", a: "No. Send us your file during onboarding and we'll import it for you. If it's in a counter book instead, we'll help you enter your fastest-moving items first so you're running quickly." },
];

export const FINAL_CTA = {
  headline: "Stop counting. Start knowing.",
  subheadline:
    "Join the hardware stores that replaced the counter book with something that actually adds up. Set up your products today and see your first real numbers tomorrow morning.",
  reassurance: "No card needed · Free while you set up · We'll help you import your stock",
};
