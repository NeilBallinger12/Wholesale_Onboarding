import { useState, useEffect } from "react";

import { BrandLogo } from "@arc-ui/components/BrandLogo";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";

import tourScreenshot from "../assets/tour_screenshot.png";

type TourStep = "frame1" | "frame2" | "hidden";

interface DashboardTourProps {
  /** Called when the tour is dismissed */
  onClose: () => void;
}

export const DashboardTour = ({ onClose }: DashboardTourProps) => {
  const [step, setStep] = useState<TourStep>("hidden");
  const [contentVisible, setContentVisible] = useState(true);

  // Lock body scroll when tour is active
  useEffect(() => {
    if (step === "hidden") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [step]);

  // Show frame1 after 3 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => setStep("frame1"), 3000);
    return () => clearTimeout(showTimer);
  }, []);

  // Transition from frame1 to frame2 after 5 seconds
  useEffect(() => {
    if (step !== "frame1") return;
    const fadeOut = setTimeout(() => setContentVisible(false), 4600);
    const switchFrame = setTimeout(() => {
      setStep("frame2");
      setContentVisible(true);
    }, 5000);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(switchFrame);
    };
  }, [step]);

  if (step === "hidden") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.25)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Welcome tour"
    >
      {/* Tour card — always sized to Frame 2, Frame 1 overlays it */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "54px",
          width: "100%",
          maxWidth: "1440px",
          padding: "56px",
          boxSizing: "border-box",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Frame 2 always rendered to set the height */}
        <div style={{ visibility: step === "frame2" ? "visible" : "hidden" }}>
          <Frame2 onSkip={onClose} onStart={onClose} active={step === "frame2"} />
        </div>

        {/* Frame 1 absolutely overlays Frame 2, fades out on transition */}
        {step === "frame1" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "56px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.4s ease",
              opacity: contentVisible ? 1 : 0,
              borderRadius: "54px",
              background: "#ffffff",
            }}
          >
            <Frame1 />
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Frame 1: Large welcome splash ──────────────────────────── */
const Frame1 = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "46px",
    }}
  >
    <div style={{ width: "205px", height: "205px" }}>
      <BrandLogo size={205} />
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
      }}
    >
      <h1
        style={{
          fontFamily: "BT Curve, sans-serif",
          fontWeight: 500,
          fontSize: "clamp(64px, 8vw, 120px)",
          lineHeight: "1.13",
          color: "#5514b4",
          margin: 0,
          textAlign: "center",
        }}
      >
        Hey, John
      </h1>
      <p
        style={{
          fontFamily: "BT Curve, sans-serif",
          fontWeight: 500,
          fontSize: "28px",
          lineHeight: "36px",
          color: "#5514b4",
          margin: 0,
          textAlign: "center",
          maxWidth: "407px",
        }}
      >
        Thanks for choosing BT.
      </p>
    </div>
  </div>
);

/* ── Staggered fade-in item ──────────────────────────────────── */
interface FadeItemProps {
  /** Delay in ms before this element fades in */
  delay: number;
  /** Whether the parent frame is active — starts the timer */
  active: boolean;
  children: React.ReactNode;
}

const FadeItem = ({ delay, active, children }: FadeItemProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, active]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </div>
  );
};

/* ── Frame 2: Tour intro with staggered content ──────────────── */
interface Frame2Props {
  onSkip: () => void;
  onStart: () => void;
  /** Whether this frame is currently active — controls stagger timers */
  active: boolean;
}

const Frame2 = ({ onSkip, onStart, active }: Frame2Props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "40px",
    }}
  >
    {/* Logo row + Skip */}
    <div
      style={{
        display: "flex",
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div style={{ width: "90px", height: "90px" }}>
        <BrandLogo size={90} />
      </div>
      <div style={{ position: "absolute", right: 0, top: 0 }}>
        <ButtonV2
          label="Skip tour"
          buttonStyle="tertiary"
          size="m"
          onClick={onSkip}
        />
      </div>
    </div>

    {/* Hey, John — delay 0ms */}
    <FadeItem delay={0} active={active}>
      <h2
        style={{
          fontFamily: "BT Curve, sans-serif",
          fontWeight: 500,
          fontSize: "clamp(48px, 6vw, 80px)",
          lineHeight: "1.2",
          color: "#5514b4",
          margin: 0,
          textAlign: "center",
        }}
      >
        Hey, John
      </h2>
    </FadeItem>

    {/* Welcome subtitle — delay 1000ms */}
    <FadeItem delay={1000} active={active}>
      <p
        style={{
          fontFamily: "BT Curve, sans-serif",
          fontWeight: 500,
          fontSize: "20px",
          lineHeight: "28px",
          color: "#5514b4",
          margin: 0,
          textAlign: "center",
        }}
      >
        Welcome to our Wholesale Portal
      </p>
    </FadeItem>

    {/* Screenshot — delay 1500ms */}
    <FadeItem delay={1500} active={active}>
      <div
        style={{
          width: "100%",
          maxWidth: "776px",
          aspectRatio: "776 / 429",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#f7f7f7",
        }}
      >
        <img
          src={tourScreenshot}
          alt="Dashboard preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </FadeItem>

    {/* Body copy — delay 2000ms */}
    <FadeItem delay={2000} active={active}>
      <p
        style={{
          fontFamily: "BT Curve, sans-serif",
          fontWeight: 500,
          fontSize: "clamp(20px, 2.5vw, 32px)",
          lineHeight: "1.25",
          color: "#5514b4",
          margin: 0,
          textAlign: "center",
          maxWidth: "714px",
        }}
      >
        Powering connectivity and security for 800,000 businesses across the UK.
      </p>
    </FadeItem>

    {/* Start tour — delay 3000ms */}
    <FadeItem delay={3000} active={active}>
      <ButtonV2
        label="Start tour"
        buttonStyle="primary"
        size="m"
        onClick={onStart}
      />
    </FadeItem>
  </div>
);
