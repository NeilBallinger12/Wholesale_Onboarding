import { useState } from "react";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconBuilding } from "@arc-ui/icons/BtIconBuilding";
import { BtIconDocumentAndPencil } from "@arc-ui/icons/BtIconDocumentAndPencil";
import { BtIconCreditCard } from "@arc-ui/icons/BtIconCreditCard";
import { BtIconUserGroups } from "@arc-ui/icons/BtIconUserGroups";
import { BtIconDesign } from "@arc-ui/icons/BtIconDesign";
import { BtIconEducation } from "@arc-ui/icons/BtIconEducation";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";
import { BtIconClock } from "@arc-ui/icons/BtIconClock";
import { BtIconLocked } from "@arc-ui/icons/BtIconLocked";
import { BtIconChevronLeftMid } from "@arc-ui/icons/BtIconChevronLeftMid";
import { BtIconsChevronRightMid } from "@arc-ui/icons/BtIconsChevronRightMid";
import { BtIconTickAlt } from "@arc-ui/icons/BtIconTickAlt";

interface Step {
  /** Step number */
  num: number;
  /** Step title */
  title: string;
  /** Short description */
  desc: string;
  /** Estimated time */
  time: string;
  /** Icon data-URI */
  icon: string;
  /** Whether this step is locked */
  locked: boolean;
  /** Whether this step is open/actionable */
  open: boolean;
}

const steps: Step[] = [
  {
    num: 1,
    title: "Add Company Information",
    desc: "Tell us about your company so we can set up your account correctly.",
    time: "5 mins",
    icon: BtIconBuilding,
    locked: false,
    open: true,
  },
  {
    num: 2,
    title: "Add Billing Information",
    desc: "Set up your billing account and payment preferences.",
    time: "5 mins",
    icon: BtIconCreditCard,
    locked: true,
    open: false,
  },
  {
    num: 3,
    title: "Approve Commercials",
    desc: "Review and approve your commercial terms and pricing agreement.",
    time: "10 mins",
    icon: BtIconDocumentAndPencil,
    locked: true,
    open: false,
  },
  {
    num: 4,
    title: "Add my team to the portal",
    desc: "Invite your team members and configure their access levels.",
    time: "10 mins",
    icon: BtIconUserGroups,
    locked: false,
    open: false,
  },
  {
    num: 5,
    title: "Customise my branding",
    desc: "Upload your logo and set your brand colours for the portal.",
    time: "3 mins",
    icon: BtIconDesign,
    locked: false,
    open: false,
  },
  {
    num: 6,
    title: "Complete training",
    desc: "Complete the onboarding training to get the most from the portal.",
    time: "15 mins",
    icon: BtIconEducation,
    locked: false,
    open: true,
  },
];

const CARDS_VISIBLE = 4;

/* ── Progress ring (SVG) ────────────────────────────────────── */
interface ProgressRingProps {
  /** 0–100 */
  percent: number;
}

const ProgressRing = ({ percent }: ProgressRingProps) => {
  const r = 46;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 110, height: 110 }}>
      <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#e8e8e8"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#5514b4"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {/* Label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "BT Curve, sans-serif",
            fontWeight: 500,
            fontSize: "28px",
            lineHeight: 1,
            color: "#5514b4",
          }}
        >
          {percent}
        </span>
        <span
          style={{
            fontFamily: "BT Curve, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            color: "#5514b4",
          }}
        >
          %
        </span>
      </div>
    </div>
  );
};

/* ── Individual step card ───────────────────────────────────── */
interface StepCardProps {
  step: Step;
  /** Called when the card is clicked (open, unlocked steps only) */
  onClick?: () => void;
  /** Whether this step has been submitted/completed */
  submitted?: boolean;
}

