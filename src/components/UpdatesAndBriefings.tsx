import { useState } from "react";

import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Rule } from "@arc-ui/components/Rule";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconAlertTriangle } from "@arc-ui/icons/BtIconAlertTriangle";
import { BtIconSpanner } from "@arc-ui/icons/BtIconSpanner";
import { BtIconDocumentArticle } from "@arc-ui/icons/BtIconDocumentArticle";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";
import { BtIconArrowAltRight } from "@arc-ui/icons/BtIconArrowAltRight";

const briefingFilters = [
  "Latest",
  "Urgent Updates",
  "Product Updates",
  "Voice Services",
  "Industry News",
  "Portal Updates",
];

const briefings = [
  {
    id: 1,
    tag: "Urgent",
    title:
      "GPL switching Business Steering Group Industry Comms Bulletin No.1",
    body: "You might already have heard of One Touch Switch – a new process for switching of residential customers' fixed voice and/or broadband services between providers.",
  },
  {
    id: 2,
    tag: "Product Update",
    title: "Withdrawal of Emergency Overrun Service effective 31st March 2025",
    body: "If you haven't started planning a replacement, or you need to discuss your options, we're here to help.",
  },
];

export const UpdatesAndBriefings = () => {
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [activeDot, setActiveDot] = useState(0);

  return (
    <div className="btw-page-section btw-section">
      <div className="btw-two-col">
        {/* ── Left: Important Updates ── */}
        <div
          className="btw-card btw-card--neutral"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Heading level="2" size="m">
              Important updates
            </Heading>
            <ButtonV2
              label="View all updates"
              buttonStyle="secondary"
              size="s"
            />
          </div>

          <VerticalSpace size="24" />

          {/* Update tiles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
            {/* Major outages */}
            <div
              className="btw-card btw-card--border"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "16px",
                borderRadius: "24px",
              }}
            >
              <div className="btw-icon-circle" style={{ width: "32px", height: "32px" }}>
                <Icon icon={BtIconAlertTriangle} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <Text size="s" elementType="p">
                  <span style={{ color: "var(--btw-color-error)", fontSize: "12px", fontWeight: 500 }}>
                    Major service outages
                  </span>
                </Text>
                <Text size="s" elementType="p">
                  <strong>Stay informed</strong>
                </Text>
                <Text size="s" tone="supporting" elementType="p">
                  View the latest outage notifications
                </Text>
              </div>
              <Icon icon={BtIconArrowRight} size={20} />
            </div>

            {/* Planned engineering */}
            <div
              className="btw-card btw-card--border"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "16px",
                borderRadius: "24px",
              }}
            >
              <div className="btw-icon-circle" style={{ width: "32px", height: "32px" }}>
                <Icon icon={BtIconSpanner} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <Text size="s" elementType="p">
                  <span style={{ color: "var(--btw-color-brand-primary)", fontSize: "12px", fontWeight: 500 }}>
                    Planned engineering works
                  </span>
                </Text>
                <Text size="s" elementType="p">
                  <strong>Network changes</strong>
                </Text>
                <Text size="s" tone="supporting" elementType="p">
                  View planned works and maintenance
                </Text>
              </div>
              <Icon icon={BtIconArrowRight} size={20} />
            </div>
          </div>
        </div>

        {/* ── Right: Briefings ── */}
        <div
          className="btw-card btw-card--neutral"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Heading level="2" size="m">
              Briefings
            </Heading>
            <ButtonV2
              label="View all"
              buttonStyle="secondary"
              size="s"
            />
          </div>

          <VerticalSpace size="16" />

          {/* Filter pills — no Arc FilterControl exposed at pill level, using custom btw-filter-pill */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {briefingFilters.map((f) => (
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

          <VerticalSpace size="24" />

          {/* Briefing cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            {briefings.map((b, i) => (
              <div key={b.id}>
                {i > 0 && <Rule />}
                <div
                  className="btw-card btw-card--border"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "24px",
                  }}
                >
                  <div className="btw-icon-circle" style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                    <Icon icon={BtIconDocumentArticle} size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text size="m" elementType="p">
                      <strong>{b.title}</strong>
                    </Text>
                    <VerticalSpace size="4" />
                    <Text size="s" tone="supporting" elementType="p">
                      {b.body}
                    </Text>
                  </div>
                  <div className="btw-icon-circle" style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                    <Icon icon={BtIconArrowAltRight} size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel dots — Arc has no Carousel primitive; custom dots matching Figma */}
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
    </div>
  );
};
