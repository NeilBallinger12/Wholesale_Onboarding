import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

import { WelcomeTourContent } from "./WelcomeTour";

/* ── Props ──────────────────────────────────────────────────── */
interface WelcomeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Main overlay — slides the tour panel in from the right ── */
export const WelcomeOverlay = ({ isOpen, onClose }: WelcomeOverlayProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Entrance animation
  useEffect(() => {
    if (!isOpen) return;
    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    tl.fromTo(panelRef.current, { x: "100%" }, { x: "0%", duration: 0.5, ease: "power3.out" }, 0);
    return () => { tl.kill(); };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });
    tl.to(panelRef.current, { x: "100%", duration: 0.4, ease: "power3.in" });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.1);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        justifyContent: "flex-end",
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Welcome to Wholesale"
    >
      {/* Backdrop — 25% white */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255, 255, 255, 0.25)",
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Panel — slides in from right, covers most of the screen */}
      <div
        ref={panelRef}
        style={{
          position: "relative",
          width: "calc(100% - 16px)",
          maxWidth: "none",
          height: "100%",
          background: "#ffffff",
          borderRadius: "24px 0 0 24px",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.12)",
          overflow: "hidden",
          transform: "translateX(100%)",
        }}
      >
        <WelcomeTourContent
          onComplete={handleClose}
          userName="John"
        />
      </div>
    </div>
  );
};
