import { useRef, useState, useEffect, useCallback } from "react";

import { Text } from "@arc-ui/components/Text";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { FormControl } from "@arc-ui/components/FormControl";
import { TextInput } from "@arc-ui/components/TextInput";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconDocumentAndPencil } from "@arc-ui/icons/BtIconDocumentAndPencil";
import { BtIconDocumentUpload } from "@arc-ui/icons/BtIconDocumentUpload";

/* ── Types ──────────────────────────────────────────────────── */
export type SignatureMode = "draw" | "type" | "upload";

export interface SignatureCaptureProps {
  /** Called with a base64 PNG data URL whenever the signature changes */
  onChange: (dataUrl: string | null) => void;
  /** Current value — used to show preview when revisiting */
  value?: string | null;
  /** Error message */
  error?: string;
}

/* ── Typed-signature font (cursive handwriting feel) ─────────── */
const TYPED_FONT = '"Segoe Script", "Brush Script MT", "Lucida Handwriting", cursive';

/* ── Tab button ─────────────────────────────────────────────── */
const ModeTab = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      border: "none",
      borderBottom: active ? "2px solid #5514b4" : "2px solid transparent",
      background: "none",
      cursor: "pointer",
      fontFamily: "BT Curve, sans-serif",
      fontSize: "14px",
      fontWeight: active ? 600 : 400,
      color: active ? "#5514b4" : "#434343",
      transition: "color 0.15s, border-color 0.15s",
    }}
  >
    <Icon icon={icon} size={16} />
    {label}
  </button>
);

/* ── Draw mode ──────────────────────────────────────────────── */
const DrawMode = ({
  onChange,
}: {
  onChange: (dataUrl: string | null) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [hasStrokes, setHasStrokes] = useState(false);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    lastPos.current = pos;
    setHasStrokes(true);
    onChange(canvas.toDataURL("image/png"));
  };

  const endDraw = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    onChange(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          style={{
            width: "100%",
            height: "200px",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            background: "#ffffff",
            cursor: "crosshair",
            touchAction: "none",
            display: "block",
          }}
          aria-label="Signature drawing area"
        />
        {!hasStrokes && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Text size="s" tone="muted" elementType="span">
              Draw your signature here
            </Text>
          </div>
        )}
        {/* Baseline */}
        <div
          style={{
            position: "absolute",
            bottom: "52px",
            left: "24px",
            right: "24px",
            height: "1px",
            background: "#d9d9d9",
            pointerEvents: "none",
          }}
        />
      </div>

      {hasStrokes && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonV2
            label="Clear"
            buttonStyle="secondary"
            size="s"
            onClick={clear}
          />
        </div>
      )}
    </div>
  );
};

/* ── Type mode ──────────────────────────────────────────────── */
const TypeMode = ({
  onChange,
}: {
  onChange: (dataUrl: string | null) => void;
}) => {
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderToCanvas = useCallback(
    (value: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!value.trim()) {
        onChange(null);
        return;
      }
      ctx.font = `52px ${TYPED_FONT}`;
      ctx.fillStyle = "#1a1a1a";
      ctx.textBaseline = "middle";
      ctx.fillText(value, 24, canvas.height / 2);
      onChange(canvas.toDataURL("image/png"));
    },
    [onChange],
  );

  useEffect(() => {
    renderToCanvas(text);
  }, [text, renderToCanvas]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <FormControl label="Type your full name" htmlFor="sig-type-input">
        <TextInput
          id="sig-type-input"
          label=""
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </FormControl>

      {/* Preview */}
      <div
        style={{
          position: "relative",
          height: "120px",
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={120}
          style={{ width: "100%", height: "100%", display: "block" }}
          aria-hidden="true"
        />
        {!text && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Text size="s" tone="muted" elementType="span">
              Your signature will appear here
            </Text>
          </div>
        )}
        {/* Baseline */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "16px",
            right: "16px",
            height: "1px",
            background: "#d9d9d9",
            pointerEvents: "none",
          }}
        />
      </div>

      {text && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonV2
            label="Clear"
            buttonStyle="secondary"
            size="s"
            onClick={() => {
              setText("");
              onChange(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

/* ── Upload mode ────────────────────────────────────────────── */
const UploadMode = ({
  onChange,
}: {
  onChange: (dataUrl: string | null) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      onChange(url);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            height: "160px",
            border: `2px dashed ${dragOver ? "#5514b4" : "#d9d9d9"}`,
            borderRadius: "8px",
            background: dragOver ? "#f9f5ff" : "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload signature image"
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
        >
          <Icon icon={BtIconDocumentUpload} size={32} />
          <Text size="s" tone="supporting" elementType="p" align="center">
            Drag &amp; drop or click to upload
          </Text>
          <Text size="s" tone="muted" elementType="p" align="center">
            PNG, JPG or SVG — max 2 MB
          </Text>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            height: "160px",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={preview}
            alt="Uploaded signature"
            style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain" }}
          />
          <button
            onClick={() => { setPreview(null); onChange(null); }}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "#ffffff",
              border: "1px solid #d9d9d9",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              fontFamily: "BT Curve, sans-serif",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Remove uploaded signature"
          >
            ×
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
};

/* ── Main SignatureCapture component ─────────────────────────── */
export const SignatureCapture = ({
  onChange,
  value,
  error,
}: SignatureCaptureProps) => {
  const [mode, setMode] = useState<SignatureMode>("draw");

  const handleChange = (dataUrl: string | null) => onChange(dataUrl);

  return (
    <div
      style={{
        border: error ? "1px solid #da020f" : "1px solid #d9d9d9",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px 0",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Text size="m" elementType="span">
            <strong>Add your signature</strong>
          </Text>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "#da020f",
              fontSize: "13px",
              fontFamily: "BT Curve, sans-serif",
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="#da020f">
              <circle cx="4" cy="4" r="4" />
            </svg>
            Required field
          </span>
        </div>
      </div>

      {/* Mode tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e8e8e8",
          paddingLeft: "8px",
        }}
      >
        <ModeTab
          active={mode === "draw"}
          onClick={() => setMode("draw")}
          icon={BtIconDocumentAndPencil}
          label="Draw signature"
        />
        <ModeTab
          active={mode === "type"}
          onClick={() => setMode("type")}
          icon={BtIconDocumentAndPencil}
          label="Type signature"
        />
        <ModeTab
          active={mode === "upload"}
          onClick={() => setMode("upload")}
          icon={BtIconDocumentUpload}
          label="Upload signature"
        />
      </div>

      {/* Mode content */}
      <div style={{ padding: "20px" }}>
        {mode === "draw" && <DrawMode onChange={handleChange} />}
        {mode === "type" && <TypeMode onChange={handleChange} />}
        {mode === "upload" && <UploadMode onChange={handleChange} />}
      </div>

      {/* Preview strip — shown when a signature exists */}
      {value && (
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            padding: "12px 20px",
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L19 7" stroke="#036c01" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Text size="s" tone="supporting" elementType="span">
            Signature captured
          </Text>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "8px 20px 12px" }}>
          <Text size="s" elementType="p" tone="default">
            <span style={{ color: "#da020f" }}>{error}</span>
          </Text>
        </div>
      )}
    </div>
  );
};
