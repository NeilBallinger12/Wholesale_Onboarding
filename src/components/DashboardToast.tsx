import { Toast, ToastNotification } from "@arc-ui/components/Toast";

interface DashboardToastProps {
  /** Whether the toast is visible */
  isOpen: boolean;
  /** Dismiss callback */
  onDismiss: () => void;
}

export const DashboardToast = ({ isOpen, onDismiss }: DashboardToastProps) => {
  return (
    <Toast>
      <ToastNotification
        title="Onboarding complete — we reuse the credit, legal and billing checks from your original onboarding."
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onDismiss();
        }}
        isCloseButtonVisible
        status="success"
      />
    </Toast>
  );
};
