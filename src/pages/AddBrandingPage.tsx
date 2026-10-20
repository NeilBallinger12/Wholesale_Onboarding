import { useState, useRef } from "react";

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
import { BtIconInfo } from "@arc-ui/icons/BtIconInfo";
import { BtIconDocumentUpload } from "@arc-ui/icons/BtIconDocumentUpload";
import { BtIconCrossAlt } from "@arc-ui/icons/BtIconCrossAlt";
import { BtIconTick } from "@arc-ui/icons/BtIconTick";
import { BtIconPicture } from "@arc-ui/icons/BtIconPicture";

/* ── Types ──────────────────────────────────────────────────── */
type PageState = "form" | "loading" | "submitted";

interface BrandingData {
  logoFile: File | null;
  faviconFile: File | null;
  primaryColour: string;
  secondaryColour: string;
  fontFiles: File[];
}

interface AddBrandingPageProps {
  onBack: () => void;
  onSubmitted: (logoUrl: string, primaryColour: string) => void;
  /** Pre-fill from previous save */
  initialLogoUrl?: string;
  initialPrimaryColour?: string;
}

/* ── Helpers ────────────────────────────────────────────────── */
const isValidHex = (v: string) => /^#[0-9A-Fa-f]{6}$/.test(v);

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ── File dropzone ──────────────────────────────────────────── */
interface DropzoneProps {
  /** Label for the upload area */
  label: string;
  /** Accepted MIME types / extensions hint */
  accept: string;
  /** Human-readable guidance */
  guidance: string;
  /** Currently selected file */
  file: File | null;
  /** Error message */
  error?: string;
  /** Disabled while submitting */
  isDisabled: boolean;
  /** Called when file is picked */
  onFile: (file: File | null) => void;
}

