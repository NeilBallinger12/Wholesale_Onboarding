import { useState } from "react";

import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Link } from "@arc-ui/components/Link";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconSpeedFastest } from "@arc-ui/icons/BtIconSpeedFastest";
import { BtIconHometown } from "@arc-ui/icons/BtIconHometown";
import { BtIconBroadband } from "@arc-ui/icons/BtIconBroadband";
import { BtIconCloudPhone } from "@arc-ui/icons/BtIconCloudPhone";

const appFilters = [
  "All",
  "Recently used",
  "Orders & faults",
  "Admin & billing",
  "Voice services",
  "Tools",
  "Documentation",
];

const apps = [
  {
    id: "diagnostics",
    icon: BtIconSpeedFastest,
    title: "20C Knowledge based diagnostics",
    desc: "Combines network tests and service data in one place to help identify faults, validate services, and diagnostics.",
  },
  {
    id: "address",
    icon: BtIconHometown,
    title: "Openreach address search",
    desc: "Search Openreach address records to find matching addresses, support broadband orders, and view key address attributes.",
  },
  {
    id: "pricelist",
    icon: BtIconBroadband,
    title: "Broadband One wholesale standard price list",
    desc: "Provides access to the Broadband One Wholesale Standard Price List.",
  },
  {
    id: "cloudvoice",
    icon: BtIconCloudPhone,
    title: "Cloud Voice",
    desc: "A single, easy-to-use package for voice, video, meetings and messaging tools.",
  },
];

export const UsefulApps = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDot, setActiveDot] = useState(0);

  return (
    <div
      className="btw-section"
      style={{ background: "var(--btw-color-surface-neutral)" }}
    >
      <div className="btw-page-section">
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ maxWidth: "683px" }}>
            <Heading level="2" size="m">
              Useful apps
            </Heading>
            <VerticalSpace size="8" />
            <Text size="m" tone="supporting" elementType="p">
              Everything you need in one place. Browse, search, and launch the
              tools that help you work faster and support customers more
              effectively.
            </Text>
          </div>
          <ButtonV2
            label="View all apps"
            buttonStyle="secondary"
            size="m"
          />
        </div>

        <VerticalSpace size="24" />

        {/* Filter pills — custom btw-filter-pill (no direct Arc component for pill filters) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {appFilters.map((f) => (
            <button
              key={f}
              className={`btw-filter-pill${activeFilter === f ? " btw-filter-pill--active" : ""}`}
              onClick={() => setActiveFilter(f)}
              aria-pressed={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </div>

        <VerticalSpace size="32" />

        {/* App cards grid */}
        <div className="btw-card-grid">
          {apps.map((app) => (
            <div
              key={app.id}
              className="btw-card btw-card--border"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="btw-icon-circle btw-icon-circle--brand">
                  <Icon icon={app.icon} size={24} />
                </div>
                <VerticalSpace size="16" />
                <Heading level="3" size="s">
                  {app.title}
                </Heading>
                <VerticalSpace size="8" />
                <Text size="m" tone="supporting" elementType="p">
                  {app.desc}
                </Text>
              </div>
              <div>
                <VerticalSpace size="16" />
                <Link href="#" size="m">
                  Open app
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel dots */}
        <div className="btw-carousel-dots">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              aria-label={`Page ${i + 1}`}
              className={`btw-carousel-dot${activeDot === i ? " btw-carousel-dot--active" : ""}`}
              onClick={() => setActiveDot(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
