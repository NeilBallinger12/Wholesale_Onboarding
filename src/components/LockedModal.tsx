import { Modal } from "@arc-ui/components/Modal";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Rule } from "@arc-ui/components/Rule";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconTick } from "@arc-ui/icons/BtIconTick";
import { BtIconLocked } from "@arc-ui/icons/BtIconLocked";
import { BtIconClock } from "@arc-ui/icons/BtIconClock";

import { type Product } from "../data/products";

type ChecklistState = "done" | "needed";

interface ChecklistItem {
  /** Icon data-URI */
  glyph: string;
  /** Step label */
  label: string;
  /** Supporting meta text */
  meta: string;
  /** Completion state */
  state: ChecklistState;
}

const getChecklist = (product: Product): ChecklistItem[] => [
  {
    glyph: BtIconTick,
    label: "Company details",
    meta: "Verified 10 Mar 2026",
    state: "done",
  },
  {
    glyph: BtIconTick,
    label: "Credit check",
    meta: "Passed 10 Mar 2026",
    state: "done",
  },
  {
    glyph: BtIconTick,
    label: "Billing account",
    meta: "Active",
    state: "done",
  },
  {
    glyph: BtIconLocked,
    label: `${product.name} product schedule`,
    meta: "Signature required",
    state: "needed",
  },
  ...(product.id === "ethernet" || product.id === "dia"
    ? [
        {
          glyph: BtIconLocked,
          label: "Technical accreditation call",
          meta: "30-minute call with BT specialist",
          state: "needed" as ChecklistState,
        },
      ]
    : []),
];

interface LockedModalProps {
  /** The product being unlocked, or null when closed */
  product: Product | null;
  /** Close handler */
  onClose: () => void;
  /** Called after access request is submitted */
  onRequestSubmitted: (product: Product) => void;
}

export const LockedModal = ({
  product,
  onClose,
  onRequestSubmitted,
}: LockedModalProps) => {
  if (!product) return null;

  const checklist = getChecklist(product);
  const sla =
    product.id === "ethernet" || product.id === "dia"
      ? "10–15 working days"
      : "5 working days";

  const handleRequest = () => {
    onRequestSubmitted(product);
    onClose();
  };

  return (
    <Modal
      title={`Unlock ${product.name}`}
      isOpen={true}
      onRequestClose={onClose}
      size="m"
      actions={[
        { label: "Enquire first", onClick: onClose, buttonStyle: "tertiary" },
        { label: "Request access", onClick: handleRequest },
      ]}
    >
      <Text size="s" tone="supporting" elementType="p">
        We reuse your company, credit and billing details. Only product-specific
        steps remain.
      </Text>

      <VerticalSpace size="20" />

      {checklist.map((item, i) => (
        <div key={item.label}>
          {i > 0 && <Rule />}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: item.state === "done" ? "#e6f4ea" : "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <Icon icon={item.glyph} size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <Text size="s" elementType="span">
                {item.label}
              </Text>
              <Text size="s" tone="muted" elementType="p">
                {item.meta}
              </Text>
            </div>
            <Text size="s" tone="muted">
              {item.state === "done" ? "✓ Complete" : "Required"}
            </Text>
          </div>
        </div>
      ))}

      <VerticalSpace size="16" />
      <Text size="s" tone="supporting" elementType="p">
        Typical enablement: <strong>{sla}</strong>
      </Text>
    </Modal>
  );
};

interface PendingModalProps {
  /** The product being tracked, or null when closed */
  product: Product | null;
  /** Close handler */
  onClose: () => void;
}

export const PendingModal = ({ product, onClose }: PendingModalProps) => {
  if (!product) return null;

  const progressSteps = [
    { label: "Request received", done: true, current: false },
    { label: "Schedule countersigned", done: false, current: true },
    { label: "Ordering unlocked in this portal", done: false, current: false },
  ];

  return (
    <Modal
      title={`${product.name} — Access requested`}
      isOpen={true}
      onRequestClose={onClose}
      size="m"
      actions={[{ label: "Close", onClick: onClose }]}
    >
      <Text size="s" elementType="p">
        Submitted today. Your wholesale manager reviews the product schedule —
        nothing else is needed from you.
      </Text>

      <VerticalSpace size="24" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {progressSteps.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              paddingBottom: i < progressSteps.length - 1 ? "0" : undefined,
            }}
          >
            {/* Step dot + connector */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: step.done
                    ? "#5514b4"
                    : step.current
                      ? "white"
                      : "#ddd",
                  border: `2px solid ${step.done || step.current ? "#5514b4" : "#ddd"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {step.done && (
                  <Icon icon={BtIconTick} size={10} />
                )}
                {step.current && (
                  <Icon icon={BtIconClock} size={10} />
                )}
              </div>
              {i < progressSteps.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    height: "32px",
                    background: step.done ? "#5514b4" : "#ddd",
                  }}
                />
              )}
            </div>

            <div style={{ paddingTop: "1px", paddingBottom: "32px" }}>
              <Text size="s" elementType="span">
                Step {i + 1} {step.label}
              </Text>
              {step.current && (
                <Text size="s" tone="muted" elementType="p">
                  In progress
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
