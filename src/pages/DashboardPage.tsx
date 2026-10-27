import { useState, useEffect, useRef } from "react";

import { ToastNotification } from "@arc-ui/components/Toast";

import { DashboardNav, type AppNotification } from "../components/DashboardNav";
import { PageHeader } from "../components/PageHeader";
import { GettingStartedBanner } from "../components/GettingStartedBanner";
import { ProductsSection } from "../components/ProductsSection";
import { UpdatesAndBriefings } from "../components/UpdatesAndBriefings";
import { UsefulApps } from "../components/UsefulApps";
import { EventsLearning } from "../components/EventsLearning";
import { HelpUsImprove } from "../components/HelpUsImprove";
import { DashboardFooter } from "../components/DashboardFooter";
import { OrderModal } from "../components/OrderModal";
import { LockedModal, PendingModal } from "../components/LockedModal";
import { DashboardToast } from "../components/DashboardToast";
import { DashboardTour } from "../components/DashboardTour";
import { OrdersModule } from "../components/OrdersModule";
import { TrainingModule } from "../components/TrainingModule";
import { UserTable } from "../components/UserTable";
import { WelcomeBTModule } from "../components/WelcomeBTModule";

import { type Product } from "../data/products";
import { type TeamUser } from "../components/InviteUserDrawer";

interface DashboardPageProps {
  onGoToCompanyInfo: () => void;
  onGoToBilling: () => void;
  onGoToBranding: () => void;
  onGoToTeam: () => void;
  onGoToCommercials: () => void;
  companyInfoSubmitted: boolean;
  billingSubmitted: boolean;
  billingAccountNumber: string;
  brandingSubmitted: boolean;
  commercialsSubmitted: boolean;
  teamUsers: TeamUser[];
  teamSubmitted: boolean;
  brandLogoUrl?: string;
  skipTour?: boolean;
  onTourSeen?: () => void;
  /** Increment to trigger the commercial notification toast (from prototype nav) */
  commercialNotifKey?: number;
}

