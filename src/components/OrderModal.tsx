import { useState } from "react";

import { Modal } from "@arc-ui/components/Modal";
import {
  ProgressStepper,
  ProgressStepperItem,
} from "@arc-ui/components/ProgressStepper";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Surface } from "@arc-ui/components/Surface";
import { Rule } from "@arc-ui/components/Rule";

type StepId = "customer" | "plan" | "review" | "confirm";

interface Step {
  id: StepId;
  label: string;
}

const steps: Step[] = [
  { id: "customer", label: "End customer" },
  { id: "plan", label: "Plan" },
  { id: "review", label: "Review" },
  { id: "confirm", label: "Confirm" },
];

const stepIndex = (s: StepId) => steps.findIndex((x) => x.id === s);

interface PlanOption {
  name: string;
  detail: string;
  price: string;
}

const plans: PlanOption[] = [
  {
    name: "DV Essentials",
    detail: "Up to 10 channels · Basic SIP",
    price: "£4.50 / channel / month",
  },
  {
    name: "DV Professional",
    detail: "Up to 50 channels · Full SIP",
    price: "£3.80 / channel / month",
  },
  {
    name: "DV Enterprise",
    detail: "Unlimited channels · SIP + Hosted",
    price: "£2.90 / channel / month",
  },
];

const reviewRows = [
  { k: "End customer", v: "Harper & Vine Ltd" },
  { k: "Install postcode", v: "M1 4WB" },
  { k: "Channels", v: "10" },
  { k: "Plan", v: "DV Professional" },
  { k: "Monthly cost", v: "£38.00" },
];

interface OrderModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
}

export const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
  const [currentStep, setCurrentStep] = useState<StepId>("customer");
  const [selectedPlan, setSelectedPlan] = useState<string>("DV Professional");
  const [placed, setPlaced] = useState(false);

  const currentIndex = stepIndex(currentStep);

  const handleNext = () => {
    const next = steps[currentIndex + 1];
    if (next) {
      setCurrentStep(next.id);
    } else {
      setPlaced(true);
    }
  };

  const handleBack = () => {
    const prev = steps[currentIndex - 1];
    if (prev) setCurrentStep(prev.id);
  };

  const handleClose = () => {
    setCurrentStep("customer");
    setPlaced(false);
    onClose();
  };

  const backAction =
    currentIndex > 0
      ? [
          {
            label: "Back",
            onClick: handleBack,
            buttonStyle: "tertiary" as const,
          },
        ]
      : [];

  const primaryAction = {
    label: placed
      ? "Done"
      : currentIndex < steps.length - 1
        ? "Next"
        : "Place order",
    onClick: placed ? handleClose : handleNext,
  };

  return (
    <Modal
      title={placed ? "Order placed" : "Digital Voice — New order"}
      isOpen={isOpen}
      onRequestClose={handleClose}
      size="l"
      actions={[...backAction, primaryAction]}
    >
      {placed ? (
        <ConfirmationStep />
      ) : (
        <>
          <ProgressStepper aria-label="Order progress">
            {steps.map((step, i) => {
              const status =
                i < currentIndex
                  ? "completed"
                  : i === currentIndex
                    ? "current"
                    : "todo";
              return (
                <ProgressStepperItem
                  key={step.id}
                  title={step.label}
                  status={status}
                />
              );
            })}
          </ProgressStepper>

          <VerticalSpace size="24" />

          {currentStep === "customer" && <CustomerStep />}
          {currentStep === "plan" && (
            <PlanStep
              plans={plans}
              selected={selectedPlan}
              onSelect={setSelectedPlan}
            />
          )}
          {(currentStep === "review" || currentStep === "confirm") && (
            <ReviewStep rows={reviewRows} />
          )}
        </>
      )}
    </Modal>
  );
};

/* ── Step sub-components ──────────────────────────────────────── */

const CustomerStep = () => (
  <Surface background="light-neutral-01" padding="24">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
      }}
    >
      <div>
        <Text size="s" tone="supporting">
          End customer
        </Text>
        <Text size="m">Harper &amp; Vine Ltd</Text>
      </div>
      <div>
        <Text size="s" tone="supporting">
          Install postcode
        </Text>
        <Text size="m">M1 4WB</Text>
      </div>
      <div>
        <Text size="s" tone="supporting">
          Channels
        </Text>
        <Text size="m">10</Text>
      </div>
    </div>
    <VerticalSpace size="16" />
    <Rule />
    <VerticalSpace size="16" />
    <Text size="s" tone="supporting" elementType="p">
      Billing account, credit terms and legal entity are pre-filled from your BT
      Wholesale onboarding.
    </Text>
  </Surface>
);

interface PlanStepProps {
  plans: PlanOption[];
  selected: string;
  onSelect: (name: string) => void;
}

const PlanStep = ({ plans, selected, onSelect }: PlanStepProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {plans.map((plan) => (
      <button
        key={plan.name}
        onClick={() => onSelect(plan.name)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderRadius: "8px",
          border: `2px solid ${selected === plan.name ? "#5514b4" : "#ddd"}`,
          background: selected === plan.name ? "#f3eeff" : "white",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
        aria-pressed={selected === plan.name}
      >
        <div>
          <Text size="m" elementType="span">
            <strong>{plan.name}</strong>
          </Text>
          <Text size="s" tone="supporting" elementType="p">
            {plan.detail}
          </Text>
        </div>
        <Text size="m" elementType="span">
          {plan.price}
        </Text>
      </button>
    ))}
  </div>
);

interface ReviewStepProps {
  rows: { k: string; v: string }[];
}

const ReviewStep = ({ rows }: ReviewStepProps) => (
  <Surface background="light-neutral-01" padding="24">
    {rows.map((row, i) => (
      <div key={row.k}>
        {i > 0 && <Rule />}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <Text size="s" tone="supporting">
            {row.k}
          </Text>
          <Text size="s">{row.v}</Text>
        </div>
      </div>
    ))}
  </Surface>
);

const ConfirmationStep = () => (
  <Surface background="light-neutral-01" padding="24">
    <Heading level="3" size="m">
      Order DV-00184 placed
    </Heading>
    <VerticalSpace size="8" />
    <Text size="m" elementType="p">
      Provisioning starts today. Estimated activation 24 Sep 2026. You'll see it
      under Your orders and in Faults once live.
    </Text>
  </Surface>
);
