import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Link } from "@arc-ui/components/Link";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconChatTyping } from "@arc-ui/icons/BtIconChatTyping";

export const HelpUsImprove = () => {
  return (
    <div className="btw-page-section">
      <div
        className="btw-card btw-card--border"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
          padding: "24px",
          borderRadius: "var(--btw-radius-card)",
        }}
      >
        {/* Icon */}
        <div
          className="btw-icon-circle"
          style={{ width: "64px", height: "64px", flexShrink: 0 }}
        >
          <Icon icon={BtIconChatTyping} size={36} />
        </div>

        {/* Text */}
        <div style={{ flex: "1 1 300px" }}>
          <Heading level="2" size="s">
            Help us improve
          </Heading>
          <VerticalSpace size="4" />
          <Text size="m" tone="supporting" elementType="p">
            Have a suggestion that will make your working day easier? Share it
            with us via the form below.
          </Text>
          <VerticalSpace size="8" />
          <Link href="#" size="m">
            Provide your feedback
          </Link>
        </div>
      </div>

      <VerticalSpace size="48" />
    </div>
  );
};
