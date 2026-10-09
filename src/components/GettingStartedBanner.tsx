import { useState } from "react";

import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Link } from "@arc-ui/components/Link";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconCrossAlt } from "@arc-ui/icons/BtIconCrossAlt";

import headerIllustration from "../assets/illustration.svg";

export const GettingStartedBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="btw-page-section">
      {/* Card: Surface white, 1px border neutral, 32px radius — matches Figma EL-22daccb3 */}
      <div
        className="btw-card btw-card--border"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          position: "relative",
          flexWrap: "wrap",
        }}
      >
        {/* Illustration */}
        <div
          style={{ width: "130px", height: "130px", flexShrink: 0 }}
          aria-hidden="true"
        >
          <img
            src={headerIllustration}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Text content */}
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <Heading level="2" size="m">
            Getting to know BT Wholesale
          </Heading>
          <VerticalSpace size="8" />
          <Text size="m" tone="supporting" elementType="p">
            We've put together a starter pack to help you find your way around
            your account — from placing orders to helping your team market BT
            products to your customers.
          </Text>
          <VerticalSpace size="16" />
          <Link href="#" size="m">
            Get the starter pack
          </Link>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "var(--btw-color-brand-primary)",
            display: "flex",
          }}
        >
          <Icon icon={BtIconCrossAlt} size={16} />
        </button>
      </div>

      <VerticalSpace size="32" />
    </div>
  );
};
