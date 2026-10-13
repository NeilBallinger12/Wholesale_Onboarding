import { useState } from "react";

import { DashboardNav } from "../components/DashboardNav";
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
import { UserTable } from "../components/UserTable";
import { WelcomeBTModule } from "../components/WelcomeBTModule";

import { type Product } from "../data/products";

interface DashboardPageProps {
  /** Navigate to the Add Company Info page */
  onGoToCompanyInfo: () => void;
  /** Whether company info has been submitted */
  companyInfoSubmitted: boolean;
  /** Skip the tour overlay (already been shown) */
  skipTour?: boolean;
  /** Called when the tour has been seen so it's not replayed */
  onTourSeen?: () => void;
}

export const DashboardPage = ({ onGoToCompanyInfo, companyInfoSubmitted, skipTour, onTourSeen }: DashboardPageProps) => {
  const [toastVisible, setToastVisible] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [lockedProduct, setLockedProduct] = useState<Product | null>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [tourVisible, setTourVisible] = useState(!skipTour);

  return (
    <div className="btw-page">
      <DashboardNav />

      <DashboardToast
        isOpen={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      <main style={{ flex: 1 }}>
        <PageHeader />

        <WelcomeBTModule
          onGoToCompanyInfo={onGoToCompanyInfo}
          companyInfoSubmitted={companyInfoSubmitted}
        />

        <GettingStartedBanner />

        <ProductsSection
          onOrder={() => setOrderModalOpen(true)}
          onUnlock={(p) => setLockedProduct(p)}
          onTrack={(p) => setPendingProduct(p)}
        />

        <UserTable />

        <OrdersModule />

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

      {/* First-time tour overlay */}
      {tourVisible && (
        <DashboardTour onClose={() => {
          setTourVisible(false);
          onTourSeen?.();
        }} />
      )}
    </div>
  );
};
