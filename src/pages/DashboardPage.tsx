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

import { type Product } from "../data/products";

export const DashboardPage = () => {
  const [toastVisible, setToastVisible] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [lockedProduct, setLockedProduct] = useState<Product | null>(null);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [tourVisible, setTourVisible] = useState(true);

  return (
    <div className="btw-page">
      <DashboardNav />

      <DashboardToast
        isOpen={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      <main style={{ flex: 1 }}>
        <PageHeader />

        <GettingStartedBanner />

        <ProductsSection
          onOrder={() => setOrderModalOpen(true)}
          onUnlock={(p) => setLockedProduct(p)}
          onTrack={(p) => setPendingProduct(p)}
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

      {/* First-time tour overlay */}
      {tourVisible && (
        <DashboardTour onClose={() => setTourVisible(false)} />
      )}
    </div>
  );
};
