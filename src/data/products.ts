export interface Product {
  /** Unique key for the product */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  desc: string;
  /** Whether the product is already enabled */
  enabled: boolean;
  /** Blocker / status copy shown under the name */
  blocker: string;
  /** Which onboarding data is reused */
  reused: string;
  /** Whether an access request has been submitted */
  accessRequested: boolean;
}

export const products: Product[] = [
  {
    id: "ethernet",
    name: "Ethernet",
    desc: "Dedicated leased-line connectivity for your end customers.",
    enabled: false,
    blocker: "Requires technical accreditation call",
    reused: "Company, credit and billing details pre-filled",
    accessRequested: false,
  },
  {
    id: "dia",
    name: "DIA",
    desc: "Dedicated Internet Access with SLA-backed speeds.",
    enabled: false,
    blocker: "Requires technical accreditation call",
    reused: "Company, credit and billing details pre-filled",
    accessRequested: true,
  },
  {
    id: "broadband",
    name: "Broadband One",
    desc: "Multi-technology broadband for SME and enterprise customers.",
    enabled: false,
    blocker: "Product schedule signature needed",
    reused: "Company, credit and billing details pre-filled",
    accessRequested: false,
  },
  {
    id: "mobile",
    name: "Mobile",
    desc: "Business mobile plans on the BT network.",
    enabled: false,
    blocker: "Product schedule signature needed",
    reused: "Company, credit and billing details pre-filled",
    accessRequested: false,
  },
];

export interface OnboardingStep {
  /** Step label */
  label: string;
  /** Metadata / date */
  meta: string;
}

export const onboardingSteps: OnboardingStep[] = [
  { label: "Company details verified", meta: "Completed 10 Mar 2026" },
  { label: "Credit check passed", meta: "Completed 10 Mar 2026" },
  { label: "Legal entity confirmed", meta: "Completed 11 Mar 2026" },
  { label: "Billing account created", meta: "Completed 11 Mar 2026" },
  { label: "Digital Voice schedule signed", meta: "Completed 12 Mar 2026" },
];

export interface Order {
  id: string;
  customer: string;
  detail: string;
  status: "In progress" | "Completed" | "Draft";
  product: string;
}

export const recentOrders: Order[] = [
  {
    id: "DV-00181",
    customer: "Jones Ltd",
    detail: "30 channels",
    status: "In progress",
    product: "Digital Voice",
  },
  {
    id: "DV-00179",
    customer: "Smith & Co",
    detail: "8 channels",
    status: "Completed",
    product: "Digital Voice",
  },
  {
    id: "DV-00176",
    customer: "Evans Group",
    detail: "12 channels",
    status: "Draft",
    product: "Digital Voice",
  },
];
