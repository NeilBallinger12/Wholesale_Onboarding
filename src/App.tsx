import { useState } from "react";

import { DashboardPage } from "./pages/DashboardPage";
import { AddCompanyInfoPage } from "./pages/AddCompanyInfoPage";
import { AddBillingPage } from "./pages/AddBillingPage";
import { AddBrandingPage } from "./pages/AddBrandingPage";
import { AddTeamPage } from "./pages/AddTeamPage";
import { ApproveCommercialsPage } from "./pages/ApproveCommercialsPage";
import { PrototypeNav } from "./components/PrototypeNav";
import { type TeamUser } from "./components/InviteUserDrawer";

type Page = "dashboard" | "add-company-info" | "add-billing" | "add-branding" | "add-team" | "approve-commercials";

export const App = () => {
  const [page, setPage] = useState<Page>("dashboard");
  const [companySubmitted, setCompanySubmitted] = useState(false);
  const [billingSubmitted, setBillingSubmitted] = useState(false);
  const [billingAccountNumber, setBillingAccountNumber] = useState("");
  const [brandingSubmitted, setBrandingSubmitted] = useState(false);
  const [commercialsSubmitted, setCommercialsSubmitted] = useState(false);
  const [tourSeen, setTourSeen] = useState(false);

  // Lifted branding state — shared across nav and all pages
  const [brandLogoUrl, setBrandLogoUrl] = useState<string>("");
  const [brandPrimaryColour, setBrandPrimaryColour] = useState<string>("");

  // Team state — persisted at app level so dashboard module stays in sync
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);

  // Notification trigger key — incrementing forces DashboardPage to fire the toast
  const [commercialNotifKey, setCommercialNotifKey] = useState(0);

  const goToDashboard = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPage("dashboard");
  };

  const handleUserAdded = (user: TeamUser) => {
    setTeamUsers((prev) => [...prev, user]);
  };

  /** Apply a prototype state preset */
  const handlePrototypeApply = (state: {
    companySubmitted: boolean;
    billingSubmitted: boolean;
    billingAccountNumber: string;
    commercialsSubmitted: boolean;
    teamSubmitted: boolean;
    brandingSubmitted: boolean;
    triggerCommercialNotification: boolean;
  }) => {
    setCompanySubmitted(state.companySubmitted);
    setBillingSubmitted(state.billingSubmitted);
    setBillingAccountNumber(state.billingAccountNumber);
    setCommercialsSubmitted(state.commercialsSubmitted);
    setBrandingSubmitted(state.brandingSubmitted);
    setTourSeen(true); // never replay onboarding tour when jumping states
    setTeamUsers([]); // reset team for clean state

    // If branding wasn't preserved in this step, clear it
    if (!state.brandingSubmitted) {
      setBrandLogoUrl("");
      setBrandPrimaryColour("");
    }

    // Trigger commercial notification if requested
    if (state.triggerCommercialNotification) {
      setCommercialNotifKey((k) => k + 1);
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    setPage("dashboard");
  };

  return (
    <div
      style={
        brandPrimaryColour
          ? ({
              "--btw-color-brand-primary": brandPrimaryColour,
            } as React.CSSProperties)
          : undefined
      }
    >
      {page === "dashboard" && (
        <DashboardPage
          onGoToCompanyInfo={() => { setTourSeen(true); setPage("add-company-info"); }}
          onGoToBilling={() => { setTourSeen(true); setPage("add-billing"); }}
          onGoToBranding={() => { setTourSeen(true); setPage("add-branding"); }}
          onGoToTeam={() => { setTourSeen(true); setPage("add-team"); }}
          onGoToCommercials={() => { setTourSeen(true); setPage("approve-commercials"); }}
          companyInfoSubmitted={companySubmitted}
          billingSubmitted={billingSubmitted}
          billingAccountNumber={billingAccountNumber}
          brandingSubmitted={brandingSubmitted}
          commercialsSubmitted={commercialsSubmitted}
          teamUsers={teamUsers}
          teamSubmitted={teamUsers.length > 0}
          brandLogoUrl={brandLogoUrl}
          skipTour={tourSeen}
          onTourSeen={() => setTourSeen(true)}
          // Pass the notification trigger key — DashboardPage uses it to fire the toast
          commercialNotifKey={commercialNotifKey}
        />
      )}
      {page === "add-company-info" && (
        <AddCompanyInfoPage
          onBack={goToDashboard}
          onSubmitted={() => { setCompanySubmitted(true); goToDashboard(); }}
        />
      )}
      {page === "add-billing" && (
        <AddBillingPage
          onBack={goToDashboard}
          onSubmitted={(accountNumber) => {
            setBillingSubmitted(true);
            setBillingAccountNumber(accountNumber);
            goToDashboard();
          }}
        />
      )}
      {page === "add-branding" && (
        <AddBrandingPage
          onBack={goToDashboard}
          initialLogoUrl={brandLogoUrl}
          initialPrimaryColour={brandPrimaryColour}
          onSubmitted={(logoUrl, primaryColour) => {
            setBrandLogoUrl(logoUrl);
            setBrandPrimaryColour(primaryColour);
            setBrandingSubmitted(true);
            goToDashboard();
          }}
        />
      )}
      {page === "add-team" && (
        <AddTeamPage
          onBack={goToDashboard}
          users={teamUsers}
          onUserAdded={handleUserAdded}
          brandLogoUrl={brandLogoUrl}
        />
      )}
      {page === "approve-commercials" && (
        <ApproveCommercialsPage
          onBack={goToDashboard}
          onSubmitted={() => { setCommercialsSubmitted(true); goToDashboard(); }}
        />
      )}

      {/* Prototype navigation — floating bottom-right, visible on all pages */}
      <PrototypeNav
        onApply={handlePrototypeApply}
        currentBrandLogoUrl={brandLogoUrl}
        currentBrandPrimaryColour={brandPrimaryColour}
        currentBrandingSubmitted={brandingSubmitted}
      />
    </div>
  );
};
