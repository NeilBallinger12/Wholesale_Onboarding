import { useState } from "react";

import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { TextInput } from "@arc-ui/components/TextInput";
import { FormControl } from "@arc-ui/components/FormControl";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Alert } from "@arc-ui/components/Alert";
import { Rule } from "@arc-ui/components/Rule";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconCrossAlt } from "@arc-ui/icons/BtIconCrossAlt";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";
import { BtIconArrowLeft } from "@arc-ui/icons/BtIconArrowLeft";
import { BtIconUserAdd } from "@arc-ui/icons/BtIconUserAdd";
import { BtIconUser } from "@arc-ui/icons/BtIconUser";
import { BtIconUserGroups } from "@arc-ui/icons/BtIconUserGroups";

/* ── Types ──────────────────────────────────────────────────── */
export type ProfileType = "administrator" | "standard";

export type Capability =
  | "sales-ordering"
  | "service-operations"
  | "billing-reporting"
  | "read-only";

export interface TeamUser {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  organisation: string;
  profileType: ProfileType;
  capabilities: Capability[];
  status: "Pending";
  added: string;
}

interface InviteUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: TeamUser) => void;
}

/* ── Stepper ────────────────────────────────────────────────── */
const STEPS = ["Contact details", "Role & permissions", "Review"];

interface StepperProps {
  currentStep: number;
}