const Dropzone = ({ label, accept, guidance, file, error, isDisabled, onFile }: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  const preview = file && file.type.startsWith("image/")
    ? URL.createObjectURL(file)
    : null;

  return (
    <div style={{ maxWidth: "500px" }}>
      <Text size="s" elementType="p">
        <strong>{label}</strong>
      </Text>
      <VerticalSpace size="8" />
      <Text size="s" tone="muted" elementType="p">{guidance}</Text>
      <VerticalSpace size="8" />

      {file ? (
        /* File selected state */
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            border: "1px solid #d9d9d9",
            borderRadius: "12px",
            background: "#f7f7f7",
          }}
        >
          {preview ? (
            <img src={preview} alt="" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 4 }} />
          ) : (
            <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon icon={BtIconDocumentUpload} size={24} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="s" elementType="p"><strong>{file.name}</strong></Text>
            <Text size="s" tone="muted">{formatBytes(file.size)}</Text>
          </div>
          <span style={{ color: "#036c01", display: "flex" }}>
            <Icon icon={BtIconTick} size={18} />
          </span>
          {!isDisabled && (
            <button
              aria-label="Remove file"
              onClick={() => onFile(null)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "#5514b4", padding: 4 }}
            >
              <Icon icon={BtIconCrossAlt} size={16} />
            </button>
          )}
        </div>
      ) : (
        /* Drop target */
        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-label={`Upload ${label}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isDisabled && inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && inputRef.current?.click()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "32px 24px",
            border: `2px dashed ${dragging ? "#5514b4" : error ? "#da020f" : "#d9d9d9"}`,
            borderRadius: "12px",
            background: dragging ? "#f3eeff" : "#fafafa",
            cursor: isDisabled ? "default" : "pointer",
            transition: "border-color 0.15s ease, background 0.15s ease",
          }}
        >
          <Icon icon={BtIconPicture} size={32} />
          <Text size="m" elementType="span">
            <strong>Drag & drop or click to upload</strong>
          </Text>
          <Text size="s" tone="muted">{guidance}</Text>
        </div>
      )}

      {error && (
        <>
          <VerticalSpace size="4" />
          <Text size="s" elementType="p">
            <span style={{ color: "#da020f" }}>{error}</span>
          </Text>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
};

/* ── Multi-file dropzone (fonts) ────────────────────────────── */
const FontDropzone = ({
  files,
  isDisabled,
  onFiles,
}: {
  files: File[];
  isDisabled: boolean;
  onFiles: (files: File[]) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: File[]) => {
    const merged = [...files, ...incoming].filter(
      (f, i, arr) => arr.findIndex((x) => x.name === f.name) === i
    );
    onFiles(merged);
  };

  const remove = (name: string) => onFiles(files.filter((f) => f.name !== name));

  return (
    <div style={{ maxWidth: "500px" }}>
      <Text size="s" elementType="p"><strong>Font files</strong></Text>
      <VerticalSpace size="8" />
      <Text size="s" tone="muted" elementType="p">
        Upload your brand font files. Accepted formats: .woff, .woff2, .ttf, .otf. Max 5 MB per file.
      </Text>
      <VerticalSpace size="8" />

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
          {files.map((f) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", border: "1px solid #d9d9d9", borderRadius: "12px", background: "#f7f7f7" }}>
              <Icon icon={BtIconDocumentUpload} size={20} />
              <div style={{ flex: 1 }}>
                <Text size="s" elementType="p"><strong>{f.name}</strong></Text>
                <Text size="s" tone="muted">{formatBytes(f.size)}</Text>
              </div>
              <span style={{ color: "#036c01", display: "flex" }}><Icon icon={BtIconTick} size={16} /></span>
              {!isDisabled && (
                <button onClick={() => remove(f.name)} aria-label={`Remove ${f.name}`} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "#5514b4", padding: 4 }}>
                  <Icon icon={BtIconCrossAlt} size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop target */}
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label="Upload font files"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !isDisabled && inputRef.current?.click()}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px",
          padding: "24px", border: `2px dashed ${dragging ? "#5514b4" : "#d9d9d9"}`,
          borderRadius: "12px", background: dragging ? "#f3eeff" : "#fafafa",
          cursor: isDisabled ? "default" : "pointer", transition: "border-color 0.15s ease",
        }}
      >
        <Icon icon={BtIconDocumentUpload} size={28} />
        <Text size="m" elementType="span"><strong>{files.length > 0 ? "Add more fonts" : "Drag & drop or click to upload"}</strong></Text>
        <Text size="s" tone="muted">.woff, .woff2, .ttf, .otf</Text>
      </div>

      <input ref={inputRef} type="file" accept=".woff,.woff2,.ttf,.otf" multiple style={{ display: "none" }}
        onChange={(e) => { addFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
    </div>
  );
};

/* ── Colour picker ──────────────────────────────────────────── */
interface ColourPickerProps {
  label: string;
  description: string;
  value: string;
  isDisabled: boolean;
  error?: string;
  onChange: (hex: string) => void;
}

const ColourPicker = ({ label, description, value, isDisabled, error, onChange }: ColourPickerProps) => {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const colourRef = useRef<HTMLInputElement>(null);

  const handleHexBlur = () => {
    const v = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(v)) onChange(v);
    else setHexInput(value);
  };

  const handleNativePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setHexInput(e.target.value);
  };

  return (
    <div style={{ maxWidth: "500px" }}>
      <Text size="s" elementType="p"><strong>{label}</strong></Text>
      <VerticalSpace size="4" />
      <Text size="s" tone="muted" elementType="p">{description}</Text>
      <VerticalSpace size="8" />

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Colour swatch — click opens native picker */}
        <button
          aria-label={`Pick ${label}`}
          onClick={() => { if (!isDisabled) { setOpen(!open); colourRef.current?.click(); } }}
          style={{
            width: "48px", height: "48px", borderRadius: "8px",
            background: value, border: "2px solid #d9d9d9",
            cursor: isDisabled ? "default" : "pointer", flexShrink: 0,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
          }}
        />

        {/* Hidden native colour input */}
        <input
          ref={colourRef}
          type="color"
          value={value}
          disabled={isDisabled}
          onChange={handleNativePick}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
          aria-hidden="true"
        />

        {/* Hex text input */}
        <div style={{ flex: 1 }}>
          <FormControl requirementStatus="required" label="Hex code" htmlFor={`hex-${label}`} errorMessage={error}>
            <TextInput
              label=""
              id={`hex-${label}`}
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={handleHexBlur}
              isDisabled={isDisabled}
            />
          </FormControl>
        </div>

        {/* Open colour picker button */}
        <ButtonV2
          label="Choose colour"
          buttonStyle="tertiary"
          size="s"
          onClick={() => colourRef.current?.click()}
        />
      </div>
    </div>
  );
};

/* ── Submitted read-only view ───────────────────────────────── */
const SubmittedView = ({
  data,
  onEdit,
}: {
  data: BrandingData;
  onEdit: () => void;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Heading level="2" size="m">Branding</Heading>
        <Badge state="success">Saved</Badge>
      </div>
      <ButtonV2 label="Edit branding" buttonStyle="secondary" size="m" onClick={onEdit} />
    </div>

    <Alert heading="Branding saved" headingLevel="3" description="Your brand assets have been saved. They will be applied across your portal once your account is fully activated." />

    <div style={{ background: "#f7f7f7", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Logo preview */}
      {data.logoFile && (
        <div>
          <Text size="s" tone="muted">Logo</Text>
          <VerticalSpace size="4" />
          <img src={URL.createObjectURL(data.logoFile)} alt="Logo preview" style={{ maxHeight: "60px", maxWidth: "200px", objectFit: "contain" }} />
        </div>
      )}
      <Rule />
      {/* Colours */}
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        <div>
          <Text size="s" tone="muted" elementType="p">Primary colour</Text>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: data.primaryColour, border: "1px solid #d9d9d9" }} />
            <Text size="m">{data.primaryColour}</Text>
          </div>
        </div>
        <div>
          <Text size="s" tone="muted" elementType="p">Secondary colour</Text>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: data.secondaryColour, border: "1px solid #d9d9d9" }} />
            <Text size="m">{data.secondaryColour}</Text>
          </div>
        </div>
      </div>
      <Rule />
      <div>
        <Text size="s" tone="muted" elementType="p">Font files</Text>
        {data.fontFiles.length > 0 ? (
          data.fontFiles.map((f) => <Text key={f.name} size="s" elementType="p">{f.name}</Text>)
        ) : (
          <Text size="s" tone="muted">None uploaded</Text>
        )}
      </div>
    </div>
  </div>
);

/* ── Main page ──────────────────────────────────────────────── */
export const AddBrandingPage = ({ onBack, onSubmitted, initialLogoUrl, initialPrimaryColour }: AddBrandingPageProps) => {
  const [pageState, setPageState] = useState<PageState>("form");
  const [selectedTheme, setSelectedTheme] = useState<"bt" | "whitelabel" | "custom">("bt");
  const [data, setData] = useState<BrandingData>({
    logoFile: null,
    faviconFile: null,
    primaryColour: initialPrimaryColour || "#5514b4",
    secondaryColour: "#4665cd",
    fontFiles: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BrandingData, string>>>({});

  const navItems: NavigationHeaderNavLinkItem[] = [
    { type: "link", text: "Dashboard", href: "#", onClick: (e) => { e.preventDefault(); onBack(); } },
    { type: "link", text: "Orders", href: "#" },
  ];

  const set = <K extends keyof BrandingData>(field: K, value: BrandingData[K]) =>
    setData((d) => ({ ...d, [field]: value }));

  const validate = () => {
    const e: Partial<Record<keyof BrandingData, string>> = {};
    // Logo not required if we already have an initialLogoUrl (re-use existing)
    if (!data.logoFile && !initialLogoUrl) e.logoFile = "Please upload a logo.";
    if (!isValidHex(data.primaryColour)) e.primaryColour = "Enter a valid hex colour, e.g. #5514b4.";
    if (!isValidHex(data.secondaryColour)) e.secondaryColour = "Enter a valid hex colour.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (selectedTheme === "bt") {
      // BT theme — no validation needed, just clear customisation
      setPageState("loading");
      setTimeout(() => {
        setPageState("submitted");
        onSubmitted(initialLogoUrl ?? "", "#5514b4");
      }, 2000);
      return;
    }
    if (selectedTheme === "whitelabel") {
      setPageState("loading");
      setTimeout(() => {
        setPageState("submitted");
        onSubmitted("", "#00a329");
      }, 2000);
      return;
    }
    if (!validate()) return;
    setPageState("loading");
    setTimeout(() => {
      const logoUrl = data.logoFile ? URL.createObjectURL(data.logoFile) : initialLogoUrl ?? "";
      setPageState("submitted");
      onSubmitted(logoUrl, data.primaryColour);
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
            <span style={{ color: "#5514b4", textDecoration: "underline" }}>Back to dashboard</span>
          </button>

          <Heading level="1" size="xl">
            <span style={{ color: "#2a2a2a" }}>Customise your branding</span>
          </Heading>
          <VerticalSpace size="8" />
          <Text size="m" elementType="p">
            <span style={{ color: "#434343" }}>
              Upload your brand assets and define your colour palette.<br />
              These will be applied to your portal to give your customers a consistent branded experience.
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
              <SubmittedView data={data} onEdit={() => setPageState("form")} />
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Heading level="2" size="m">Choose your branding theme</Heading>
                  <Text size="m" tone="supporting" elementType="p">
                    Select a theme to apply to your portal. You can customise it further below.
                  </Text>
                </div>

                {/* Theme selector */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {(
                    [
                      {
                        id: "bt" as const,
                        label: "BT theme",
                        description: "Keeps the default BT Wholesale look and feel.",
                        accent: "#5514b4",
                      },
                      {
                        id: "whitelabel" as const,
                        label: "White label theme",
                        description: "Applies the Telco brand — green primary, amber secondary, zero radius.",
                        accent: "#00a329",
                      },
                      {
                        id: "custom" as const,
                        label: "Customise my branding",
                        description: "Upload your own logo and choose your colours.",
                        accent: "#2a2a2a",
                      },
                    ] as const
                  ).map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      style={{
                        flex: "1 1 160px",
                        padding: "16px",
                        borderRadius: "12px",
                        border: selectedTheme === theme.id
                          ? `2px solid ${theme.accent}`
                          : "1px solid #d9d9d9",
                        background: selectedTheme === theme.id ? "#f9f9ff" : "#ffffff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color 0.15s",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        position: "relative",
                      }}
                    >
                      {/* Colour swatch */}
                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: theme.accent, marginBottom: "4px" }} />
                      <span style={{ fontFamily: "BT Curve, sans-serif", fontWeight: 600, fontSize: "14px", color: "#2a2a2a" }}>
                        {theme.label}
                      </span>
                      <span style={{ fontFamily: "BT Curve, sans-serif", fontSize: "12px", color: "#6b6b6b", lineHeight: 1.4 }}>
                        {theme.description}
                      </span>
                      {selectedTheme === theme.id && (
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: theme.accent,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                            <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* White-label info callout */}
                {selectedTheme === "whitelabel" && (
                  <div style={{ padding: "16px", background: "#f0faf0", borderRadius: "10px", border: "1px solid #c8e6c9", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Text size="s" elementType="p"><strong>White label theme applied</strong></Text>
                    <Text size="s" tone="supporting" elementType="p">
                      The Telco brand will be applied: Inter font, Telco logo in navigation, primary colour #00a329, secondary #e6b400, zero border radius on strokes, badge radius 2px.
                    </Text>
                  </div>
                )}

                {/* Custom upload section — only shown for custom theme */}
                {selectedTheme === "custom" && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Heading level="3" size="s">Brand assets</Heading>
                      <Text size="m" tone="supporting" elementType="p">
                        Upload your logo, favicon and fonts, then choose your brand colours.
                      </Text>
                    </div>

                    {/* Logo */}
                    <Dropzone
                      label="Logo"
                      accept="image/png,image/svg+xml,image/jpeg"
                      guidance="PNG, SVG or JPEG. Max 2 MB. Recommended: 400 × 120 px on a transparent background."
                      file={data.logoFile}
                      error={errors.logoFile as string | undefined}
                      isDisabled={pageState === "loading"}
                      onFile={(f) => set("logoFile", f)}
                    />

                    <Rule />

                    {/* Favicon */}
                    <Dropzone
                      label="Favicon"
                      accept="image/x-icon,image/png,image/svg+xml"
                      guidance="ICO, PNG or SVG. Max 512 KB. Recommended: 32 × 32 px or 16 × 16 px."
                      file={data.faviconFile}
                      isDisabled={pageState === "loading"}
                      onFile={(f) => set("faviconFile", f)}
                    />

                    <Rule />

                    {/* Colours */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <ColourPicker
                        label="Primary colour"
                        description="Used for buttons, links and key interactive elements."
                        value={data.primaryColour}
                        isDisabled={pageState === "loading"}
                        error={errors.primaryColour as string | undefined}
                        onChange={(hex) => set("primaryColour", hex)}
                      />
                      <ColourPicker
                        label="Secondary colour"
                        description="Used for accents, highlights and supporting elements."
                        value={data.secondaryColour}
                        isDisabled={pageState === "loading"}
                        error={errors.secondaryColour as string | undefined}
                        onChange={(hex) => set("secondaryColour", hex)}
                      />
                    </div>

                    <Rule />

                    {/* Fonts */}
                    <FontDropzone
                      files={data.fontFiles}
                      isDisabled={pageState === "loading"}
                      onFiles={(files) => set("fontFiles", files)}
                    />
                  </>
                )}

                {/* Loading */}
                {pageState === "loading" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "#f7f7f7", borderRadius: "12px" }}>
                    <Spinner size="m" />
                    <Text size="m" tone="supporting">Saving your branding…</Text>
                  </div>
                )}
                {/* CTAs */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <ButtonV2 label="Back" buttonStyle="tertiary" size="m" onClick={onBack} />
                  <ButtonV2
                    label={pageState === "loading" ? "Saving branding…" : "Save branding"}
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
              <Text size="s" elementType="span"><strong style={{ color: "#fff", fontSize: "16px", lineHeight: "24px" }}>Quick tip</strong></Text>
            </div>
            <div style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Icon icon={BtIconInfo} size={24} />
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Text size="m" tone="supporting" elementType="p">
                  Your logo will appear in the portal header and on customer-facing pages. Use a transparent background PNG or SVG for the best results.
                </Text>
                <Text size="m" tone="supporting" elementType="p">
                  For colours, use your brand hex codes to ensure consistency. If you're unsure, check your brand guidelines or ask your marketing team.
                </Text>
                <Text size="m" tone="supporting" elementType="p">
                  Font files will be loaded across the portal. Upload the regular and bold weights as a minimum for the best typographic experience.
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
            <SiteFooterV2Item href="#">For Wholesale</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Useful links">
            <SiteFooterV2Item href="#">Help and support</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Follow us">
            <SiteFooterV2Item href="#">LinkedIn</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Legal">
            <SiteFooterV2Item href="#">Privacy policy</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
        </SiteFooterV2Main>
        <SiteFooterV2Utility copyrightYear={new Date()}>
          <SiteFooterV2Item href="#">Cookies</SiteFooterV2Item>
          <SiteFooterV2Item href="#">Accessibility</SiteFooterV2Item>
        </SiteFooterV2Utility>
      </SiteFooterV2>
    </div>
  );
};
