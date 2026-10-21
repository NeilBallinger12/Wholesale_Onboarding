import { useState, useRef, useCallback } from "react";

import {
  NavigationHeader,
  NavigationHeaderAction,
  NavigationHeaderActionBar,
  type NavigationHeaderNavLinkItem,
} from "@arc-ui/components/NavigationHeader";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Alert } from "@arc-ui/components/Alert";
import { Badge } from "@arc-ui/components/Badge";
import { Rule } from "@arc-ui/components/Rule";
import { Spinner } from "@arc-ui/components/Spinner";
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
import { BtIconInfo } from "@arc-ui/icons/BtIconInfo";
import { BtIconDocumentAndPencil } from "@arc-ui/icons/BtIconDocumentAndPencil";

import { SignatureCapture } from "../components/SignatureCapture";

/* ── Types ──────────────────────────────────────────────────── */
type PageState = "form" | "loading" | "submitted";

interface ApproveCommercialsPageProps {
  onBack: () => void;
  onSubmitted: () => void;
}

/* ── Table helpers ──────────────────────────────────────────── */
const Th = ({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) => (
  <th
    style={{
      padding: "10px 16px",
      textAlign: align,
      fontFamily: "BT Curve, sans-serif",
      fontSize: "12px",
      fontWeight: 600,
      color: "#6b6b6b",
      borderBottom: "2px solid #d9d9d9",
      background: "#f7f7f7",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </th>
);

const Td = ({
  children,
  align = "left",
  highlight,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  highlight?: boolean;
}) => (
  <td
    style={{
      padding: "10px 16px",
      textAlign: align,
      fontFamily: "BT Curve, sans-serif",
      fontSize: "14px",
      color: highlight ? "#5514b4" : "#2a2a2a",
      fontWeight: highlight ? 600 : 400,
      borderBottom: "1px solid #f0f0f0",
      verticalAlign: "middle",
    }}
  >
    {children}
  </td>
);

/* ── Section heading ─────────────────────────────────────────── */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 0 8px",
    }}
  >
    <Icon icon={BtIconDocumentAndPencil} size={18} />
    <Heading level="3" size="s">
      {children}
    </Heading>
  </div>
);

