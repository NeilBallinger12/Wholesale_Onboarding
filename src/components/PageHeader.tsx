import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconSearch } from "@arc-ui/icons/BtIconSearch";

interface PageHeaderProps {
  /** Billing account number — shown in subline once billing is set up */
  billingAccountNumber?: string;
}

export const PageHeader = ({ billingAccountNumber }: PageHeaderProps) => {
  return (
    <div className="btw-page-section">
      <div
        style={{
          paddingTop: "72px",
          paddingBottom: "64px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        {/* Left: greeting */}
        <div style={{ maxWidth: "900px", flex: "1 1 480px" }}>
          <Heading level="1" size="xl">
            Welcome John,
          </Heading>
          <VerticalSpace size="8" />
          {billingAccountNumber ? (
            <Text size="s" elementType="p">
              <span
                style={{
                  fontFamily: "BT Curve, sans-serif",
                  fontWeight: 400,
                  color: "var(--btw-color-text-secondary)",
                }}
              >
                Billing account: <strong>{billingAccountNumber}</strong>
              </span>
            </Text>
          ) : (
            <Text size="l" elementType="p">
              <span
                style={{
                  fontFamily: "BT Curve, sans-serif",
                  fontWeight: 400,
                  color: "var(--btw-color-brand-primary)",
                }}
              >
                Let's get Giacom set up and ready to trade.
              </span>
            </Text>
          )}
        </div>

        {/* Right: search only */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <label
            className="btw-search"
            style={{ cursor: "text" }}
            aria-label="Search"
          >
            <Icon icon={BtIconSearch} size={24} />
            <input type="search" placeholder="Search" aria-label="Search" />
          </label>
        </div>
      </div>
    </div>
  );
};
