import { useState } from "react";

import {
  NavigationHeader,
  NavigationHeaderAction,
  NavigationHeaderActionBar,
  type NavigationHeaderNavLinkItem,
} from "@arc-ui/components/NavigationHeader";
import { BrandLogo } from "@arc-ui/components/BrandLogo";
import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Icon } from "@arc-ui/components/Icon";
import {
  Tabs,
  TabsList,
  TabsItem,
  TabsContent,
} from "@arc-ui/components/Tabs";
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
import { BtIconUserAdd } from "@arc-ui/icons/BtIconUserAdd";
import { BtIconUserGroups } from "@arc-ui/icons/BtIconUserGroups";
import { BtIconsChevronRightMid } from "@arc-ui/icons/BtIconsChevronRightMid";import { InviteUserDrawer, type TeamUser } from "../components/InviteUserDrawer";

/* ── Types ──────────────────────────────────────────────────── */
interface AddTeamPageProps {
  onBack: () => void;
  users: TeamUser[];
  onUserAdded: (user: TeamUser) => void;
  brandLogoUrl?: string;
}

/* ── Status badge ───────────────────────────────────────────── */
const statusColours: Record<string, { bg: string; text: string }> = {
  Active: { bg: "#e6f4e5", text: "#036c01" },
  Pending: { bg: "#fff8e1", text: "#7a4f00" },
  Inactive: { bg: "#f0f0f0", text: "#2a2a2a" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const colours = statusColours[status] ?? statusColours.Inactive;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "1000px",
        background: colours.bg,
        color: colours.text,
        fontSize: "12px",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

/* ── Profile type badge ─────────────────────────────────────── */
const ProfileBadge = ({ type }: { type: "administrator" | "standard" }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 10px",
      borderRadius: "1000px",
      background: type === "administrator" ? "#f3eeff" : "#f0f0f0",
      color: type === "administrator" ? "#5514b4" : "#2a2a2a",
      fontSize: "12px",
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}
  >
    {type === "administrator" ? "Partner Admin" : "Standard User"}
  </span>
);

/* ── Table header cell ──────────────────────────────────────── */
const Th = ({ children, width }: { children: React.ReactNode; width?: string }) => (
  <th
    style={{
      padding: "12px 16px",
      textAlign: "left",
      fontFamily: "BT Curve, sans-serif",
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "16px",
      color: "#6b6b6b",
      whiteSpace: "nowrap",
      width,
      borderBottom: "2px solid #d9d9d9",
      background: "#ffffff",
    }}
  >
    {children}
  </th>
);

/* ── Table data cell ────────────────────────────────────────── */
const Td = ({ children }: { children: React.ReactNode }) => (
  <td
    style={{
      padding: "14px 16px",
      fontFamily: "BT Curve, sans-serif",
      fontSize: "14px",
      lineHeight: "20px",
      color: "#2a2a2a",
      verticalAlign: "middle",
    }}
  >
    {children}
  </td>
);

/* ── Capability label map ─────────────────────────────────────── */
const capabilityLabels: Record<string, string> = {
  "sales-ordering": "Sales & Ordering",
  "service-operations": "Service Operations",
  "billing-reporting": "Billing & Reporting",
  "read-only": "Read only",
};

/* ── Empty state for users table ─────────────────────────────── */
const UsersEmptyState = ({ onInvite }: { onInvite: () => void }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 32px",
      gap: "16px",
    }}
  >
    <div
      style={{
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        background: "#f3eeff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon icon={BtIconUserGroups} size={36} />
    </div>
    <Heading level="3" size="s" align="center">
      No users added yet
    </Heading>
    <Text size="m" tone="supporting" elementType="p" align="center">
      Invite your team members and configure their access to the portal. They'll
      receive an email to set their password and get started.
    </Text>
    <VerticalSpace size="8" />
    <ButtonV2
      label="Invite your first user"
      buttonStyle="primary"
      size="m"
      icon={BtIconUserAdd}
      iconPosition="beforeText"
      onClick={onInvite}
    />
  </div>
);

/* ── Users table ─────────────────────────────────────────────── */
const UsersTable = ({ users }: { users: TeamUser[] }) => (
  <div style={{ overflowX: "auto", width: "100%" }}>
    <table
      style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}
      aria-label="Team members"
    >
      <thead>
        <tr>
          <Th width="22%">Name</Th>
          <Th width="18%">Profile type</Th>
          <Th width="24%">Role / Capabilities</Th>
          <Th width="18%">Organisation</Th>
          <Th width="10%">Status</Th>
          <Th width="8%">&nbsp;</Th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => (
          <tr
            key={user.id}
            style={{ background: i % 2 === 0 ? "#ffffff" : "#f7f7f7" }}
          >
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#e8d5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#5514b4",
                  }}
                  aria-hidden="true"
                >
                  {user.firstName[0]}{user.surname[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{user.firstName} {user.surname}</div>
                  <div style={{ fontSize: "12px", color: "#6b6b6b" }}>{user.email}</div>
                </div>
              </div>
            </Td>
            <Td>
              <ProfileBadge type={user.profileType} />
            </Td>
            <Td>
              {user.profileType === "administrator" ? (
                <Text size="s" tone="supporting" elementType="span">Full access</Text>
              ) : user.capabilities.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {user.capabilities.map((c) => (
                    <span
                      key={c}
                      style={{
                        display: "inline-flex",
                        padding: "2px 8px",
                        borderRadius: "1000px",
                        background: "#f0f0f0",
                        color: "#2a2a2a",
                        fontSize: "11px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {capabilityLabels[c] ?? c}
                    </span>
                  ))}
                </div>
              ) : (
                <Text size="s" tone="muted" elementType="span">None selected</Text>
              )}
            </Td>
            <Td>
              <Text size="s" elementType="span">{user.organisation}</Text>
            </Td>
            <Td>
              <StatusBadge status={user.status} />
            </Td>
            <Td>
              <Icon icon={BtIconsChevronRightMid} size={20} />
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Roles & Permissions tab content ─────────────────────────── */
const RolesTab = () => {
  const adminCapabilities = [
    { title: "Manage organisation settings", desc: "Update company details, billing contacts and portal preferences." },
    { title: "Create and manage Partner Organisations", desc: "Add sub-organisations and manage their access to services." },
    { title: "Create, edit and remove users", desc: "Full control over user accounts within the organisation." },
    { title: "Assign roles and capabilities", desc: "Grant or revoke access levels for any user." },
    { title: "Manage product entitlements", desc: "Enable and configure products available to end customers." },
    { title: "Billing, invoices and reporting", desc: "View all invoices, raise billing queries and export reports." },
  ];

  const standardCapabilities = [
    { id: "sales-ordering", title: "Sales & Ordering", desc: "Place and manage orders for hardware and services, including number porting requests." },
    { id: "service-operations", title: "Service Operations", desc: "Raise and track fault tickets, run diagnostics and manage support cases." },
    { id: "billing-reporting", title: "Billing & Reporting", desc: "View invoices, query charges and export usage and financial reports." },
    { id: "read-only", title: "Read only", desc: "View all areas of the portal but cannot make changes or place orders." },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Partner Administrator */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f3eeff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon icon={BtIconUserGroups} size={20} />
            </div>
            <div>
              <Text size="m" elementType="span"><strong>Partner Administrator</strong></Text>
              <br />
              <Text size="s" tone="supporting" elementType="span">Full access to all portal features and settings</Text>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {adminCapabilities.map((cap, i) => (
              <div
                key={cap.title}
                style={{
                  padding: "12px 16px",
                  background: i % 2 === 0 ? "#f7f7f7" : "#ffffff",
                  borderRadius: i === 0 ? "8px 8px 0 0" : i === adminCapabilities.length - 1 ? "0 0 8px 8px" : "0",
                  border: "1px solid #f0f0f0",
                  borderTop: i === 0 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <Text size="s" elementType="p"><strong>{cap.title}</strong></Text>
                <Text size="s" tone="muted" elementType="p">{cap.desc}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Standard User */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon icon={BtIconUser} size={20} />
            </div>
            <div>
              <Text size="m" elementType="span"><strong>Standard User</strong></Text>
              <br />
              <Text size="s" tone="supporting" elementType="span">Assigned specific capabilities by an Administrator</Text>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {standardCapabilities.map((cap) => (
              <div
                key={cap.id}
                style={{
                  padding: "14px 16px",
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e8e8e8",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#5514b4", flexShrink: 0, marginTop: "6px" }} />
                <div>
                  <Text size="s" elementType="p"><strong>{cap.title}</strong></Text>
                  <Text size="s" tone="muted" elementType="p">{cap.desc}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main page ──────────────────────────────────────────────── */
export const AddTeamPage = ({
  onBack,
  users,
  onUserAdded,
  brandLogoUrl,
}: AddTeamPageProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: NavigationHeaderNavLinkItem[] = [
    { type: "link", text: "Dashboard", href: "#", onClick: (e) => { e.preventDefault(); onBack(); } },
    { type: "link", text: "Users", href: "#" },
    { type: "link", text: "Products", href: "#" },
    { type: "link", text: "Orders", href: "#" },
    { type: "link", text: "Billing", href: "#" },
  ];

  const logoSlot = brandLogoUrl ? (
    <img
      src={brandLogoUrl}
      alt="Brand logo"
      style={{ height: "40px", maxWidth: "160px", objectFit: "contain" }}
    />
  ) : (
    <BrandLogo size={40} />
  );

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.surname} ${u.email} ${u.organisation}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="btw-page">
      {/* Nav */}
      <NavigationHeader
        isFluid
        navItems={navItems}
        logo={{ svg: undefined }}
        leftSlot={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {logoSlot}
          </div>
        }
        rightSlot={
          <NavigationHeaderActionBar>
            <NavigationHeaderAction ariaLabel="Help" icon={BtIconQuestion} title="Help" />
            <NavigationHeaderAction ariaLabel="Account" icon={BtIconUser} title="My account" />
          </NavigationHeaderActionBar>
        }
      />

      <main style={{ flex: 1 }}>
        {/* Page header */}
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e8e8e8",
            padding: "24px 0",
          }}
        >
          <div className="btw-page-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <button
              onClick={onBack}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "BT Curve, sans-serif",
                fontSize: "14px",
                color: "#5514b4",
                marginBottom: "16px",
              }}
            >
              <Icon icon={BtIconArrowLeft} size={16} />
              Back to dashboard
            </button>

            <Heading level="1" size="l">
              Roles &amp; permissions
            </Heading>
            <VerticalSpace size="8" />
            <Text size="m" tone="supporting" elementType="p">
              Manage your team members, their access levels and audit activity
              across the portal.
            </Text>
          </div>
        </div>

        <VerticalSpace size="32" />

        {/* Main content card */}
        <div className="btw-page-section" style={{ paddingTop: 0 }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid var(--btw-color-border-mid)",
              overflow: "hidden",
            }}
          >
            <Tabs defaultValue="users">
              <TabsList>
                <TabsItem
                  label={users.length > 0 ? `Users (${users.length})` : "Users"}
                  value="users"
                />
                <TabsItem label="Roles & permissions" value="roles" />
                <TabsItem label="Audit log" value="audit" />
              </TabsList>

              {/* Toolbar — always visible */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid #f0f0f0",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: "1 1 280px",
                  }}
                >
                  <input
                    type="search"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search users"
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d9d9d9",
                      fontFamily: "BT Curve, sans-serif",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <ButtonV2
                  label="Invite user"
                  buttonStyle="primary"
                  size="m"
                  icon={BtIconUserAdd}
                  iconPosition="beforeText"
                  onClick={() => setDrawerOpen(true)}
                />
              </div>

              {/* Users tab content */}
              <TabsContent value="users">
                {filteredUsers.length === 0 ? (
                  <UsersEmptyState onInvite={() => setDrawerOpen(true)} />
                ) : (
                  <UsersTable users={filteredUsers} />
                )}
              </TabsContent>

              <TabsContent value="roles">
                <RolesTab />
              </TabsContent>

              <TabsContent value="audit">
                <div style={{ padding: "64px 32px", textAlign: "center" }}>
                  <Heading level="3" size="s">Audit log coming soon</Heading>
                  <VerticalSpace size="8" />
                  <Text size="m" tone="supporting" elementType="p">User activity tracking will appear here.</Text>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <VerticalSpace size="64" />
      </main>

      {/* Footer */}
      <SiteFooterV2 slogan="All business. No drama.">
        <SiteFooterV2Main columns={4}>
          <SiteFooterV2ItemGroup title="Explore BT">
            <SiteFooterV2Item href="#">For Wholesale</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Useful links">
            <SiteFooterV2Item href="#">Help and support</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Contact BT</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Legal">
            <SiteFooterV2Item href="#">Privacy policy</SiteFooterV2Item>
            <SiteFooterV2Item href="#">Terms of use</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
          <SiteFooterV2ItemGroup title="Follow us">
            <SiteFooterV2Item href="#">LinkedIn</SiteFooterV2Item>
          </SiteFooterV2ItemGroup>
        </SiteFooterV2Main>
        <SiteFooterV2Utility copyrightYear={new Date()}>
          BT Group plc
        </SiteFooterV2Utility>
      </SiteFooterV2>

      {/* Invite drawer */}
      <InviteUserDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUserAdded={(user) => {
          onUserAdded(user);
        }}
      />
    </div>
  );
};
