import {
  NavigationHeader,
  NavigationHeaderAction,
  NavigationHeaderActionBar,
  type NavigationHeaderNavLinkItem,
} from "@arc-ui/components/NavigationHeader";

import { BtIconQuestion } from "@arc-ui/icons/BtIconQuestion";
import { BtIconUser } from "@arc-ui/icons/BtIconUser";

export const DashboardNav = () => {
  const navItems: NavigationHeaderNavLinkItem[] = [
    { type: "link", text: "Dashboard", href: "#" },
    { type: "link", text: "Orders", href: "#" },
    { type: "link", text: "Assets", href: "#" },
    { type: "link", text: "Faults", href: "#" },
    { type: "link", text: "Billing", href: "#" },
    { type: "link", text: "Reporting", href: "#" },
    { type: "link", text: "Product", href: "#" },
    { type: "link", text: "Sales and marketing", href: "#" },
  ];

  return (
    <NavigationHeader
      navItems={navItems}
      rightSlot={
        <NavigationHeaderActionBar>
          {/* Admin text button — no Arc dropdown nav item at this level */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "16px",
              color: "var(--btw-color-text-primary)",
              padding: "8px",
              fontFamily: "inherit",
            }}
            aria-haspopup="true"
            aria-expanded="false"
          >
            Admin ▾
          </button>
          <NavigationHeaderAction
            ariaLabel="Help"
            icon={BtIconQuestion}
            title="Help"
          />
          <NavigationHeaderAction
            ariaLabel="Account"
            icon={BtIconUser}
            title="My account"
          />
        </NavigationHeaderActionBar>
      }
    />
  );
};
