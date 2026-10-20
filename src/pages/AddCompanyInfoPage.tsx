import { useState } from "react";

import {
  NavigationHeader,
  NavigationHeaderAction,
  NavigationHeaderActionBar,
  type NavigationHeaderNavLinkItem,
} from "@arc-ui/components/NavigationHeader";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";

import { TextInput } from "@arc-ui/components/TextInput";
import { FormControl } from "@arc-ui/components/FormControl";import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Alert } from "@arc-ui/components/Alert";
import { Badge } from "@arc-ui/components/Badge";
import { Spinner } from "@arc-ui/components/Spinner";
import { Link } from "@arc-ui/components/Link";
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
import { BtIconInfo } from "@arc-ui/icons/BtIconInfo";
import { BtIconArrowLeft } from "@arc-ui/icons/BtIconArrowLeft";
import { BtIconArrowRight } from "@arc-ui/icons/BtIconArrowRight";
import { BtIconTickAlt } from "@arc-ui/icons/BtIconTickAlt";

/* ── Types ──────────────────────────────────────────────────── */
type PageState = "form" | "loading" | "submitted";

interface FormData {
  registeredName: string;
  tradingName: string;
  companyNumber: string;
  vatNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressPostcode: string;
}

interface AddCompanyInfoPageProps {
  /** Navigate back to the dashboard */
  onBack: () => void;
  /** Called when the form is successfully submitted */
  onSubmitted?: () => void;
}