const Stepper = ({ currentStep }: StepperProps) => (
  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
    {STEPS.map((label, i) => {
      const isCompleted = i < currentStep;
      const isCurrent = i === currentStep;
      const isLast = i === STEPS.length - 1;

      return (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            flex: isLast ? "0 0 auto" : 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: isCompleted
                  ? "#036c01"
                  : isCurrent
                    ? "#5514b4"
                    : "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {isCompleted ? (
                /* Use a plain SVG tick instead of Icon with unsupported hex color */
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span
                  style={{
                    fontFamily: "BT Curve, sans-serif",
                    fontWeight: 600,
                    fontSize: "12px",
                    color: isCurrent ? "#ffffff" : "#6b6b6b",
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>
            <span
              style={{
                fontFamily: "BT Curve, sans-serif",
                fontSize: "11px",
                fontWeight: isCurrent ? 600 : 400,
                color: isCurrent ? "#5514b4" : isCompleted ? "#036c01" : "#6b6b6b",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>

          {!isLast && (
            <div
              style={{
                flex: 1,
                height: "2px",
                background: isCompleted ? "#036c01" : "#e0e0e0",
                margin: "0 8px",
                marginBottom: "18px",
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

/* ── Capability checkbox item ────────────────────────────────── */
interface CapabilityItemProps {
  id: Capability;
  label: string;
  description: string;
  checked: boolean;
  onChange: (id: Capability, checked: boolean) => void;
}

const CapabilityItem = ({
  id,
  label,
  description,
  checked,
  onChange,
}: CapabilityItemProps) => (
  <label
    htmlFor={`cap-${id}`}
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "14px 16px",
      borderRadius: "8px",
      border: checked
        ? "2px solid #5514b4"
        : "1px solid #d9d9d9",
      background: checked ? "#f9f5ff" : "#ffffff",
      cursor: "pointer",
      transition: "border-color 0.15s ease, background 0.15s ease",
    }}
  >
    {/* Native checkbox — visually styled */}
    <input
      type="checkbox"
      id={`cap-${id}`}
      checked={checked}
      onChange={(e) => onChange(id, e.target.checked)}
      style={{
        width: "18px",
        height: "18px",
        accentColor: "#5514b4",
        flexShrink: 0,
        marginTop: "2px",
        cursor: "pointer",
      }}
    />
    <div style={{ flex: 1 }}>
      <Text size="s" elementType="span">
        <strong>{label}</strong>
      </Text>
      <br />
      <Text size="s" tone="supporting" elementType="span">
        {description}
      </Text>
    </div>
  </label>
);

/* ── Profile type card ──────────────────────────────────────── */
interface ProfileCardProps {
  profileCardType: ProfileType;
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  capabilities: string[];
  icon: string;
}

const ProfileCard = ({
  selected,
  onSelect,
  title,
  description,
  capabilities,
  icon,
}: ProfileCardProps) => (
  <div
    role="radio"
    aria-checked={selected}
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onSelect() : null)}
    style={{
      padding: "20px",
      borderRadius: "12px",
      border: selected ? "2px solid #5514b4" : "1px solid #d9d9d9",
      background: selected ? "#f9f5ff" : "#ffffff",
      cursor: "pointer",
      transition: "border-color 0.15s ease, background 0.15s ease",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: selected ? "#5514b4" : "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.15s ease",
        }}
      >
        <Icon icon={icon} size={20} color={selected ? "brand-alt" : "auto"} />
      </div>
      <div>
        <Text size="m" elementType="span">
          <strong>{title}</strong>
        </Text>
        <br />
        <Text size="s" tone="supporting" elementType="span">
          {description}
        </Text>
      </div>
      {/* Radio dot */}
      <div
        style={{
          marginLeft: "auto",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: selected ? "6px solid #5514b4" : "2px solid #ababab",
          background: "#ffffff",
          flexShrink: 0,
          transition: "border 0.15s ease",
        }}
      />
    </div>

    <Rule />
    <VerticalSpace size="12" />

    <ul
      style={{
        margin: 0,
        padding: "0 0 0 18px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      {capabilities.map((cap) => (
        <li
          key={cap}
          style={{
            fontFamily: "BT Curve, sans-serif",
            fontSize: "13px",
            color: "#434343",
            lineHeight: "18px",
          }}
        >
          {cap}
        </li>
      ))}
    </ul>
  </div>
);

/* ── Review row ─────────────────────────────────────────────── */
const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "10px 0",
      borderBottom: "1px solid #f0f0f0",
      gap: "16px",
    }}
  >
    <Text size="s" tone="supporting" elementType="span">
      {label}
    </Text>
    <Text size="s" elementType="span" align="right">
      <strong>{value || "—"}</strong>
    </Text>
  </div>
);

/* ── Status badge ───────────────────────────────────────────── */
const PendingBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 10px",
      borderRadius: "1000px",
      background: "#fff8e1",
      color: "#7a4f00",
      fontSize: "12px",
      fontWeight: 500,
    }}
  >
    Pending invite
  </span>
);

/* ── Capability label map ─────────────────────────────────────── */
const capabilityLabels: Record<Capability, string> = {
  "sales-ordering": "Sales & Ordering",
  "service-operations": "Service Operations",
  "billing-reporting": "Billing & Reporting",
  "read-only": "Read only",
};

/* ── Main drawer component ───────────────────────────────────── */
export const InviteUserDrawer = ({
  isOpen,
  onClose,
  onUserAdded,
}: InviteUserDrawerProps) => {
  const [step, setStep] = useState(0);

  // Step 1 fields
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");

  // Step 2 fields
  const [profileType, setProfileType] = useState<ProfileType>("administrator");
  const [capabilities, setCapabilities] = useState<Capability[]>([]);

  // Added state
  const [justAdded, setJustAdded] = useState(false);

  const resetForm = () => {
    setStep(0);
    setFirstName("");
    setSurname("");
    setEmail("");
    setPhone("");
    setOrganisation("");
    setProfileType("administrator");
    setCapabilities([]);
    setJustAdded(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCapabilityChange = (id: Capability, checked: boolean) => {
    setCapabilities((prev) =>
      checked ? [...prev, id] : prev.filter((c) => c !== id),
    );
  };

  const canProceedStep1 =
    firstName.trim() !== "" &&
    surname.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    organisation.trim() !== "";

  const canProceedStep2 =
    profileType === "administrator" || capabilities.length > 0;

  const handleConfirmUser = () => {
    const newUser: TeamUser = {
      id: crypto.randomUUID(),
      firstName,
      surname,
      email,
      phone,
      organisation,
      profileType,
      capabilities: profileType === "administrator" ? [] : capabilities,
      status: "Pending",
      added: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    onUserAdded(newUser);
    setJustAdded(true);
  };

  const handleAddAnother = () => {
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 999,
        }}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Invite user"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "480px",
          maxWidth: "100vw",
          background: "#ffffff",
          boxShadow: "-4px 0 32px rgba(0,0,0,0.16)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 24px 20px",
            borderBottom: "1px solid #e8e8e8",
            flexShrink: 0,
          }}
        >
          <Heading level="2" size="s">
            Invite user
          </Heading>
          <button
            onClick={handleClose}
            aria-label="Close drawer"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              color: "#2a2a2a",
            }}
          >
            <Icon icon={BtIconCrossAlt} size={20} />
          </button>
        </div>

        {/* Stepper */}
        {!justAdded && (
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid #f0f0f0",
              flexShrink: 0,
            }}
          >
            <Stepper currentStep={step} />
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>

          {/* STEP 1: Contact details */}
          {!justAdded && step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <Heading level="3" size="xs">Contact details</Heading>
                <VerticalSpace size="4" />
                <Text size="s" tone="supporting" elementType="p">
                  Enter the contact details of the person you'd like to invite.
                </Text>
              </div>

              <FormControl requirementStatus="not-applicable" label="First name" htmlFor="invite-first-name">
                <TextInput
                  id="invite-first-name"
                  label=""
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </FormControl>

              <FormControl requirementStatus="not-applicable" label="Surname" htmlFor="invite-surname">
                <TextInput
                  id="invite-surname"
                  label=""
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </FormControl>

              <FormControl requirementStatus="not-applicable" label="Email address" htmlFor="invite-email">
                <TextInput
                  id="invite-email"
                  label=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl requirementStatus="not-applicable" label="Phone number" htmlFor="invite-phone">
                <TextInput
                  id="invite-phone"
                  label=""
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>

              <FormControl requirementStatus="not-applicable" label="Organisation" htmlFor="invite-organisation">
                <TextInput
                  id="invite-organisation"
                  label=""
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                />
              </FormControl>
            </div>
          )}

          {/* STEP 2: Role & permissions */}
          {!justAdded && step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <Heading level="3" size="xs">Role &amp; permissions</Heading>
                <VerticalSpace size="4" />
                <Text size="s" tone="supporting" elementType="p">
                  Choose the access level for this user.
                </Text>
              </div>

              <div
                role="radiogroup"
                aria-label="Profile type"
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <ProfileCard
                  profileCardType="administrator"
                  selected={profileType === "administrator"}
                  onSelect={() => setProfileType("administrator")}
                  icon={BtIconUserGroups}
                  title="Partner Administrator"
                  description="Runs this organisation: users, roles, settings and billing."
                  capabilities={[
                    "Manage organisation settings",
                    "Create and manage Partner Organisations",
                    "Create, edit and remove users",
                    "Assign roles and capabilities",
                    "Manage product entitlements",
                    "Billing, invoices and reporting",
                  ]}
                />

                <ProfileCard
                  profileCardType="standard"
                  selected={profileType === "standard"}
                  onSelect={() => setProfileType("standard")}
                  icon={BtIconUser}
                  title="Standard User"
                  description="Customise the capabilities this user has access to."
                  capabilities={[
                    "Sales & Ordering",
                    "Service Operations",
                    "Billing & Reporting",
                    "Read only",
                  ]}
                />
              </div>

              {/* Capabilities — only when Standard User selected */}
              {profileType === "standard" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "16px",
                    background: "#f7f5ff",
                    borderRadius: "8px",
                  }}
                >
                  <Text size="s" elementType="p">
                    <strong>Select capabilities</strong>
                  </Text>
                  <Text size="s" tone="supporting" elementType="p">
                    Choose what this user can access and do in the portal.
                  </Text>
                  <VerticalSpace size="4" />
                  <CapabilityItem
                    id="sales-ordering"
                    label="Sales & Ordering"
                    description="Places and manages orders, including hardware."
                    checked={capabilities.includes("sales-ordering")}
                    onChange={handleCapabilityChange}
                  />
                  <CapabilityItem
                    id="service-operations"
                    label="Service Operations"
                    description="Handles faults, diagnostics and support tickets."
                    checked={capabilities.includes("service-operations")}
                    onChange={handleCapabilityChange}
                  />
                  <CapabilityItem
                    id="billing-reporting"
                    label="Billing & Reporting"
                    description="Views invoices, raises billing queries and exports reports."
                    checked={capabilities.includes("billing-reporting")}
                    onChange={handleCapabilityChange}
                  />
                  <CapabilityItem
                    id="read-only"
                    label="Read only"
                    description="Can view but never change anything."
                    checked={capabilities.includes("read-only")}
                    onChange={handleCapabilityChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Review */}
          {!justAdded && step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <Heading level="3" size="xs">Review</Heading>
                <VerticalSpace size="4" />
                <Text size="s" tone="supporting" elementType="p">
                  Check the details before sending the invite.
                </Text>
              </div>

              {/* Summary card */}
              <div
                style={{
                  background: "#f7f7f7",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                {/* Avatar + name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#e8d5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#5514b4",
                    }}
                  >
                    {firstName[0]}{surname[0]}
                  </div>
                  <div>
                    <Text size="m" elementType="span">
                      <strong>{firstName} {surname}</strong>
                    </Text>
                    <br />
                    <PendingBadge />
                  </div>
                </div>

                <Rule />
                <VerticalSpace size="4" />

                <ReviewRow label="Email" value={email} />
                <ReviewRow label="Phone" value={phone} />
                <ReviewRow label="Organisation" value={organisation} />
                <ReviewRow
                  label="Profile type"
                  value={
                    profileType === "administrator"
                      ? "Partner Administrator"
                      : "Standard User"
                  }
                />
                {profileType === "standard" && capabilities.length > 0 && (
                  <ReviewRow
                    label="Capabilities"
                    value={capabilities.map((c) => capabilityLabels[c]).join(", ")}
                  />
                )}
              </div>

              {/* Invite alert */}
              <Alert
                heading="Invitation will be sent"
                headingLevel="3"
                description="An invitation email will be sent. The user gains access once they accept and set a password."
              />
            </div>
          )}

          {/* POST-SUBMIT: Success state */}
          {justAdded && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                paddingTop: "40px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "#e6f4e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="#036c01" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <Heading level="2" size="s">
                Invite sent
              </Heading>

              <Text size="m" tone="supporting" elementType="p">
                <strong>{firstName} {surname}</strong> has been added to your
                team. They'll receive an invitation email and can set their
                password to get started.
              </Text>

              <Alert
                heading="Invitation sent"
                headingLevel="3"
                description="An invitation email will be sent. The user gains access once they accept and set a password."
              />

              <VerticalSpace size="8" />

              <ButtonV2
                label="Add another user"
                buttonStyle="primary"
                size="m"
                icon={BtIconUserAdd}
                iconPosition="beforeText"
                onClick={handleAddAnother}
              />

              <ButtonV2
                label="Close"
                buttonStyle="secondary"
                size="m"
                onClick={handleClose}
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!justAdded && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #e8e8e8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              background: "#ffffff",
            }}
          >
            {step > 0 ? (
              <ButtonV2
                label="Back"
                buttonStyle="secondary"
                size="m"
                icon={BtIconArrowLeft}
                iconPosition="beforeText"
                onClick={() => setStep((s) => s - 1)}
              />
            ) : (
              <ButtonV2
                label="Cancel"
                buttonStyle="secondary"
                size="m"
                onClick={handleClose}
              />
            )}

            {step < 2 ? (
              <div style={{ opacity: (step === 0 ? !canProceedStep1 : !canProceedStep2) ? 0.5 : 1 }}>
                <ButtonV2
                  label="Continue"
                  buttonStyle="primary"
                  size="m"
                  icon={BtIconArrowRight}
                  iconPosition="afterText"
                  onClick={() => {
                    if (step === 0 && !canProceedStep1) return;
                    if (step === 1 && !canProceedStep2) return;
                    setStep((s) => s + 1);
                  }}
                />
              </div>
            ) : (
              <ButtonV2
                label="Send invite"
                buttonStyle="primary"
                size="m"
                icon={BtIconUserAdd}
                iconPosition="beforeText"
                onClick={handleConfirmUser}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