/* ── Digital Voice pricing table ─────────────────────────────── */
const DVPricingTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Digital Voice licence pricing">
      <thead>
        <tr>
          <Th>Licence type</Th>
          <Th>Features included</Th>
          <Th align="right">Per seat / month</Th>
          <Th align="right">Min. commitment</Th>
        </tr>
      </thead>
      <tbody>
        {[
          {
            tier: "Essential",
            features: "HD voice, basic call management, voicemail-to-email",
            price: "£6.00",
            min: "1 seat",
          },
          {
            tier: "Enhanced",
            features: "Everything in Essential + call recording, hunt groups, auto-attendant",
            price: "£8.00",
            min: "1 seat",
          },
          {
            tier: "Professional",
            features: "Everything in Enhanced + Teams Direct Routing, advanced analytics, priority SLA",
            price: "£12.00",
            min: "1 seat",
          },
        ].map((row, i) => (
          <tr key={row.tier} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
            <Td highlight>{row.tier}</Td>
            <Td>{row.features}</Td>
            <Td align="right"><strong>{row.price}</strong></Td>
            <Td align="right">{row.min}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Hardware pricing table ──────────────────────────────────── */
const HardwareTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Hardware pricing">
      <thead>
        <tr>
          <Th>Device</Th>
          <Th>Description</Th>
          <Th align="right">Unit price (ex. VAT)</Th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: "Cisco 8851 IP Phone", desc: "5-line desk phone, HD audio, colour display", price: "£149.00" },
          { name: "Polycom VVX 350", desc: "6-line business media phone, colour LCD", price: "£129.00" },
          { name: "Yealink T46U", desc: "16-line Gigabit IP phone, USB port", price: "£119.00" },
          { name: "Snom D785", desc: "12-line HD desk phone, TLS/SRTP", price: "£159.00" },
          { name: "Grandstream GXP2160", desc: "6-line Enterprise IP phone, BLF keys", price: "£89.00" },
          { name: "Jabra Evolve 65", desc: "Wireless stereo headset, UC certified", price: "£139.00" },
          { name: "Poly Voyager Focus 2", desc: "Stereo ANC headset, Teams certified", price: "£169.00" },
          { name: "Sennheiser MB Pro 1", desc: "Single-sided wireless headset, Teams ready", price: "£125.00" },
          { name: "Konftel 800", desc: "Conference speaker, Bluetooth + USB", price: "£349.00" },
          { name: "Yealink CP960", desc: "Microsoft Teams conference phone, 5\" touch", price: "£289.00" },
        ].map((row, i) => (
          <tr key={row.name} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
            <Td highlight>{row.name}</Td>
            <Td>{row.desc}</Td>
            <Td align="right"><strong>{row.price}</strong></Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Volume discounts table ──────────────────────────────────── */
const DiscountsTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Volume discounts">
      <thead>
        <tr>
          <Th>Volume threshold</Th>
          <Th>Licence discount</Th>
          <Th>Hardware discount</Th>
          <Th>Dedicated account manager</Th>
        </tr>
      </thead>
      <tbody>
        {[
          { vol: "100+ licences / month", lic: "8% off all tiers", hw: "5% off list price", am: "No" },
          { vol: "500+ licences / month", lic: "15% off all tiers", hw: "12% off list price", am: "Yes" },
        ].map((row, i) => (
          <tr key={row.vol} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
            <Td highlight>{row.vol}</Td>
            <Td>{row.lic}</Td>
            <Td>{row.hw}</Td>
            <Td>{row.am}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Submitted view ──────────────────────────────────────────── */
const SubmittedView = ({
  signatureDataUrl,
  onEdit,
}: {
  signatureDataUrl: string;
  onEdit: () => void;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Heading level="2" size="m">Master Services Agreement</Heading>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Badge state="success">Signed</Badge>
          <Text size="s" tone="supporting">Agreement accepted and countersigned by BT</Text>
        </div>
      </div>
      <ButtonV2
        label="View agreement"
        buttonStyle="secondary"
        size="m"
        onClick={onEdit}
      />
    </div>

    <Alert
      heading="Agreement confirmed"
      headingLevel="3"
      description="Your Master Services Agreement with BT Wholesale has been signed and recorded. You can now proceed with ordering Digital Voice services. A copy will be sent to your registered email address."
    />

    {/* Signature preview */}
    <div
      style={{
        background: "#f7f7f7",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <Text size="s" tone="muted" elementType="p">Your signature</Text>
      <img
        src={signatureDataUrl}
        alt="Captured signature"
        style={{
          maxHeight: "80px",
          maxWidth: "320px",
          objectFit: "contain",
          background: "#ffffff",
          borderRadius: "6px",
          padding: "8px",
          border: "1px solid #d9d9d9",
        }}
      />
      <Text size="s" tone="muted" elementType="p">
        Signed on {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </Text>
    </div>
  </div>
);

/* ── Main page ──────────────────────────────────────────────── */
export const ApproveCommercialsPage = ({
  onBack,
  onSubmitted,
}: ApproveCommercialsPageProps) => {
  const [pageState, setPageState] = useState<PageState>("form");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  // Stable memoized callback — prevents SignatureCapture's TypeMode loop
  const handleSignatureChange = useCallback((dataUrl: string | null) => {
    setSignatureDataUrl(dataUrl);
  }, []);
  const [signatureError, setSignatureError] = useState<string | undefined>();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const agreementRef = useRef<HTMLDivElement>(null);

  const navItems: NavigationHeaderNavLinkItem[] = [
    { type: "link", text: "Dashboard", href: "#", onClick: (e) => { e.preventDefault(); onBack(); } },
    { type: "link", text: "Orders", href: "#" },
    { type: "link", text: "Billing", href: "#" },
  ];

  const handleSubmit = () => {
    let valid = true;
    if (!signatureDataUrl) {
      setSignatureError("Please provide your signature to confirm the agreement.");
      valid = false;
    } else {
      setSignatureError(undefined);
    }
    if (!agreedToTerms) {
      setTermsError(true);
      valid = false;
    } else {
      setTermsError(false);
    }
    if (!valid) return;

    setPageState("loading");
    setTimeout(() => {
      setPageState("submitted");
      onSubmitted();
    }, 3000);
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            {pageState === "submitted" && <Badge state="success">Signed</Badge>}
          </div>

          <Heading level="1" size="xl">
            <span style={{ color: "#2a2a2a" }}>Approve your commercial agreement</span>
          </Heading>
          <VerticalSpace size="8" />
          <Text size="m" elementType="p">
            <span style={{ color: "#434343" }}>
              Review and sign your Master Services Agreement and Digital Voice price book with BT Wholesale.
            </span>
          </Text>
        </div>
      </div>

      {/* Body */}
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "1920px", margin: "0 auto", padding: "48px 96px 64px", display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Main form card */}
          <div style={{
            flex: "1 1 680px",
            background: "#fff",
            borderRadius: "32px",
            padding: "32px",
            boxShadow: "0px 0px 32px 0px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            boxSizing: "border-box",
          }}>

            {pageState === "submitted" ? (
              <SubmittedView
                signatureDataUrl={signatureDataUrl!}
                onEdit={() => setPageState("form")}
              />
            ) : (
              <>
                {/* ── Master Agreement text ── */}
                <div ref={agreementRef}>
                  <Heading level="2" size="m">Master Services Agreement</Heading>
                  <VerticalSpace size="4" />
                  <Text size="s" tone="muted" elementType="p">
                    Agreement reference: MSA-BT-WHL-2026 &nbsp;·&nbsp; Version 3.2 &nbsp;·&nbsp; Effective date: 1 January 2026
                  </Text>
                </div>

                {/* Agreement body — scrollable */}
                <div
                  style={{
                    maxHeight: "260px",
                    overflowY: "auto",
                    padding: "20px",
                    background: "#f7f7f7",
                    borderRadius: "12px",
                    border: "1px solid #e8e8e8",
                    fontSize: "13px",
                    fontFamily: "BT Curve, sans-serif",
                    lineHeight: "1.7",
                    color: "#434343",
                  }}
                  tabIndex={0}
                  aria-label="Master Services Agreement text"
                >
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>1. Parties</strong><br />
                    This Master Services Agreement ("Agreement") is entered into between <strong>BT Group plc</strong>, a company registered in England and Wales (Company No. 01800000), whose registered office is at 1 Braham Street, London E1 8EE ("BT"), and the Partner identified on the Portal registration ("Partner").
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>2. Services</strong><br />
                    BT agrees to provide the Partner with access to BT Wholesale services, including but not limited to Digital Voice, Broadband One, Ethernet, and Dedicated Internet Access, subject to the terms of this Agreement and any applicable Service Schedules. Each Service Schedule forms part of this Agreement and is incorporated herein by reference.
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>3. Term</strong><br />
                    This Agreement commences on the date of electronic signature and continues for an initial term of thirty-six (36) months ("Initial Term"). Following the Initial Term, this Agreement shall automatically renew for successive twelve (12) month periods unless either party provides ninety (90) days' written notice of termination.
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>4. Commercials and Pricing</strong><br />
                    Partner acknowledges and agrees to the pricing set out in the Digital Voice Price Book attached to this Agreement as Schedule A. Prices are exclusive of VAT and are subject to change upon thirty (30) days' written notice by BT. Volume discount tiers apply as set out in Schedule B and are calculated on a rolling three-month average of licences activated.
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>5. Obligations of the Partner</strong><br />
                    The Partner shall: (a) comply with all applicable laws and regulations in connection with its use of the Services; (b) ensure that end customers are made aware of BT's acceptable use policy; (c) maintain accurate records of licences activated and provide monthly reporting to BT upon request; (d) not resell Services at prices that bring BT's brand into disrepute.
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>6. Intellectual Property</strong><br />
                    All intellectual property rights in the Services and associated materials remain the exclusive property of BT. The Partner is granted a limited, non-exclusive, non-transferable licence to use BT trademarks solely for the purpose of marketing the Services to end customers, subject to BT's brand guidelines.
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>7. Limitation of Liability</strong><br />
                    To the maximum extent permitted by law, BT's aggregate liability under this Agreement shall not exceed the total charges paid by the Partner in the three (3) months preceding the event giving rise to the claim. Neither party shall be liable for indirect, special, or consequential loss.
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>8. Confidentiality</strong><br />
                    Each party shall keep the other's confidential information strictly confidential and shall not disclose it to any third party without prior written consent, except as required by law or regulation.
                  </p>
                  <p style={{ margin: "0 0 12px" }}>
                    <strong>9. Governing Law</strong><br />
                    This Agreement shall be governed by and construed in accordance with the laws of England and Wales. The parties submit to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                  <p style={{ margin: "0" }}>
                    <strong>10. Entire Agreement</strong><br />
                    This Agreement, together with its Schedules, constitutes the entire agreement between the parties and supersedes all prior agreements, representations and understandings relating to its subject matter.
                  </p>
                </div>

                <Rule />

                {/* ── Schedule A: Digital Voice pricing ── */}
                <div>
                  <SectionHeading>Schedule A — Digital Voice Price Book</SectionHeading>
                  <VerticalSpace size="4" />
                  <Text size="s" tone="supporting" elementType="p">
                    Wholesale licence pricing per seat per month, exclusive of VAT. Effective 1 January 2026.
                  </Text>
                  <VerticalSpace size="16" />
                  <DVPricingTable />
                </div>

                <Rule />

                {/* ── Hardware ── */}
                <div>
                  <SectionHeading>Schedule A (cont.) — Hardware List Price</SectionHeading>
                  <VerticalSpace size="4" />
                  <Text size="s" tone="supporting" elementType="p">
                    Single unit prices exclusive of VAT. Bulk order pricing available on request.
                  </Text>
                  <VerticalSpace size="16" />
                  <HardwareTable />
                </div>

                <Rule />

                {/* ── Volume discounts ── */}
                <div>
                  <SectionHeading>Schedule B — Volume Discount Framework</SectionHeading>
                  <VerticalSpace size="4" />
                  <Text size="s" tone="supporting" elementType="p">
                    Discounts applied automatically once thresholds are met on a rolling 3-month basis.
                  </Text>
                  <VerticalSpace size="16" />
                  <DiscountsTable />
                </div>

                <Rule />

                {/* ── Signature block ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <Heading level="3" size="s">Sign the agreement</Heading>
                  <Text size="s" tone="supporting" elementType="p">
                    By signing below, you confirm that you are authorised to enter into this Agreement on behalf of your organisation and that you have read and understood its terms.
                  </Text>

                  {/* Signatory info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      flexWrap: "wrap",
                      padding: "16px",
                      background: "#f7f7f7",
                      borderRadius: "10px",
                    }}
                  >
                    <div>
                      <Text size="s" tone="muted" elementType="p">Signing on behalf of</Text>
                      <Text size="m" elementType="p"><strong>Giacom Ltd</strong></Text>
                    </div>
                    <div>
                      <Text size="s" tone="muted" elementType="p">Signatory</Text>
                      <Text size="m" elementType="p"><strong>Neil Ballinger</strong></Text>
                    </div>
                    <div>
                      <Text size="s" tone="muted" elementType="p">Date</Text>
                      <Text size="m" elementType="p">
                        <strong>
                          {new Date().toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </strong>
                      </Text>
                    </div>
                  </div>

                  <SignatureCapture
                    onChange={handleSignatureChange}
                    value={signatureDataUrl}
                    error={signatureError}
                  />
                </div>

                {/* Checkbox agreement */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    cursor: "pointer",
                    padding: "16px",
                    borderRadius: "10px",
                    border: termsError ? "1px solid #da020f" : "1px solid #d9d9d9",
                    background: termsError ? "#fff8f8" : "#ffffff",
                    transition: "border-color 0.15s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (e.target.checked) setTermsError(false);
                    }}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#5514b4",
                      flexShrink: 0,
                      marginTop: "2px",
                      cursor: "pointer",
                    }}
                  />
                  <div>
                    <Text size="s" elementType="span">
                      I confirm I am authorised to sign this Agreement on behalf of my organisation and I agree to the Master Services Agreement and the commercial terms set out in Schedules A and B.
                    </Text>
                    {termsError && (
                      <p style={{ margin: "4px 0 0", color: "#da020f", fontFamily: "BT Curve, sans-serif", fontSize: "13px" }}>
                        You must confirm you agree to the terms before signing.
                      </p>
                    )}
                  </div>
                </label>

                {/* Loading */}
                {pageState === "loading" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "#f7f7f7", borderRadius: "12px" }}>
                    <Spinner size="m" />
                    <Text size="m" tone="supporting">Submitting your signed agreement…</Text>
                  </div>
                )}

                {/* CTAs */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <ButtonV2 label="Back" buttonStyle="tertiary" size="m" onClick={onBack} />
                  <ButtonV2
                    label={pageState === "loading" ? "Submitting agreement…" : "Sign and submit"}
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
                <strong style={{ color: "#fff", fontSize: "16px", lineHeight: "24px" }}>What happens next?</strong>
              </Text>
            </div>
            <div style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Icon icon={BtIconInfo} size={24} />
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Text size="m" tone="supporting" elementType="p">
                  Once you sign and submit this agreement, BT will countersign within one business day. You'll receive a copy via email and your portal status will update to reflect your active commercial relationship.
                </Text>
                <Text size="m" tone="supporting" elementType="p">
                  Volume discounts are applied automatically. You don't need to request them — once your rolling 3-month average reaches a threshold, the discount is applied to the following month's invoice.
                </Text>
                <Text size="m" tone="supporting" elementType="p">
                  If you have any questions about the pricing or terms, please contact your BT Wholesale account manager before signing.
                </Text>
                {/* Parties */}
                <div
                  style={{
                    background: "#f7f7f7",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <Text size="s" tone="muted" elementType="p"><strong>Parties</strong></Text>
                  {[
                    { name: "Neil Ballinger", email: "neil.ballinger@giacom.com", role: "Signer" },
                  ].map((p) => (
                    <div key={p.email} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#e8d5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#5514b4",
                          flexShrink: 0,
                        }}
                      >
                        {p.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <Text size="s" elementType="p"><strong>{p.name}</strong></Text>
                        <Text size="s" tone="muted" elementType="p">{p.email}</Text>
                      </div>
                      <span
                        style={{
                          marginLeft: "auto",
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "2px 8px",
                          borderRadius: "1000px",
                          background: "#e8d5f5",
                          color: "#5514b4",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {p.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooterV2 slogan="All business. No drama.">
        <SiteFooterV2Main columns={4}>
          <SiteFooterV2ItemGroup title="Explore BT">
            <SiteFooterV2Item href="#">For Wholesale</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Useful links">
            <SiteFooterV2Item href="#">Help and support</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Contact BT</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Legal">
            <SiteFooterV2Item href="#">Privacy policy</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Terms of use</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Follow us">
            <SiteFooterV2Item href="#">LinkedIn</SiteFooterV2Item>
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
