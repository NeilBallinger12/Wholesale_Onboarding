import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Link } from "@arc-ui/components/Link";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconHeartCare } from "@arc-ui/icons/BtIconHeartCare";
import { BtIconQuestion } from "@arc-ui/icons/BtIconQuestion";
import { BtIconDiscount } from "@arc-ui/icons/BtIconDiscount";

const cards = [
  {
    id: "events",
    icon: BtIconHeartCare,
    title: "Industry events",
    desc: "Whether it's a networking opportunity or a chance to energise yourself on industry seminars, stay in the known with our 'What's On' guide to UK industry events.",
    linkText: "Explore events",
  },
  {
    id: "learning",
    icon: BtIconQuestion,
    title: "Learning",
    desc: "Build your product knowledge and develop new skills with training, guides and resources designed to help your teams sell, support and get more from BT Wholesale products and services.",
    linkText: "Upskill me",
  },
  {
    id: "sales",
    icon: BtIconDiscount,
    title: "Sales and marketing resources",
    desc: "Everything you need to help you from marketing campaigns, sales resources, templates, images and how-to guides.",
    linkText: "Discover more",
  },
];

export const EventsLearning = () => {
  return (
    <div className="btw-page-section btw-section">
      <Heading level="2" size="m">
        Events, learning &amp; resources
      </Heading>

      <VerticalSpace size="32" />

      <div className="btw-card-grid--3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="btw-card btw-card--border"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div className="btw-icon-circle btw-icon-circle--brand">
                <Icon icon={card.icon} size={24} />
              </div>
              <VerticalSpace size="16" />
              <Heading level="3" size="s">
                {card.title}
              </Heading>
              <VerticalSpace size="8" />
              <Text size="m" tone="supporting" elementType="p">
                {card.desc}
              </Text>
            </div>
            <div>
              <VerticalSpace size="16" />
              <Link href="#" size="m">
                {card.linkText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
