import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Rule } from "@arc-ui/components/Rule";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconUserAdd } from "@arc-ui/icons/BtIconUserAdd";
import { BtIconUserGroups } from "@arc-ui/icons/BtIconUserGroups";

import { type TeamUser } from "./InviteUserDrawer";

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
        padding: "0 8px",
        height: "24px",
        borderRadius: "1000px",
        background: colours.bg,
        color: colours.text,
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

/* ── Profile badge ──────────────────────────────────────────── */
const ProfileBadge = ({ type }: { type: "administrator" | "standard" }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
      height: "24px",
      borderRadius: "1000px",
      background: type === "administrator" ? "#f3eeff" : "#f0f0f0",
      color: type === "administrator" ? "#5514b4" : "#2a2a2a",
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    {type === "administrator" ? "Partner Admin" : "Standard User"}
  </span>
);

/* ── Capability label map ─────────────────────────────────────── */
const capabilityLabels: Record<string, string> = {
  "sales-ordering": "Sales & Ordering",
  "service-operations": "Service Operations",
  "billing-reporting": "Billing & Reporting",
  "read-only": "Read only",
};

/* ── Table header cell ──────────────────────────────────────── */
const Th = ({
  children,
  width,
}: {
  children: React.ReactNode;
  width?: string;
}) => (
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

/* ── Populated table ────────────────────────────────────────── */
const PopulatedTable = ({ users }: { users: TeamUser[] }) => (
  <div style={{ overflowX: "auto", width: "100%" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "auto",
      }}
      aria-label="Organisation users"
    >
      <thead>
        <tr>
          <Th width="22%">Name</Th>
          <Th width="16%">Profile type</Th>
          <Th width="24%">Role / Capabilities</Th>
          <Th width="20%">Organisation</Th>
          <Th width="12%">Status</Th>
          <Th width="6%">Added</Th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => (
          <tr
            key={user.id}
            style={{
              background: i % 2 === 0 ? "#ffffff" : "#f7f7f7",
            }}
          >
            <Td>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
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
                <Text size="s" tone="muted" elementType="span">—</Text>
              )}
            </Td>
            <Td>
              <span style={{ color: "#434343" }}>{user.organisation}</span>
            </Td>
            <Td>
              <StatusBadge status={user.status} />
            </Td>
            <Td>
              <span style={{ color: "#6b6b6b", fontSize: "12px" }}>{user.added}</span>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Empty state ────────────────────────────────────────────── */
const EmptyState = ({ onInvite }: { onInvite?: () => void }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 32px",
      gap: "16px",
      background: "#ffffff",
      borderRadius: "16px",
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
      aria-hidden="true"
    >
      <Icon icon={BtIconUserGroups} size={36} />
    </div>

    <Heading level="3" size="s" align="center">
      No users added yet
    </Heading>

    <Text size="m" tone="supporting" elementType="p" align="center">
      Add your team members to give them access to the portal. You can set their
      roles and permissions once they've been invited.
    </Text>

    <VerticalSpace size="8" />

    <ButtonV2
      label="Add your first user"
      buttonStyle="primary"
      size="m"
      icon={BtIconUserAdd}
      iconPosition="beforeText"
      onClick={onInvite}
    />
  </div>
);

/* ── Main module ────────────────────────────────────────────── */
interface UserTableProps {
  /** Pass populated users to show the table, omit for empty state */
  users?: TeamUser[];
  /** Called when the user clicks the invite/add button */
  onInvite?: () => void;
}

export const UserTable = ({ users, onInvite }: UserTableProps) => {
  const isEmpty = !users || users.length === 0;

  return (
    <div className="btw-page-section">
      {/* Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "32px",
          border: "1px solid var(--btw-color-border-mid)",
          padding: "32px",
          boxSizing: "border-box",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <Heading level="2" size="m">
              Your team
            </Heading>
            <VerticalSpace size="4" />
            <Text size="m" tone="supporting" elementType="p">
              Manage the users in your organisation. Add team members, assign
              roles and control their access to the portal.
            </Text>
          </div>

          {!isEmpty && (
            <ButtonV2
              label="Add user"
              buttonStyle="primary"
              size="m"
              icon={BtIconUserAdd}
              iconPosition="beforeText"
              onClick={onInvite}
            />
          )}
        </div>

        <Rule />

        {/* Content */}
        {isEmpty ? <EmptyState onInvite={onInvite} /> : <PopulatedTable users={users!} />}
      </div>

      <VerticalSpace size="48" />
    </div>
  );
};
