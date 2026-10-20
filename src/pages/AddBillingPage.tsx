import { useState } from "react";

import {
  NavigationHeader,
  NavigationHeaderAction,
  NavigationHeaderActionBar,
  type NavigationHeaderNavLinkItem,
} from "@arc-ui/components/NavigationHeader";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { TextInput } from "@arc-ui/components/TextInput";
import { FormControl } from "@arc-ui/components/FormControl";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Alert } from "@arc-ui/components/Alert";
import { Badge } from "@arc-ui/components/Badge";
import { Spinner } from "@arc-ui/components/Spinner";
import { Rule } from "@arc-ui/components/Rule";
import { Icon } from "@arc-ui/components/Icon";
import {
  SiteFooterV2,
  SiteFooterV2Main,
  SiteFooterV2ItemGroup,
  SiteFooterV2Item,
  SiteFooterV2Utility,
} from "@arc-ui/components/SiteFooterV2";

import { BtIconQuestion } from "@arc-ui/icons/BtIconQuestion";
import { BtIconUser } from "@arc-ui/icons/BtIconUser";
import { BtIconArrowLeft } from "@arc-ui/icons/BtIconArrowLeft";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";
import { BtIconAdd } from "@arc-ui/icons/BtIconAdd";
import { BtIconBin } from "@arc-ui/icons/BtIconBin";
import { BtIconSearch } from "@arc-ui/icons/BtIconSearch";
import { BtIconInfo } from "@arc-ui/icons/BtIconInfo";

/* ── Types ──────────────────────────────────────────────────── */
type PageState = "form" | "loading" | "submitted";

interface BillingContact {
  id: string;
  contactName: string;
  phoneNumber: string;
  buildingStreet: string;
  town: string;
  county: string;
  postcode: string;
  postcodeInput: string;
  postcodeSearched: boolean;
}

type ContactErrors = Partial<Record<keyof Omit<BillingContact, "id" | "postcodeInput" | "postcodeSearched">, string>>;

const blankContact = (id: string): BillingContact => ({
  id,
  contactName: "",
  phoneNumber: "",
  buildingStreet: "",
  town: "",
  county: "",
  postcode: "",
  postcodeInput: "",
  postcodeSearched: false,
});

interface AddBillingPageProps {
  onBack: () => void;
  onSubmitted: (accountNumber: string) => void;
}

/* ── Postcode lookup ────────────────────────────────────────── */
const lookupPostcode = (postcode: string): Partial<BillingContact> | null => {
  const pc = postcode.replace(/\s/g, "").toUpperCase();
  // Simulate a lookup — in production this would call an API
  const mockData: Record<string, Partial<BillingContact>> = {
    "EC1A1BB": { buildingStreet: "1 St Martin's Le Grand", town: "London", county: "Greater London" },
    "M14WB":   { buildingStreet: "4 Spinningfields Square", town: "Manchester", county: "Greater Manchester" },
    "BT11AA":  { buildingStreet: "10 BT Tower Street", town: "Belfast", county: "County Antrim" },
    "SW1A2AA": { buildingStreet: "10 Downing Street", town: "London", county: "Greater London" },
  };
  return mockData[pc] ?? { buildingStreet: "", town: "", county: "" };
};

/* ── Individual contact form ────────────────────────────────── */
interface ContactFormProps {
  contact: BillingContact;
  index: number;
  errors: ContactErrors;
  isLoading: boolean;
  canRemove: boolean;
  onChange: (field: keyof BillingContact, value: string) => void;
  onRemove: () => void;
  onPostcodeLookup: () => void;
}

