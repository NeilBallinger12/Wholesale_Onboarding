import { useState } from "react";

import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconDocumentDownload } from "@arc-ui/icons/BtIconDocumentDownload";
import { BtIconLocked } from "@arc-ui/icons/BtIconLocked";
import { BtIconPhone } from "@arc-ui/icons/BtIconPhone";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";
import { BtIconCreditCard } from "@arc-ui/icons/BtIconCreditCard";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconBuilding } from "@arc-ui/icons/BtIconBuilding";
import { BtIconAlertTriangle } from "@arc-ui/icons/BtIconAlertTriangle";

interface TrainingModuleProps {
  companyInfoSubmitted: boolean;
  commercialsSubmitted: boolean;
  billingSubmitted: boolean;
  teamSubmitted: boolean;
}

type ContentType = "video" | "document";

interface TrainingItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  duration: string;
  icon: string;
  /** null = always unlocked */
  unlockedBy: "company" | "commercials" | "billing" | "team" | null;
  ctaLabel: string;
  thumbnailBg: string;
}

const trainingItems: TrainingItem[] = [
  {
    id: "dv-intro",
    title: "Digital Voice: Portal Overview",
    description: "A 4-minute walkthrough of the BT Wholesale portal — how to navigate, place orders and manage your Digital Voice services.",
    type: "video",
    duration: "4:12",
    icon: BtIconPhone,
    unlockedBy: null,
    ctaLabel: "Watch now",
    thumbnailBg: "linear-gradient(135deg, #2a1c4a 0%, #5514b4 100%)",
  },
  {
    id: "provisioning",
    title: "Provisioning Digital Voice",
    description: "Step-by-step guide to provisioning end-customer lines: number allocation, SIP configuration and activating services through the portal.",
    type: "document",
    duration: "12 min read",
    icon: BtIconBroadband,
    unlockedBy: "company",
    ctaLabel: "Read guide",
    thumbnailBg: "linear-gradient(135deg, #e8f4ff 0%, #c5ddf7 100%)",
  },
  {
    id: "porting",
    title: "Porting Numbers to BT Wholesale",
    description: "Everything you need to know about porting existing customer numbers — timelines, required information, CLI formats and handling rejections.",
    type: "document",
    duration: "8 min read",
    icon: BtIconBuilding,
    unlockedBy: "commercials",
    ctaLabel: "Read guide",
    thumbnailBg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
  },
  {
    id: "billing-guide",
    title: "How Billing Works",
    description: "Understand invoice cycles, usage charges, volume discount tiers and how to raise billing queries through the portal.",
    type: "document",
    duration: "6 min read",
    icon: BtIconCreditCard,
    unlockedBy: "billing",
    ctaLabel: "Read guide",
    thumbnailBg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
  },
  {
    id: "repairs",
    title: "Faults, Repairs & CPE Management",
    description: "How to raise fault tickets, manage customer premises equipment (CPE), and track repair SLAs for Digital Voice lines.",
    type: "document",
    duration: "10 min read",
    icon: BtIconAlertTriangle,
    unlockedBy: "team",
    ctaLabel: "Read guide",
    thumbnailBg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)",
  },
];

/* ── Training card ───────────────────────────────────────────── */
interface TrainingCardProps {
  item: TrainingItem;
  isLocked: boolean;
  unlockLabel: string;
}

const TrainingCard = ({ item, isLocked, unlockLabel }: TrainingCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isLocked ? "#f7f7f7" : "#ffffff",
        borderRadius: "16px",
        border: isLocked
          ? "1px solid #e8e8e8"
          : hovered
            ? "2px solid var(--btw-color-brand-primary)"
            : "1px solid var(--btw-color-border-mid)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s ease",
        cursor: isLocked ? "default" : "pointer",
        flex: "1 1 200px",
        minWidth: "200px",
        maxWidth: "260px",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: "100px",
          background: item.thumbnailBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {item.type === "video" && !isLocked ? (
          /* Play button */
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
              <path d="M1 0.5L13 8L1 15.5V0.5Z" fill="#5514b4" />
            </svg>
          </div>
        ) : isLocked ? (
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon icon={BtIconLocked} size={24} />
          </div>
        ) : (
          <Icon icon={item.icon} size={36} />
        )}

        {/* Duration badge */}
        {!isLocked && (
          <span
            style={{
              position: "absolute",
              bottom: "8px",
              right: "10px",
              fontFamily: "BT Curve, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: "#ffffff",
              background: "rgba(0,0,0,0.4)",
              padding: "1px 6px",
              borderRadius: "3px",
            }}
          >
            {item.duration}
          </span>
        )}

        {/* Type badge */}
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: "10px",
            fontFamily: "BT Curve, sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            color: isLocked ? "#6b6b6b" : "#ffffff",
            background: isLocked ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.35)",
            padding: "2px 8px",
            borderRadius: "1000px",
          }}
        >
          {item.type === "video" ? "Video" : "Guide"}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        <Text size="s" elementType="span" tone={isLocked ? "muted" : "default"}>
          <strong>{item.title}</strong>
        </Text>
        <Text size="s" tone="muted" elementType="p">
          {isLocked ? `Complete ${unlockLabel} to unlock this content.` : item.description}
        </Text>

        {!isLocked && (
          <div style={{ marginTop: "auto", paddingTop: "8px" }}>
            <ButtonV2
              label={item.ctaLabel}
              buttonStyle={item.type === "video" ? "primary" : "secondary"}
              size="s"
              icon={item.type === "video" ? undefined : BtIconDocumentDownload}
              iconPosition="beforeText"
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main module ─────────────────────────────────────────────── */
export const TrainingModule = ({
  companyInfoSubmitted,
  commercialsSubmitted,
  billingSubmitted,
  teamSubmitted,
}: TrainingModuleProps) => {
  const isUnlocked = (item: TrainingItem): boolean => {
    if (item.unlockedBy === null) return true;
    if (item.unlockedBy === "company") return companyInfoSubmitted;
    if (item.unlockedBy === "commercials") return commercialsSubmitted;
    if (item.unlockedBy === "billing") return billingSubmitted;
    if (item.unlockedBy === "team") return teamSubmitted;
    return false;
  };

  const unlockLabel = (item: TrainingItem): string => {
    if (item.unlockedBy === "company") return "Add Company Information";
    if (item.unlockedBy === "commercials") return "Approve Commercials";
    if (item.unlockedBy === "billing") return "Add Billing Information";
    if (item.unlockedBy === "team") return "Add My Team";
    return "the required setup step";
  };

  return (
    <div className="btw-page-section btw-section">
      {/* Heading row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <Heading level="2" size="l">
            Complete your training
          </Heading>
          <VerticalSpace size="8" />
          <Text size="s" tone="supporting" elementType="p">
            Everything you need to start selling Digital Voice confidently. Complete setup steps to unlock all modules.
          </Text>
        </div>
        <ButtonV2
          label="View all training"
          buttonStyle="tertiary"
          size="s"
          icon={BtIconArrowRight}
          iconPosition="afterText"
        />
      </div>

      <VerticalSpace size="40" />

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {trainingItems.map((item) => (
          <TrainingCard
            key={item.id}
            item={item}
            isLocked={!isUnlocked(item)}
            unlockLabel={unlockLabel(item)}
          />
        ))}
      </div>
    </div>
  );
};
