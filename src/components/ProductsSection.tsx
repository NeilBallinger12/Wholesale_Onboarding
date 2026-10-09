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
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";

import { type Product } from "../data/products";

interface ProductsSectionProps {
  /** Open the order flow */
  onOrder: () => void;
  /** Open the unlock modal */
  onUnlock: (product: Product) => void;
  /** Open the pending-request tracker */
  onTrack: (product: Product) => void;
}

const lockedProducts = [
  {
    id: "broadband",
    name: "Broadband One",
    desc: "FTTP, SOGEA and FTTC access for your end customers.",
    blocker: "Needs: signed Broadband One schedule",
    reused: "Credit check and billing already verified.",
    icon: BtIconBroadband,
    accessRequested: false,
  },
  {
    id: "ethernet",
    name: "Ethernet",
    desc: "Point-to-point and backhaul circuits, 100Mb to 10Gb.",
    blocker: "Needs: schedule + technical accreditation",
    reused: "Company, credit and billing already verified.",
    icon: BtIconEthernet,
    accessRequested: false,
  },
  {
    id: "dia",
    name: "Dedicated internet access",
    desc: "DIA with committed bandwidth and SLAs.",
    blocker: "Needs: schedule + technical accreditation",
    reused: "Company, credit and billing already verified.",
    icon: BtIconGlobe,
    accessRequested: false,
  },
];

export const ProductsSection = ({
  onOrder,
  onUnlock,
  onTrack,
}: ProductsSectionProps) => {
  return (
    <div className="btw-page-section btw-section">
      {/* Section header */}
      <Heading level="2" size="l">
        Products you can sell
      </Heading>
      <VerticalSpace size="8" />
      <Text size="s" tone="supporting" elementType="p">
        One onboarding, one portal. You're enabled to order Digital Voice today.
        Unlock the rest without repeating onboarding. We already hold your
        company, credit and billing details.
      </Text>

      <VerticalSpace size="32" />

      {/* Products grid */}
      <div className="btw-card-grid">
        {/* Enabled: Digital Voice — 2px brand border */}
        <div className="btw-card btw-card--brand-border" style={{ position: "relative" }}>
          {/* Enabled badge positioned top-left */}
          <div style={{ position: "absolute", top: "20px", left: "24px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0 8px",
                height: "24px",
                borderRadius: "1000px",
                background: "var(--btw-color-badge-enabled-bg)",
                color: "var(--btw-color-badge-enabled-text)",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Enabled
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
            <div className="btw-icon-circle btw-icon-circle--brand">
              <Icon icon={BtIconPhone} size={24} />
            </div>

            {/* Text content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Heading level="3" size="s">
                Digital Voice
              </Heading>
              <Text size="m" tone="supporting" elementType="p">
                Sell hosted voice and SIP to your end customers. 340 lines live.
              </Text>
              <Text size="s" tone="muted" elementType="p">
                Contract signed · 12 Mar 2026
                <br />
                Ordering, billing and faults active.
              </Text>
            </div>

            <Rule />

            {/* Actions */}
            <div style={{ display: "flex", gap: "0" }}>
              <ButtonV2
                label="Order"
                buttonStyle="primary"
                size="m"
                onClick={onOrder}
                icon={BtIconArrowRight}
                iconPosition="afterText"
              />
              <ButtonV2
                label="See plans"
                buttonStyle="tertiary"
                size="m"
              />
            </div>
          </div>
        </div>

        {/* Locked products */}
        {lockedProducts.map((product) => (
          <div key={product.id} className="btw-card btw-card--border" style={{ position: "relative" }}>
            {/* Not enabled badge */}
            <div style={{ position: "absolute", top: "20px", left: "24px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 8px",
                  height: "24px",
                  borderRadius: "1000px",
                  background: "var(--btw-color-badge-locked-bg)",
                  color: "var(--btw-color-badge-locked-text)",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {product.accessRequested ? "Access requested" : "Not enabled"}
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
              <div className="btw-icon-circle">
                <Icon icon={product.accessRequested ? product.icon : BtIconLocked} size={24} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Heading level="3" size="s">
                  {product.name}
                </Heading>
                <Text size="m" tone="supporting" elementType="p">
                  {product.desc}
                </Text>
                <Text size="s" tone="muted" elementType="p">
                  {product.blocker}
                  <br />
                  {product.reused}
                </Text>
              </div>

              <Rule />

              <div style={{ display: "flex", gap: "0" }}>
                {product.accessRequested ? (
                  <ButtonV2
                    label="Track request"
                    buttonStyle="secondary"
                    size="m"
                    onClick={() =>
                      onTrack({
                        id: product.id,
                        name: product.name,
                        desc: product.desc,
                        enabled: false,
                        blocker: product.blocker,
                        reused: product.reused,
                        accessRequested: true,
                      })
                    }
                  />
                ) : (
                  <>
                    <ButtonV2
                      label="Unlock to sell"
                      buttonStyle="secondary"
                      size="m"
                      onClick={() =>
                        onUnlock({
                          id: product.id,
                          name: product.name,
                          desc: product.desc,
                          enabled: false,
                          blocker: product.blocker,
                          reused: product.reused,
                          accessRequested: false,
                        })
                      }
                    />
                    <ButtonV2
                      label="Enquire"
                      buttonStyle="tertiary"
                      size="m"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