const ContactForm = ({
  contact,
  index,
  errors,
  isLoading,
  canRemove,
  onChange,
  onRemove,
  onPostcodeLookup,
}: ContactFormProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    {/* Header row */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Heading level="3" size="s">
        Billing contact {index + 1}
      </Heading>
      {canRemove && (
        <ButtonV2
          label="Remove"
          buttonStyle="tertiary"
          size="s"
          icon={BtIconBin}
          iconPosition="beforeText"
          onClick={onRemove}
        />
      )}
    </div>

    {/* Contact name */}
    <div style={{ maxWidth: "500px" }}>
      <FormControl requirementStatus="required"
        label="Contact name"
        htmlFor={`contactName-${contact.id}`}
        errorMessage={errors.contactName}
      >
        <TextInput
          label=""
          id={`contactName-${contact.id}`}
          value={contact.contactName}
          onChange={(e) => onChange("contactName", e.target.value)}
          isDisabled={isLoading}
        />
      </FormControl>
    </div>

    {/* Phone number */}
    <div style={{ maxWidth: "500px" }}>
      <FormControl requirementStatus="required"
        label="Phone number"
        htmlFor={`phoneNumber-${contact.id}`}
        errorMessage={errors.phoneNumber}
      >
        <TextInput
          label=""
          id={`phoneNumber-${contact.id}`}
          value={contact.phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
          isDisabled={isLoading}
          inputMode="tel"
        />
      </FormControl>
    </div>

    {/* Address section */}
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Text size="m" elementType="span">
        <strong>Billing address</strong>
      </Text>
      <Text size="s" tone="supporting" elementType="p">
        Enter a postcode to look up the address, or fill in manually.
      </Text>
    </div>

    {/* Postcode lookup */}
    <div style={{ maxWidth: "500px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <FormControl requirementStatus="required"
            label="Postcode lookup"
            htmlFor={`postcodeInput-${contact.id}`}
            helper="Enter your postcode and click Find Address"
          >
            <TextInput
              label=""
              id={`postcodeInput-${contact.id}`}
              value={contact.postcodeInput}
              onChange={(e) => onChange("postcodeInput", e.target.value.toUpperCase())}
              isDisabled={isLoading}
            />
          </FormControl>
        </div>
        <ButtonV2
          label="Find address"
          buttonStyle="secondary"
          size="m"
          icon={BtIconSearch}
          iconPosition="beforeText"
          onClick={onPostcodeLookup}
        />
      </div>
    </div>

    {/* Address fields */}
    <div style={{ maxWidth: "500px" }}>
      <FormControl requirementStatus="required"
        label="Building number & street"
        htmlFor={`buildingStreet-${contact.id}`}
        errorMessage={errors.buildingStreet}
      >
        <TextInput
          label=""
          id={`buildingStreet-${contact.id}`}
          value={contact.buildingStreet}
          onChange={(e) => onChange("buildingStreet", e.target.value)}
          isDisabled={isLoading}
        />
      </FormControl>
    </div>

    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", maxWidth: "500px" }}>
      <div style={{ flex: "1 1 180px" }}>
        <FormControl requirementStatus="required"
          label="Town"
          htmlFor={`town-${contact.id}`}
          errorMessage={errors.town}
        >
          <TextInput
            label=""
            id={`town-${contact.id}`}
            value={contact.town}
            onChange={(e) => onChange("town", e.target.value)}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>
      <div style={{ flex: "1 1 180px" }}>
        <FormControl requirementStatus="required"
          label="County"
          htmlFor={`county-${contact.id}`}
        >
          <TextInput
            label=""
            id={`county-${contact.id}`}
            value={contact.county}
            onChange={(e) => onChange("county", e.target.value)}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>
    </div>

    <div style={{ maxWidth: "200px" }}>
      <FormControl requirementStatus="required"
        label="Postcode"
        htmlFor={`postcode-${contact.id}`}
        errorMessage={errors.postcode}
      >
        <TextInput
          label=""
          id={`postcode-${contact.id}`}
          value={contact.postcode}
          onChange={(e) => onChange("postcode", e.target.value.toUpperCase())}
          isDisabled={isLoading}
        />
      </FormControl>
    </div>
  </div>
);

/* ── Submitted read-only view ───────────────────────────────── */
const SubmittedView = ({
  contacts,
  accountNumber,
  onEdit,
}: {
  contacts: BillingContact[];
  accountNumber: string;
  onEdit: () => void;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Heading level="2" size="m">Billing details</Heading>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Badge state="success">Account created</Badge>
          <Text size="s" tone="supporting">Account number: <strong>{accountNumber}</strong></Text>
        </div>
      </div>
      <ButtonV2 label="Edit billing details" buttonStyle="secondary" size="m" onClick={onEdit} />
    </div>

    <Alert
      heading="Billing account active"
      headingLevel="3"
      description={`Your billing account ${accountNumber} has been created. Invoices will be sent to the contacts listed below.`}
    />

    {contacts.map((c, i) => (
      <div key={c.id} style={{ background: "#f7f7f7", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <Text size="s" tone="muted" elementType="p"><strong>Billing contact {i + 1}</strong></Text>
        {[
          { label: "Contact name", value: c.contactName },
          { label: "Phone number", value: c.phoneNumber },
          { label: "Address", value: [c.buildingStreet, c.town, c.county, c.postcode].filter(Boolean).join(", ") },
        ].map((row, j, arr) => (
          <div key={row.label}>
            <Text size="s" tone="muted" elementType="p">{row.label}</Text>
            <Text size="m" elementType="p"><strong>{row.value || "—"}</strong></Text>
            {j < arr.length - 1 && <div style={{ height: "1px", background: "#d9d9d9", marginTop: "12px" }} />}
          </div>
        ))}
      </div>
    ))}
  </div>
);

/* ── Main page ──────────────────────────────────────────────── */
export const AddBillingPage = ({ onBack, onSubmitted }: AddBillingPageProps) => {
  const [pageState, setPageState] = useState<PageState>("form");
  const [contacts, setContacts] = useState<BillingContact[]>([blankContact("1")]);
  const [allErrors, setAllErrors] = useState<Record<string, ContactErrors>>({});
  const [accountNumber, setAccountNumber] = useState("");

  const navItems: NavigationHeaderNavLinkItem[] = [
    { type: "link", text: "Dashboard", href: "#", onClick: (e) => { e.preventDefault(); onBack(); } },
    { type: "link", text: "Orders", href: "#" },
    { type: "link", text: "Billing", href: "#" },
  ];

  const updateContact = (id: string, field: keyof BillingContact, value: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handlePostcodeLookup = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact || !contact.postcodeInput.trim()) return;
    const result = lookupPostcode(contact.postcodeInput);
    if (result) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                buildingStreet: result.buildingStreet ?? c.buildingStreet,
                town: result.town ?? c.town,
                county: result.county ?? c.county,
                postcode: contact.postcodeInput.trim(),
                postcodeSearched: true,
              }
            : c
        )
      );
    }
  };

  const addContact = () => {
    if (contacts.length >= 5) return;
    setContacts((prev) => [...prev, blankContact(String(Date.now()))]);
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const validate = (): boolean => {
    const errors: Record<string, ContactErrors> = {};
    let valid = true;
    contacts.forEach((c) => {
      const e: ContactErrors = {};
      if (!c.contactName.trim()) { e.contactName = "Contact name is required."; valid = false; }
      if (!c.phoneNumber.trim()) { e.phoneNumber = "Phone number is required."; valid = false; }
      if (!c.buildingStreet.trim()) { e.buildingStreet = "Building number & street is required."; valid = false; }
      if (!c.town.trim()) { e.town = "Town is required."; valid = false; }
      if (!c.postcode.trim()) { e.postcode = "Postcode is required."; valid = false; }
      errors[c.id] = e;
    });
    setAllErrors(errors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setPageState("loading");
    const generated = `BTA-${Math.floor(100000 + Math.random() * 900000)}`;
    setTimeout(() => {
      setAccountNumber(generated);
      setPageState("submitted");
      onSubmitted(generated);
    }, 5000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>

      {/* Nav */}
      <NavigationHeader
        isFluid
        navItems={navItems}
        rightSlot={
          <NavigationHeaderActionBar>
            <NavigationHeaderAction ariaLabel="Help" icon={BtIconQuestion} title="Help" />
            <NavigationHeaderAction ariaLabel="Account" icon={BtIconUser} title="My account" />
          </NavigationHeaderActionBar>
        }
      />

      {/* Page header */}
      <div style={{ background: "#ffffff", padding: "72px 96px 48px" }}>
        <div style={{ maxWidth: "1920px", margin: "0 auto" }}>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              color: "#5514b4", fontSize: "16px", fontFamily: "BT Curve, sans-serif",
              padding: 0, marginBottom: "24px",
            }}
          >
            <Icon icon={BtIconArrowLeft} size={16} />
            <span style={{ color: "#5514b4", textDecoration: "underline", fontFamily: "BT Curve, sans-serif" }}>
              Back to dashboard
            </span>
          </button>

          <Heading level="1" size="xl">
            <span style={{ color: "#2a2a2a" }}>Set up your billing details</span>
          </Heading>
          <VerticalSpace size="8" />
          <Text size="m" elementType="p">
            <span style={{ color: "#434343" }}>
              Add the billing contacts for your account. These are the people we'll send invoices and billing communications to.
            </span>
          </Text>
        </div>
      </div>

      {/* Body */}
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "1920px", margin: "0 auto", padding: "48px 96px 64px", display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Form card */}
          <div style={{
            flex: "1 1 600px", background: "#fff", borderRadius: "32px",
            padding: "32px", boxShadow: "0px 0px 32px 0px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column", gap: "40px", boxSizing: "border-box",
          }}>
            {pageState === "submitted" ? (
              <SubmittedView contacts={contacts} accountNumber={accountNumber} onEdit={() => setPageState("form")} />
            ) : (
              <>
                {/* Form heading */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Heading level="2" size="m">Core billing contact details</Heading>
                  <Text size="m" tone="supporting" elementType="p">
                    You can add up to 5 billing contacts. At least one is required.
                  </Text>
                </div>

                {/* Contact forms */}
                {contacts.map((contact, i) => (
                  <div key={contact.id}>
                    {i > 0 && <Rule />}
                    {i > 0 && <VerticalSpace size="8" />}
                    <ContactForm
                      contact={contact}
                      index={i}
                      errors={allErrors[contact.id] ?? {}}
                      isLoading={pageState === "loading"}
                      canRemove={contacts.length > 1}
                      onChange={(field, value) => updateContact(contact.id, field, value)}
                      onRemove={() => removeContact(contact.id)}
                      onPostcodeLookup={() => handlePostcodeLookup(contact.id)}
                    />
                  </div>
                ))}

                {/* Add contact */}
                {contacts.length < 5 && (
                  <div>
                    <Rule />
                    <VerticalSpace size="16" />
                    <ButtonV2
                      label="Add a billing contact"
                      buttonStyle="tertiary"
                      size="m"
                      icon={BtIconAdd}
                      iconPosition="beforeText"
                      onClick={addContact}
                    />
                  </div>
                )}

                {/* Loading state */}
                {pageState === "loading" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "#f7f7f7", borderRadius: "12px" }}>
                    <Spinner size="m" />
                    <Text size="m" tone="supporting">Creating your billing account…</Text>
                  </div>
                )}

                {/* CTA row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <ButtonV2 label="Back" buttonStyle="tertiary" size="m" onClick={onBack} />
                  <ButtonV2
                    label={pageState === "loading" ? "Creating billing account…" : "Submit billing details"}
                    buttonStyle="primary"
                    size="m"
                    isLoading={pageState === "loading"}
                    icon={pageState === "loading" ? undefined : BtIconArrowRight}
                    iconPosition="afterText"
                    onClick={handleSubmit}
                  />
                </div>
              </>
            )}
          </div>

          {/* Tip panel */}
          <div style={{ width: "395px", minWidth: "280px", background: "#fff", borderRadius: "16px", boxShadow: "0px 2px 6px 0px rgba(0,0,0,0.1), 0px 0px 1px 0px rgba(0,0,0,0.2)", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ background: "#5514b4", padding: "8px 24px" }}>
              <Text size="s" elementType="span">
                <strong style={{ color: "#fff", fontSize: "16px", lineHeight: "24px" }}>Quick tip</strong>
              </Text>
            </div>
            <div style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Icon icon={BtIconInfo} size={24} />
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Text size="m" tone="supporting" elementType="p">
                  The billing contacts you add here will receive all invoices and account communications. Make sure each contact has authority to manage billing on behalf of your organisation.
                </Text>
                <Text size="m" tone="supporting" elementType="p">
                  You can use the postcode finder to auto-fill the address, or enter it manually. Once your billing account is created, a unique account number will be generated for your records.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooterV2 slogan="All business. No drama.">
        <SiteFooterV2Main columns={4}>
          <SiteFooterV2ItemGroup title="Explore BT">
            <SiteFooterV2Item href="#">For the home</SiteFooterV2Item>
            <SiteFooterV2Item href="#">For Wholesale</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Find your business">
            <SiteFooterV2Item href="#">Small and medium business</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Corporate</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Useful links">
            <SiteFooterV2Item href="#">Help and support</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Contact BT</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Follow us">
            <SiteFooterV2Item href="#">LinkedIn</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Twitter / X</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
        </SiteFooterV2Main>
        <SiteFooterV2Utility copyrightYear={new Date()}>
          <SiteFooterV2Item href="#">Cookies</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Privacy policy</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Accessibility</SiteFooterV2Item>
        </SiteFooterV2Utility>
      </SiteFooterV2>
    </div>
  );
};
