import { useState } from "react";

import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Link } from "@arc-ui/components/Link";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconCrossAlt } from "@arc-ui/icons/BtIconCrossAlt";

export const GettingStartedBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="btw-page-section">
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
        {/* Video thumbnail with play button */}
        <button
          aria-label="Watch the Getting to know BT Wholesale video"
          style={{
            width: "160px",
            height: "100px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #2a1c4a 0%, #5514b4 100%)",
            flexShrink: 0,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid overlay for video feel */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 15px), repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 15px)",
              pointerEvents: "none",
            }}
          />
          {/* Play button circle */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            {/* SVG play triangle */}
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
              <path d="M2 1.5L14 9L2 16.5V1.5Z" fill="#5514b4" />
            </svg>
          </div>
          {/* Duration label */}
          <span
            style={{
              position: "absolute",
              bottom: "8px",
              right: "10px",
              fontFamily: "BT Curve, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: "#ffffff",
              background: "rgba(0,0,0,0.5)",
              padding: "1px 5px",
              borderRadius: "3px",
            }}
          >
            3:42
          </span>
        </button>

        {/* Text content */}
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <Heading level="2" size="m">
            Getting to know BT Wholesale
          </Heading>
          <VerticalSpace size="8" />
          <Text size="m" tone="supporting" elementType="p">
            Watch a short introduction to your new portal — from placing orders to helping your
            team market BT products to your customers.
          </Text>
          <VerticalSpace size="16" />
          <Link href="#" size="m">
            Watch the overview video
          </Link>
        </div>

        {/* Dismiss */}
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