const StepCard = ({ step, onClick, submitted }: StepCardProps) => {
  const [hovered, setHovered] = useState(false);

  const isOpen = step.open;
  const isLocked = step.locked;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isLocked && onClick?.()}
      style={{
        position: "relative",
        width: "256px",
        minWidth: "256px",
        height: "284px",
        borderRadius: "16px",
        padding: "24px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        background: submitted ? "#e6f4e5" : isOpen ? "#ffffff" : "#f7f7f7",
        border: submitted
          ? "2px solid #036c01"
          : isOpen
            ? hovered
              ? "2px solid var(--btw-color-brand-primary)"
              : "1px solid var(--btw-color-border-neutral)"
            : "none",
        transition: "border-color 0.2s ease",
        cursor: isLocked ? "default" : "pointer",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Ghost step number */}
      <span
        style={{
          position: "absolute",
          top: "-7px",
          right: "16px",
          fontFamily: "BT Curve, sans-serif",
          fontWeight: 500,
          fontSize: "80px",
          lineHeight: "96px",
          color: isOpen ? "#5514b4" : "#aaaaaa",
          opacity: 0.15,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {step.num}
      </span>

      {/* Top content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: submitted ? "#ffffff" : "inherit", display: "flex" }}>
            <Icon
              icon={submitted ? BtIconTickAlt : isLocked ? BtIconLocked : step.icon}
              size={32}
            />
          </span>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ width: "209px" }}>
            <Text
              size="m"
              elementType="span"
              tone={isOpen ? "default" : "muted"}
            >
              <strong>{step.title}</strong>
            </Text>
          </div>
          <div
            style={{
              width: "209px",
              height: "64px",
              overflow: "hidden",
            }}
          >
            <Text
              size="s"
              tone={isOpen ? "supporting" : "muted"}
              elementType="p"
            >
              {submitted ? "Awaiting approval" : step.desc}
            </Text>
          </div>
        </div>
      </div>

      {/* Bottom row: time + arrow */}
      <div
        style={{
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Time estimate */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          <Icon icon={BtIconClock} size={16} />
          <Text size="s" tone="muted">
            {step.time}
          </Text>
        </div>

        {/* Arrow / tick — only on open/unlocked steps */}
        {!isLocked && (
          <div
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: submitted ? "#036c01" : isOpen ? "#5514b4" : "transparent",
            }}
          >
            <span style={{ color: "#ffffff", display: "flex" }}>
              <Icon icon={submitted ? BtIconTickAlt : BtIconArrowRight} size={20} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main module ────────────────────────────────────────────── */
interface WelcomeBTModuleProps {
  onGoToCompanyInfo: () => void;
  onGoToBilling: () => void;
  onGoToBranding: () => void;
  onGoToTeam: () => void;
  onGoToCommercials: () => void;
  companyInfoSubmitted: boolean;
  billingSubmitted: boolean;
  brandingSubmitted: boolean;
  teamSubmitted: boolean;
  commercialsSubmitted: boolean;
}

export const WelcomeBTModule = ({ onGoToCompanyInfo, onGoToBilling, onGoToBranding, onGoToTeam, onGoToCommercials, companyInfoSubmitted, billingSubmitted, brandingSubmitted, teamSubmitted, commercialsSubmitted }: WelcomeBTModuleProps) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(steps.length / CARDS_VISIBLE);
  const completedSteps =
    (companyInfoSubmitted ? 1 : 0) +
    (billingSubmitted ? 1 : 0) +
    (brandingSubmitted ? 1 : 0) +
    (teamSubmitted ? 1 : 0) +
    (commercialsSubmitted ? 1 : 0);
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  // Unlock step 2 (Billing) once company info submitted
  // Unlock step 3 (Approve Commercials) once billing submitted
  // Unlock step 4 (team) once company info submitted
  // Unlock step 5 (branding) once company info submitted
  const resolvedSteps = steps.map((s) => {
    if (s.num === 2) return { ...s, locked: !companyInfoSubmitted, open: companyInfoSubmitted && !billingSubmitted };
    if (s.num === 3) return { ...s, locked: !billingSubmitted, open: billingSubmitted && !commercialsSubmitted };
    if (s.num === 4) return { ...s, locked: !companyInfoSubmitted, open: companyInfoSubmitted && !teamSubmitted };
    if (s.num === 5) return { ...s, locked: !companyInfoSubmitted, open: companyInfoSubmitted && !brandingSubmitted };
    return s;
  });

  const visibleSteps = resolvedSteps.slice(
    page * CARDS_VISIBLE,
    page * CARDS_VISIBLE + CARDS_VISIBLE,
  );

  return (
    <div className="btw-page-section">
      <VerticalSpace size="64" />

      {/* Outer card — white, 2px indigo stroke, 32px radius, drop shadow */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "32px",
          border: "2px solid #5514b4",
          boxShadow: "0px 0px 32px 0px rgba(0, 0, 0, 0.08)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          overflow: "hidden",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Heading level="3" size="m">
            Setup your BT Wholesale account
          </Heading>
          <Text size="m" tone="supporting" elementType="p">
            Please complete the following steps. Your customised settings and
            features will appear here on your dashboard once you've set them up.
          </Text>
        </div>

        {/* Body: progress panel + step cards */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "32px",
          }}
        >
          {/* Left: progress panel */}
          <div
            style={{
              width: "300px",
              minWidth: "300px",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              boxShadow:
                "0px 4px 12px 0px rgba(0, 0, 0, 0.1), 0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Heading level="4" size="s">
                Set-up progress
              </Heading>
              <Text size="m" tone="supporting">
                {completedSteps} of {steps.length} steps completed
              </Text>
            </div>

            <ProgressRing percent={progressPercent} />

            {brandingSubmitted ? (
              <ButtonV2
                label="Edit branding"
                buttonStyle="secondary"
                size="m"
                onClick={onGoToBranding}
              />
            ) : commercialsSubmitted ? (
              <ButtonV2
                label="View agreement"
                buttonStyle="secondary"
                size="m"
                onClick={onGoToCommercials}
              />
            ) : teamSubmitted ? (
              <ButtonV2
                label="Edit team"
                buttonStyle="secondary"
                size="m"
                onClick={onGoToTeam}
              />
            ) : billingSubmitted ? (
              <ButtonV2
                label="Edit billing details"
                buttonStyle="secondary"
                size="m"
                onClick={onGoToBilling}
              />
            ) : companyInfoSubmitted ? (
              <ButtonV2
                label="Edit company information"
                buttonStyle="secondary"
                size="m"
                onClick={onGoToCompanyInfo}
              />
            ) : (
              <ButtonV2
                label="Start quick setup"
                buttonStyle="primary"
                size="m"
                icon={BtIconArrowRight}
                iconPosition="afterText"
                onClick={onGoToCompanyInfo}
              />
            )}
          </div>

          {/* Right: step cards — horizontally scrolls on small screens, paginates on large */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Cards row */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
            >
              {visibleSteps.map((step) => (
                <StepCard
                  key={step.num}
                  step={step}
                  submitted={
                    (step.num === 1 && companyInfoSubmitted) ||
                    (step.num === 2 && billingSubmitted) ||
                    (step.num === 3 && commercialsSubmitted) ||
                    (step.num === 4 && teamSubmitted) ||
                    (step.num === 5 && brandingSubmitted)
                  }
                  onClick={
                    step.num === 1 ? onGoToCompanyInfo :
                    step.num === 2 ? onGoToBilling :
                    step.num === 3 ? onGoToCommercials :
                    step.num === 4 ? onGoToTeam :
                    step.num === 5 ? onGoToBranding :
                    undefined
                  }
                />
              ))}
            </div>

            {/* Pagination dots + chevrons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <button
                aria-label="Previous"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: page === 0 ? "default" : "pointer",
                  opacity: page === 0 ? 0.3 : 1,
                  display: "flex",
                  padding: 0,
                }}
              >
                <Icon icon={BtIconChevronLeftMid} size={20} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Page ${i + 1}`}
                  onClick={() => setPage(i)}
                  style={{
                    width: i === page ? "18px" : "10px",
                    height: "10px",
                    borderRadius: "24px",
                    background: i === page ? "#2a1c4a" : "#d9d9d9",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "width 0.2s ease, background 0.2s ease",
                  }}
                />
              ))}

              <button
                aria-label="Next"
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page === totalPages - 1}
                style={{
                  background: "none",
                  border: "none",
                  cursor: page === totalPages - 1 ? "default" : "pointer",
                  opacity: page === totalPages - 1 ? 0.3 : 1,
                  display: "flex",
                  padding: 0,
                }}
              >
                <Icon icon={BtIconsChevronRightMid} size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <VerticalSpace size="64" />
    </div>
  );
};
