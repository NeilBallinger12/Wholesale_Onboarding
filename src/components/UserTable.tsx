import { Heading } from "@arc-ui/components/Heading";
import { Text } from "@arc-ui/components/Text";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { ButtonV2 } from "@arc-ui/components/ButtonV2";
import { Rule } from "@arc-ui/components/Rule";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconUserAdd } from "@arc-ui/icons/BtIconUserAdd";
import { BtIconUserGroups } from "@arc-ui/icons/BtIconUserGroups";

/* ── Types ──────────────────────────────────────────────────── */
type UserRole = "Super admin" | "Admin" | "User";
type UserStatus = "Active" | "Pending" | "Inactive";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  added: string;
}

/* ── Sample data for the populated state (not used here) ─────── */
export const sampleUsers: User[] = [
  {
    id: "1",
    name: "Neil Ballinger",
    email: "neil.ballinger@giacom.com",
    role: "Super admin",
    status: "Active",
    added: "10 Mar 2026",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@giacom.com",
    role: "Admin",
    status: "Active",
    added: "12 Mar 2026",
  },
  {
    id: "3",
    name: "James Wright",
    email: "james.wright@giacom.com",
    role: "User",
    status: "Pending",
    added: "14 Mar 2026",
  },
];

/* ── Status badge ───────────────────────────────────────────── */
const statusColours: Record<UserStatus, { bg: string; text: string }> = {
  Active: { bg: "#e6f4e5", text: "#036c01" },
  Pending: { bg: "#fff8e1", text: "#7a4f00" },
  Inactive: { bg: "#f0f0f0", text: "#2a2a2a" },
};

const StatusBadge = ({ status }: { status: UserStatus }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
      height: "24px",
      borderRadius: "1000px",
      background: statusColours[status].bg,
      color: statusColours[status].text,
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    {status}
  </span>
);

/* ── Role badge ─────────────────────────────────────────────── */
const RoleBadge = ({ role }: { role: UserRole }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
      height: "24px",
      borderRadius: "1000px",
      background: role === "Super admin" ? "#f3eeff" : "#f0f0f0",
      color: role === "Super admin" ? "#5514b4" : "#2a2a2a",
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    {role}
  </span>
);

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
const PopulatedTable = ({ users }: { users: User[] }) => (
  <div style={{ overflowX: "auto", width: "100%" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
      }}
      aria-label="Organisation users"
    >
      <thead>
        <tr>
          <Th width="25%">Name</Th>
          <Th width="30%">Email</Th>
          <Th width="18%">Role</Th>
          <Th width="14%">Status</Th>
          <Th width="13%">Date added</Th>
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
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <strong>{user.name}</strong>
              </div>
            </Td>
            <Td>
              <span style={{ color: "#434343" }}>{user.email}</span>
            </Td>
            <Td>
              <RoleBadge role={user.role} />
            </Td>
            <Td>
              <StatusBadge status={user.status} />
            </Td>
            <Td>
              <span style={{ color: "#6b6b6b" }}>{user.added}</span>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Empty state ────────────────────────────────────────────── */
const EmptyState = () => (
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
    />
  </div>
);

/* ── Main module ────────────────────────────────────────────── */
interface UserTableProps {
  /** Pass populated users to show the table, omit for empty state */
  users?: User[];
}

export const UserTable = ({ users }: UserTableProps) => {
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
            />
          )}
        </div>

        <Rule />

        {/* Content */}
        {isEmpty ? <EmptyState /> : <PopulatedTable users={users!} />}
      </div>

      <VerticalSpace size="48" />
    </div>
  );
};
