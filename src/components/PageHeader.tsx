import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconSearch } from "@arc-ui/icons/BtIconSearch";
import { BtIconSwitch } from "@arc-ui/icons/BtIconSwitch";

export const PageHeader = () => {
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
            Hello John,
          </Heading>
          <VerticalSpace size="8" />
          <Text size="m" elementType="p">
            <span style={{ color: "var(--btw-color-text-secondary)" }}>
              Giacom:{" "}
            </span>
            <strong style={{ color: "var(--btw-color-text-secondary)" }}>
              ACC-00872341
            </strong>
          </Text>
        </div>

        {/* Right: search + switch account */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {/* Search pill — custom styled to match Figma rounded search bar */}
          <label className="btw-search" style={{ cursor: "text" }} aria-label="Search">
            <Icon icon={BtIconSearch} size={24} />
            <input type="search" placeholder="Search" aria-label="Search" />
          </label>

          {/* Switch account — ButtonV2 secondary with icon, matches Figma style */}
          <ButtonV2
            label="Switch Account"
            buttonStyle="secondary"
            size="m"
            icon={BtIconSwitch}
            iconPosition="beforeText"
          />
        </div>
      </div>
    </div>
  );
};
