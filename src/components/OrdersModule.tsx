import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Rule } from "@arc-ui/components/Rule";
import { Link } from "@arc-ui/components/Link";
import { Tooltip } from "@arc-ui/components/Tooltip";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconDocumentDownload } from "@arc-ui/icons/BtIconDocumentDownload";
import { BtIconAlertTriangle } from "@arc-ui/icons/BtIconAlertTriangle";

/* ── Status legend row ──────────────────────────────────────── */
interface StatusRowProps {
  color: string;
  label: string;
  count: number;
}

const StatusRow = ({ color, label, count }: StatusRowProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <Text size="s" elementType="span">
        <strong>{label}</strong>
      </Text>
    </div>
    <Text size="s" tone="supporting">
      ({count})
    </Text>
  </div>
);

/* ── Empty donut placeholder ────────────────────────────────── */
const EmptyDonut = () => (
  <svg
    width="136"
    height="136"
    viewBox="0 0 136 136"
    aria-hidden="true"
  >
    <circle
      cx="68"
      cy="68"
      r="50"
      fill="none"
      stroke="#e8e8e8"
      strokeWidth="20"
    />
    <text
      x="68"
      y="62"
      textAnchor="middle"
      fontFamily="BT Curve, sans-serif"
      fontWeight="500"
      fontSize="28"
      fill="#2a2a2a"
    >
      0
    </text>
    <text
      x="68"
      y="80"
      textAnchor="middle"
      fontFamily="BT Curve, sans-serif"
      fontWeight="400"
      fontSize="13"
      fill="#6b6b6b"
    >
      orders
    </text>
  </svg>
);

/* ── Main module ────────────────────────────────────────────── */
export const OrdersModule = () => {
  return (
    <div className="btw-page-section">
      {/* Outer card — grey #F7F7F7, 32px radius, 32px padding, full width */}
      <div
        style={{
          background: "#f7f7f7",
          borderRadius: "32px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Heading level="2" size="m">
            Your orders
          </Heading>
          <ButtonV2
            label="Download report"
            buttonStyle="tertiary"
            size="s"
            icon={BtIconDocumentDownload}
            iconPosition="beforeText"
          />
        </div>

        {/* Core content — Total orders (50%) + Latest orders (50%) */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* Total orders — 50% */}
          <div
            style={{
              flex: "1 1 0",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              minWidth: 0,
            }}
          >
            {/* Count pill */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: "BT Curve, sans-serif",
                  fontWeight: 500,
                  fontSize: "32px",
                  lineHeight: 1,
                  color: "#000000",
                }}
              >
                0
              </span>
              <Text size="m" elementType="span">
                <strong>Orders</strong>
              </Text>
            </div>

            {/* Donut + legend */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <EmptyDonut />

              {/* Legend */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <StatusRow color="#FFA200" label="In progress" count={0} />
                <StatusRow color="#DA020F" label="Rejected" count={0} />
                <StatusRow color="#C8C8C8" label="Draft orders" count={0} />
                <StatusRow color="#088003" label="Completed" count={0} />
              </div>
            </div>
          </div>

          {/* Latest orders empty — 50% */}
          <div
            style={{
              flex: "1 1 0",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              minWidth: 0,
            }}
          >
            {/* Alarm illustration placeholder */}
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                background: "#f7f7f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-hidden="true"
            >
              <Icon icon={BtIconAlertTriangle} size={40} />
            </div>

            <Heading level="3" size="s" align="center">
              Start ordering
            </Heading>

            <Text size="s" tone="supporting" elementType="p" align="center">
              Once you've placed an order, you'll be able to track progress and
              manage updates here.
            </Text>

            <Link href="#" size="s">
              Learn more about ordering
            </Link>
          </div>
        </div>

        <Rule />

        {/* Footer CTA — disabled with tooltip */}
        <div>
          <Tooltip
            title="Not approved to order"
            supportingCopy="You must complete your company's onboarding before you can place an order."
            side="top"
            align="start"
          >
            {/* Wrapping span needed because disabled buttons don't fire mouse events */}
            <span style={{ display: "inline-block", cursor: "not-allowed" }}>
              <div style={{ pointerEvents: "none", opacity: 0.5 }}>
                <ButtonV2
                  label="Place your first order"
                  buttonStyle="primary"
                  size="m"
                />
              </div>
            </span>
          </Tooltip>
        </div>
      </div>

      <VerticalSpace size="48" />
    </div>
  );
};
