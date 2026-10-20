import { useState, useRef, useEffect } from "react";

/* ── Types ──────────────────────────────────────────────────── */
export interface PrototypeState {
  companySubmitted: boolean;
  billingSubmitted: boolean;
  billingAccountNumber: string;
  commercialsSubmitted: boolean;
  teamSubmitted: boolean;
  brandingSubmitted: boolean;
  /** Trigger the commercial notification toast on next dashboard render */
  triggerCommercialNotification: boolean;
  page: "dashboard";
}

interface PrototypeNavProps {
  /** Called when the user picks a step */
  onApply: (state: PrototypeState) => void;
  /** Current branding logo URL — preserved across compatible steps */
  currentBrandLogoUrl?: string;
  /** Current primary colour — preserved across compatible steps */
  currentBrandPrimaryColour?: string;
  currentBrandingSubmitted?: boolean;
}

/* ── Step definitions ───────────────────────────────────────── */
const steps: Array<{
  label: string;
  sublabel: string;
  build: (brandLogoUrl: string, primaryColour: string, brandingSubmitted: boolean) => PrototypeState;
}> = [
  {
    label: "1: Start",
    sublabel: "Fresh state — nothing submitted",
    build: () => ({
      companySubmitted: false,
      billingSubmitted: false,
      billingAccountNumber: "",
      commercialsSubmitted: false,
      teamSubmitted: false,
      brandingSubmitted: false,
      triggerCommercialNotification: false,
      page: "dashboard",
    }),
  },
  {
    label: "2: Add Billing Information",
    sublabel: "Company info already submitted",
    build: () => ({
      companySubmitted: true,
      billingSubmitted: false,
      billingAccountNumber: "",
      commercialsSubmitted: false,
      teamSubmitted: false,
      brandingSubmitted: false,
      triggerCommercialNotification: false,
      page: "dashboard",
    }),
  },
  {
    label: "3: Approve Commercials",
    sublabel: "Billing submitted — notification triggers",
    build: () => ({
      companySubmitted: true,
      billingSubmitted: true,
      billingAccountNumber: "BTA-830241",
      commercialsSubmitted: false,
      teamSubmitted: false,
      brandingSubmitted: false,
      triggerCommercialNotification: true,
      page: "dashboard",
    }),
  },
  {
    label: "4: Add team to portal",
    sublabel: "Commercials approved, billing & company done",
    build: () => ({
      companySubmitted: true,
      billingSubmitted: true,
      billingAccountNumber: "BTA-830241",
      commercialsSubmitted: true,
      teamSubmitted: false,
      brandingSubmitted: false,
      triggerCommercialNotification: false,
      page: "dashboard",
    }),
  },
  {
    label: "5: Customise my branding",
    sublabel: "Same as step 4",
    build: () => ({
      companySubmitted: true,
      billingSubmitted: true,
      billingAccountNumber: "BTA-830241",
      commercialsSubmitted: true,
      teamSubmitted: false,
      brandingSubmitted: false,
      triggerCommercialNotification: false,
      page: "dashboard",
    }),
  },
  {
    label: "6: Complete training",
    sublabel: "Retains current branding if set",
    build: (_logo, _colour, brandingSubmitted) => ({
      companySubmitted: true,
      billingSubmitted: true,
      billingAccountNumber: "BTA-830241",
      commercialsSubmitted: true,
      teamSubmitted: false,
      brandingSubmitted,
      triggerCommercialNotification: false,
      page: "dashboard",
    }),
  },
];

/* ── Component ──────────────────────────────────────────────── */
export const PrototypeNav = ({
  onApply,
  currentBrandLogoUrl = "",
  currentBrandPrimaryColour = "",
  currentBrandingSubmitted = false,
}: PrototypeNavProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleStep = (idx: number) => {
    const state = steps[idx].build(
      currentBrandLogoUrl,
      currentBrandPrimaryColour,
      currentBrandingSubmitted,
    );
    onApply(state);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        fontFamily: "BT Curve, system-ui, sans-serif",
      }}
    >
      {/* Dropdown panel — shown above the button */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            width: "300px",
            background: "#1e1a2e",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
          role="menu"
        >
          {/* Panel title */}
          <div
            style={{
              paddingBottom: "10px",
              marginBottom: "4px",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span
              style={{
                fontFamily: "BT Curve, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Prototype steps
            </span>
          </div>

          {steps.map((step, i) => (
            <button
              key={step.label}
              role="menuitem"
              onClick={() => handleStep(i)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "8px",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "none";
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  lineHeight: 1.3,
                }}
              >
                {step.label}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.3,
                }}
              >
                {step.sublabel}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 14px",
          background: "#1e1a2e",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 600,
          fontFamily: "BT Curve, system-ui, sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#2d2650";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#1e1a2e";
        }}
      >
        {/* Triangle indicator matching the screenshot */}
        <span
          style={{
            fontSize: "10px",
            opacity: 0.7,
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.15s",
            display: "inline-block",
          }}
        >
          ▼
        </span>
        Prototype steps
      </button>
    </div>
  );
};
