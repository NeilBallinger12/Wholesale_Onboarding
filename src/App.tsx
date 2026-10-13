import { useState } from "react";

import { DashboardPage } from "./pages/DashboardPage";
import { AddCompanyInfoPage } from "./pages/AddCompanyInfoPage";

type Page = "dashboard" | "add-company-info";

export const App = () => {
  const [page, setPage] = useState<Page>("dashboard");
  const [companySubmitted, setCompanySubmitted] = useState(false);
  // Track whether the tour has already been shown so it doesn't replay
  const [tourSeen, setTourSeen] = useState(false);

  const goToDashboard = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPage("dashboard");
  };

  return (
    <>
      {page === "dashboard" && (
        <DashboardPage
          onGoToCompanyInfo={() => {
            setTourSeen(true);
            setPage("add-company-info");
          }}
          companyInfoSubmitted={companySubmitted}
          skipTour={tourSeen}
          onTourSeen={() => setTourSeen(true)}
        />
      )}
      {page === "add-company-info" && (
        <AddCompanyInfoPage
          onBack={goToDashboard}
          onSubmitted={() => {
            setCompanySubmitted(true);
            goToDashboard();
          }}
        />
      )}
    </>
  );
};