export const DashboardPage = ({
  onGoToCompanyInfo,
  onGoToBilling,
  onGoToBranding,
  onGoToTeam,
  onGoToCommercials,
  companyInfoSubmitted,
  billingSubmitted,
  billingAccountNumber,
  brandingSubmitted,
  commercialsSubmitted,
  teamUsers,
  teamSubmitted,
  brandLogoUrl,
  skipTour,
  onTourSeen,
  commercialNotifKey = 0,
}: DashboardPageProps) => {
  const [toastVisible, setToastVisible] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [lockedProduct, setLockedProduct] = useState<Product | null>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [tourVisible, setTourVisible] = useState(!skipTour);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [commercialToastOpen, setCommercialToastOpen] = useState(false);
  const [billingCreatedToastOpen, setBillingCreatedToastOpen] = useState(false);

  // Stable ref for onGoToCommercials to avoid stale closure in notification
  const onGoToCommercialsRef = useRef(onGoToCommercials);
  useEffect(() => { onGoToCommercialsRef.current = onGoToCommercials; });

  // Stable ref for onGoToBilling
  const onGoToBillingRef = useRef(onGoToBilling);
  useEffect(() => { onGoToBillingRef.current = onGoToBilling; });

  // When billing is submitted OR prototype nav triggers it, inject notification + toast
  useEffect(() => {
    if ((billingSubmitted || commercialNotifKey > 0) && !commercialsSubmitted) {
      setNotifications((prev) => {
        const alreadyExists = prev.some((n) => n.id === "notif-commercials-ready");
        if (alreadyExists) return prev;
        return [
          {
            id: "notif-commercials-ready",
            title: "Your commercial agreement is ready",
            body: "Your commercial agreement with BT and the Digital Voice price book are now ready for your review and signature.",
            timestamp: "Just now",
            read: false,
            type: "info" as const,
            actionLabel: "View commercial information",
            onAction: () => onGoToCommercialsRef.current(),
          },
          ...prev,
        ];
      });
      setCommercialToastOpen(true);
    }
  }, [billingSubmitted, commercialNotifKey, commercialsSubmitted]);

  // When commercials are approved, notify user that their billing account is active
  useEffect(() => {
    if (commercialsSubmitted) {
      setNotifications((prev) => {
        const alreadyExists = prev.some((n) => n.id === "notif-billing-active");
        if (alreadyExists) return prev;
        return [
          {
            id: "notif-billing-active",
            title: "Your billing account is now active",
            body: `Billing account ${billingAccountNumber || "BTA-830241"} has been created. You can now view your invoices and account details.`,
            timestamp: "Just now",
            read: false,
            type: "success" as const,
            actionLabel: "View billing details",
            onAction: () => onGoToBillingRef.current(),
          },
          ...prev,
        ];
      });
      setBillingCreatedToastOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commercialsSubmitted]);

  // When a team user is invited, add notification
  const prevTeamUsersLenRef = useRef(teamUsers.length);
  useEffect(() => {
    if (teamUsers.length > prevTeamUsersLenRef.current) {
      const latest = teamUsers[teamUsers.length - 1];
      setNotifications((prev) => [
        {
          id: `notif-invite-${latest.id}`,
          title: "Invitation sent",
          body: `An invitation has been sent to ${latest.firstName} ${latest.surname} (${latest.email}).`,
          timestamp: "Just now",
          read: false,
          type: "success",
        },
        ...prev.filter((n) => n.id !== `notif-invite-${latest.id}`),
      ]);
    }
    prevTeamUsersLenRef.current = teamUsers.length;
  }, [teamUsers.length, teamUsers]);

  return (
    <div className="btw-page">
      <DashboardNav
        brandLogoUrl={brandLogoUrl}
        notifications={notifications}
        onNotificationAction={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
      />

      {/* Billing-submitted commercial agreement toast */}
      <ToastNotification
        title="Your commercial agreement is ready to review"
        isOpen={commercialToastOpen}
        onOpenChange={(open) => {
          setCommercialToastOpen(open);
        }}
        status="general"
        isCloseButtonVisible
        link={{
          text: "View commercial information",
          onClick: () => {
            setCommercialToastOpen(false);
            onGoToCommercialsRef.current();
          },
        }}
      />

      {/* Commercials approved — billing account created toast */}
      <ToastNotification
        title="Your billing account has been created"
        isOpen={billingCreatedToastOpen}
        onOpenChange={(open) => {
          setBillingCreatedToastOpen(open);
        }}
        status="success"
        isCloseButtonVisible
        link={{
          text: "View now",
          onClick: () => {
            setBillingCreatedToastOpen(false);
            onGoToBillingRef.current();
          },
        }}
      />

      <DashboardToast
        isOpen={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      <main style={{ flex: 1 }}>
        <PageHeader billingAccountNumber={billingAccountNumber} />

        <WelcomeBTModule
          onGoToCompanyInfo={onGoToCompanyInfo}
          onGoToBilling={onGoToBilling}
          onGoToBranding={onGoToBranding}
          onGoToTeam={onGoToTeam}
          onGoToCommercials={onGoToCommercials}
          companyInfoSubmitted={companyInfoSubmitted}
          billingSubmitted={billingSubmitted}
          brandingSubmitted={brandingSubmitted}
          teamSubmitted={teamSubmitted}
          commercialsSubmitted={commercialsSubmitted}
        />

        <GettingStartedBanner />

        <ProductsSection
          onOrder={() => setOrderModalOpen(true)}
          onUnlock={(p) => setLockedProduct(p)}
          onTrack={(p) => setPendingProduct(p)}
          commercialsSubmitted={commercialsSubmitted}
        />

        <UserTable users={teamUsers} onInvite={onGoToTeam} />

        <OrdersModule />

        <TrainingModule
          companyInfoSubmitted={companyInfoSubmitted}
          commercialsSubmitted={commercialsSubmitted}
          billingSubmitted={billingSubmitted}
          teamSubmitted={teamSubmitted}
        />

        <UpdatesAndBriefings />

        <UsefulApps />

        <EventsLearning />

        <HelpUsImprove />
      </main>

      <DashboardFooter />

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />

      <LockedModal
        product={lockedProduct}
        onClose={() => setLockedProduct(null)}
        onRequestSubmitted={(p) =>
          setLockedProduct((prev) =>
            prev?.id === p.id ? { ...prev, accessRequested: true } : prev,
          )
        }
      />

      <PendingModal
        product={pendingProduct}
        onClose={() => setPendingProduct(null)}
      />

      {tourVisible && (
        <DashboardTour onClose={() => {
          setTourVisible(false);
          onTourSeen?.();
        }} />
      )}
    </div>
  );
};