/* ── Page ───────────────────────────────────────────────────── */
export const AddCompanyInfoPage = ({ onBack, onSubmitted }: AddCompanyInfoPageProps) => {
  const [pageState, setPageState] = useState<PageState>("form");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form, setForm] = useState<FormData>({
    registeredName: "",
    tradingName: "",
    companyNumber: "",
    vatNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressCity: "",
    addressPostcode: "",
  });

  const navItems: NavigationHeaderNavLinkItem[] = [
    { type: "link", text: "Dashboard", href: "#", onClick: (e) => { e.preventDefault(); onBack(); } },
    { type: "link", text: "Orders", href: "#" },
    { type: "link", text: "Assets", href: "#" },
    { type: "link", text: "Faults", href: "#" },
    { type: "link", text: "Billing", href: "#" },
  ];

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.registeredName.trim()) e.registeredName = "Registered name is required.";
    if (!form.companyNumber.trim()) e.companyNumber = "Company registration number is required.";
    if (!form.vatNumber.trim()) e.vatNumber = "VAT number is required.";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address line 1 is required.";
    if (!form.addressCity.trim()) e.addressCity = "Town / city is required.";
    if (!form.addressPostcode.trim()) e.addressPostcode = "Postcode is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setPageState("loading");
    setTimeout(() => {
      setPageState("submitted");
      onSubmitted?.();
    }, 5000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>

      {/* ── Nav ── */}
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

      {/* ── Page header — gradient background matching Figma ── */}
      <div
        style={{
          background: "#ffffff",
          padding: "104px 96px 64px",
          borderRadius: "0 0 24px 24px",
        }}
      >
        <div style={{ maxWidth: "1920px", margin: "0 auto" }}>
          {/* Breadcrumb back link */}
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5514b4",
              fontSize: "16px",
              fontFamily: "BT Curve, sans-serif",
              padding: 0,
              marginBottom: "24px",
            }}          >
            <Icon icon={BtIconArrowLeft} size={16} />
            <span
              style={{
                color: "#5514b4",
                textDecoration: "underline",
                fontFamily: "BT Curve, sans-serif",
              }}
            >
              Back to dashboard
            </span>
          </button>

          {/* Title block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Submitted state badge */}
            {pageState === "submitted" && (
              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "1000px",
                    background: "#fff8e1",
                    color: "#7a4f00",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  <Icon icon={BtIconTickAlt} size={14} />
                  Awaiting approval
                </span>
              </div>
            )}

            <Heading level="1" size="xl">
              <span style={{ color: "#2a2a2a" }}>Add your company information</span>
            </Heading>
            <Text size="m" elementType="p">
              <span style={{ color: "#434343", maxWidth: "1010px", display: "block" }}>
                This is the core account information BT uses to verify your business.
              </span>
            </Text>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "1920px",
            margin: "0 auto",
            padding: "64px 96px",
            display: "flex",
            gap: "32px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* ── Form card ── */}
          <div
            style={{
              flex: "1 1 600px",
              background: "#fff",
              borderRadius: "32px",
              padding: "32px",
              boxShadow: "0px 0px 32px 0px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              boxSizing: "border-box",
            }}
          >
            {pageState === "submitted" ? (
              <SubmittedView form={form} onEdit={() => setPageState("form")} />
            ) : (
              <>
                <FormView
                  form={form}
                  errors={errors}
                  onChange={set}
                  isLoading={pageState === "loading"}
                />

                {/* CTA row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <ButtonV2
                    label="Back"
                    buttonStyle="tertiary"
                    size="m"
                    onClick={onBack}
                  />
                  <ButtonV2
                    label={pageState === "loading" ? "Submitting company information…" : "Submit company details"}
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

          {/* ── Tip panel ── */}
          <div
            style={{
              width: "395px",
              minWidth: "280px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0px 2px 6px 0px rgba(0,0,0,0.1), 0px 0px 1px 0px rgba(0,0,0,0.2)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* Tip header */}
            <div
              style={{
                background: "#5514b4",
                padding: "8px 24px",
              }}
            >
              <Text size="s" elementType="span">
                <strong style={{ color: "#fff", fontSize: "16px", lineHeight: "24px" }}>Quick tip</strong>
              </Text>
            </div>

            {/* Tip body */}
            <div
              style={{
                padding: "24px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <Icon icon={BtIconInfo} size={24} />
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Text size="m" tone="supporting" elementType="p">
                  Our credit check is fully automated — once you submit your details, the
                  verification runs instantly in the background. You don't need to call anyone
                  or wait for a callback. We'll send you a notification as soon as it's done.
                </Text>
                <Text size="m" tone="supporting" elementType="p">
                  Your Company Registration Number can be looked up on the{" "}
                  <Link
                    href="https://find-and-update.company-information.service.gov.uk/"
                    size="m"
                  >
                    Companies House register
                  </Link>
                  .
                </Text>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <SiteFooterV2 slogan="All business. No drama.">
        <SiteFooterV2Main columns={4}>
          <SiteFooterV2ItemGroup title="Explore BT">
            <SiteFooterV2Item href="#">For the home</SiteFooterV2Item>
            <SiteFooterV2Item href="#">For Wholesale</SiteFooterV2Item>
            <SiteFooterV2Item href="#">For global businesses</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Find your business">
            <SiteFooterV2Item href="#">Small and medium business</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Corporate</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Public sector</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Useful links">
            <SiteFooterV2Item href="#">Help and support</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Contact BT</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Sitemap</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Follow us">
            <SiteFooterV2Item href="#">LinkedIn</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Twitter / X</SiteFooterV2Item>
            <SiteFooterV2Item href="#">YouTube</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
        </SiteFooterV2Main>
        <SiteFooterV2Utility copyrightYear={new Date()}>
          <SiteFooterV2Item href="#">Cookies</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Terms of use</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Privacy policy</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Accessibility</SiteFooterV2Item>
        </SiteFooterV2Utility>
      </SiteFooterV2>
    </div>
  );
};

/* ── Form view ──────────────────────────────────────────────── */
interface FormViewProps {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  onChange: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

const FormView = ({ form, errors, onChange, isLoading }: FormViewProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Heading level="2" size="m">
        Add your company information
      </Heading>
      <Text size="m" tone="supporting" elementType="p">
        Please complete all required fields. This information is used to verify your
        business identity and set up your BT Wholesale account.
      </Text>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1: Registered name */}
      <div style={{ maxWidth: "500px" }}>
        <FormControl requirementStatus="required"
          label="Registered company name"
          htmlFor="registeredName"
          helper="The official registered name of your company as it appears on Companies House."
          errorMessage={errors.registeredName}
        >
          <TextInput
            label="" id="registeredName"
            value={form.registeredName}
            onChange={onChange("registeredName")}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>

      {/* 2: Trading name */}
      <div style={{ maxWidth: "500px" }}>
        <FormControl requirementStatus="required"
          label="Trading name"
          htmlFor="tradingName"
          helper="If your business trades under a different name, enter it here."
        >
          <TextInput
            label="" id="tradingName"
            value={form.tradingName}
            onChange={onChange("tradingName")}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>

      {/* 3: Company registration number */}
      <div style={{ maxWidth: "500px" }}>
        <FormControl requirementStatus="required"
          label="Company registration number"
          htmlFor="companyNumber"
          helper={
            <>
              Your unique 8-digit number from{" "}
              <Link
                href="https://find-and-update.company-information.service.gov.uk/"
                size="s"
              >
                Companies House
              </Link>
              .
            </>
          }
          errorMessage={errors.companyNumber}
        >
          <TextInput
            label="" id="companyNumber"
            value={form.companyNumber}
            onChange={onChange("companyNumber")}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>

      {/* 4: VAT number */}
      <div style={{ maxWidth: "500px" }}>
        <FormControl requirementStatus="required"
          label="VAT number"
          htmlFor="vatNumber"
          helper="Your 9-digit VAT registration number, e.g. GB 123456789."
          errorMessage={errors.vatNumber}
        >
          <TextInput
            label="" id="vatNumber"
            value={form.vatNumber}
            onChange={onChange("vatNumber")}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>

      {/* 5: Company registered address */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Heading level="3" size="s">
          Company registered address
        </Heading>
        <Text size="s" tone="supporting" elementType="p">
          The address registered with Companies House.
        </Text>
      </div>

      <div style={{ maxWidth: "500px" }}>
        <FormControl requirementStatus="required"
          label="Address line 1"
          htmlFor="addressLine1"
          errorMessage={errors.addressLine1}
        >
          <TextInput
            label="" id="addressLine1"
            value={form.addressLine1}
            onChange={onChange("addressLine1")}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>

      <div style={{ maxWidth: "500px" }}>
        <FormControl requirementStatus="required"
          label="Address line 2"
          htmlFor="addressLine2"
        >
          <TextInput
            label="" id="addressLine2"
            value={form.addressLine2}
            onChange={onChange("addressLine2")}
            isDisabled={isLoading}
          />
        </FormControl>
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", maxWidth: "500px" }}>
        <div style={{ flex: "1 1 160px" }}>
          <FormControl requirementStatus="required"
            label="Town / city"
            htmlFor="addressCity"
            errorMessage={errors.addressCity}
          >
            <TextInput
              label="" id="addressCity"
              value={form.addressCity}
              onChange={onChange("addressCity")}
              isDisabled={isLoading}
            />
          </FormControl>
        </div>
        <div style={{ flex: "1 1 100px" }}>
          <FormControl requirementStatus="required"
            label="Postcode"
            htmlFor="addressPostcode"
            errorMessage={errors.addressPostcode}
          >
            <TextInput
              label="" id="addressPostcode"
              value={form.addressPostcode}
              onChange={onChange("addressPostcode")}
              isDisabled={isLoading}
            />
          </FormControl>
        </div>
      </div>
    </div>

    {isLoading && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "#f7f7f7",
          borderRadius: "12px",
        }}
      >
        <Spinner size="m" />
        <Text size="m" tone="supporting">
          Submitting your company information…
        </Text>
      </div>
    )}
  </div>
);

/* ── Submitted / read-only view ─────────────────────────────── */
interface SubmittedViewProps {
  form: FormData;
  onEdit: () => void;
}

const SubmittedView = ({ form, onEdit }: SubmittedViewProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Heading level="2" size="m">
          Company information
        </Heading>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Badge state="warning">Awaiting approval</Badge>
          <Text size="s" tone="supporting">
            Your details have been submitted and are being reviewed.
          </Text>
        </div>
      </div>
      <ButtonV2
        label="Edit information"
        buttonStyle="secondary"
        size="m"
        onClick={onEdit}
      />
    </div>

    <Alert
      heading="What happens next?"
      headingLevel="3"
      description="We're running an automated credit check on your company. This typically takes just a few minutes. You'll receive a notification once the review is complete — no action needed from you in the meantime."
    />

    {/* Read-only summary */}
    <div
      style={{
        background: "#f7f7f7",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {[
        { label: "Registered company name", value: form.registeredName },
        { label: "Trading name", value: form.tradingName || "—" },
        { label: "Company registration number", value: form.companyNumber },
        { label: "VAT number", value: form.vatNumber },
        {
          label: "Registered address",
          value: [form.addressLine1, form.addressLine2, form.addressCity, form.addressPostcode]
            .filter(Boolean)
            .join(", "),
        },
      ].map((row, i, arr) => (
        <div key={row.label}>
          <Text size="s" tone="muted" elementType="p">
            {row.label}
          </Text>
          <Text size="m" elementType="p">
            <strong>{row.value}</strong>
          </Text>
          {i < arr.length - 1 && (
            <div
              style={{
                height: "1px",
                background: "#d9d9d9",
                marginTop: "16px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);
