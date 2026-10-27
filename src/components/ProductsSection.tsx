import { useState } from "react";

import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Rule } from "@arc-ui/components/Rule";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconPhone } from "@arc-ui/icons/BtIconPhone";
import { BtIconLocked } from "@arc-ui/icons/BtIconLocked";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconEthernet } from "@arc-ui/icons/BtIconEthernet";
import { BtIconGlobe } from "@arc-ui/icons/BtIconGlobe";

import { type Product } from "../data/products";

interface ProductsSectionProps {
  /** Open the order flow */
  onOrder: () => void;
  /** Open the unlock modal */
  onUnlock: (product: Product) => void;
  /** Open the pending-request tracker */
  onTrack: (product: Product) => void;
  /** Whether commercials have been signed — unlocks DV 'Start ordering' primary CTA */
  commercialsSubmitted?: boolean;
}

const allProducts = [
  {
    id: "dv",
    name: "Digital Voice",
    desc: "Sell hosted voice and SIP to your end customers.",
    meta: "Sign your commercial agreement to start ordering.\nBilling and faults will activate once approved.",
    icon: BtIconPhone,
    enabled: false,
    accessRequested: false,
    blocker: "Needs: signed commercial agreement",
    reused: "",
  },
  {
    id: "broadband",
    name: "Broadband One",
    desc: "FTTP, SOGEA and FTTC access for your end customers.",
    meta: "Needs: signed Broadband One schedule\nCredit check and billing already verified.",
    icon: BtIconBroadband,
    enabled: false,
    accessRequested: false,
    blocker: "Needs: signed Broadband One schedule",
    reused: "Credit check and billing already verified.",
  },
  {
    id: "ethernet",
    name: "Ethernet",
    desc: "Point-to-point and backhaul circuits, 100Mb to 10Gb.",
    meta: "Needs: schedule + technical accreditation\nCompany, credit and billing already verified.",
    icon: BtIconEthernet,
    enabled: false,
    accessRequested: false,
    blocker: "Needs: schedule + technical accreditation",
    reused: "Company, credit and billing already verified.",
  },
  {
    id: "dia",
    name: "Dedicated internet access",
    desc: "DIA with committed bandwidth and SLAs.",
    meta: "Needs: schedule + technical accreditation\nCompany, credit and billing already verified.",
    icon: BtIconGlobe,
    enabled: false,
    accessRequested: false,
    blocker: "Needs: schedule + technical accreditation",
    reused: "Company, credit and billing already verified.",
  },
];

/* ── Hover-border card wrapper ─────────────────────────────── */
interface ProductCardProps {
  children: React.ReactNode;
  enabled?: boolean;
}

const ProductCard = ({ children, enabled }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--btw-color-surface-white)",
        borderRadius: "var(--btw-radius-card)",
        padding: "var(--btw-space-card-pad)",
        height: "100%",
        boxSizing: "border-box",
        position: "relative",
        border: hovered
          ? "2px solid var(--btw-color-brand-primary)"
          : enabled
            ? "2px solid var(--btw-color-border-mid)"
            : "1px solid var(--btw-color-border-mid)",
        transition: "border-color 0.2s ease",
        cursor: "default",
      }}
    >
      {children}
    </div>
  );
};

export const ProductsSection = ({
  onOrder,
  onUnlock,
  commercialsSubmitted,
}: ProductsSectionProps) => {
  return (
    <div className="btw-page-section btw-section">
      <Heading level="2" size="l">
        Products you can sell
      </Heading>
      <VerticalSpace size="8" />
      <Text size="s" tone="supporting" elementType="p">
        One onboarding, one portal. You're enabled to order Digital Voice today.
        Unlock the rest without repeating onboarding. We already hold your
        company, credit and billing details.
      </Text>

      <VerticalSpace size="40" />

      <div className="btw-card-grid">
        {allProducts.map((product) => {
          // DV becomes enabled once commercials are signed
          const isEnabled = product.id === "dv"
            ? !!commercialsSubmitted
            : product.enabled;

          return (
          <ProductCard key={product.id} enabled={isEnabled}>
            {/* Badge */}
            <div style={{ position: "absolute", top: "20px", left: "24px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 8px",
                  height: "24px",
                  borderRadius: "1000px",
                  background: isEnabled
                    ? "var(--btw-color-badge-enabled-bg)"
                    : "var(--btw-color-badge-locked-bg)",
                  color: isEnabled
                    ? "var(--btw-color-badge-enabled-text)"
                    : "var(--btw-color-badge-locked-text)",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {isEnabled
                  ? "Enabled"
                  : product.accessRequested
                    ? "Access requested"
                    : "Not enabled"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "32px",
              }}
            >
              {/* Icon */}
              <div
                className={`btw-icon-circle${isEnabled ? " btw-icon-circle--brand" : ""}`}
              >
                <Icon
                  icon={isEnabled ? product.icon : BtIconLocked}
                  size={24}
                />
              </div>

              {/* Text */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <Heading level="3" size="s">
                  {product.name}
                </Heading>
                <Text size="m" tone="supporting" elementType="p">
                  {product.desc}
                </Text>
                <Text size="s" tone="muted" elementType="p">
                  {(product.id === "dv" && commercialsSubmitted
                    ? "Contract signed · Ordering, billing and faults active."
                    : product.meta
                  ).split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </Text>
              </div>

              <Rule />

              {/* CTAs */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.id === "dv" && commercialsSubmitted ? (
                  <ButtonV2
                    label="Start ordering"
                    buttonStyle="primary"
                    size="s"
                    onClick={onOrder}
                  />
                ) : (
                  <ButtonV2
                    label="Unlock to sell"
                    buttonStyle="secondary"
                    size="s"
                    onClick={() => {
                      if (isEnabled) {
                        onOrder();
                      } else {
                        onUnlock({
                          id: product.id,
                          name: product.name,
                          desc: product.desc,
                          enabled: isEnabled,
                          blocker: product.blocker,
                          reused: product.reused,
                          accessRequested: product.accessRequested,
                        });
                      }
                    }}
                  />
                )}
                <ButtonV2 label="See plans" buttonStyle="tertiary" size="s" />
                <ButtonV2 label="Enquire" buttonStyle="tertiary" size="s" />
              </div>
            </div>
          </ProductCard>
          );
        })}
      </div>
    </div>
  );
};
