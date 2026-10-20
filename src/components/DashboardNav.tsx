import { useState } from "react";

import {
  NavigationHeader,
  NavigationHeaderAction,
  NavigationHeaderActionBar,
  type NavigationHeaderNavLinkItem,
} from "@arc-ui/components/NavigationHeader";
import { BrandLogo } from "@arc-ui/components/BrandLogo";
import { Drawer, DrawerHeader, DrawerContent } from "@arc-ui/components/Drawer";
import { Text } from "@arc-ui/components/Text";
import { Heading } from "@arc-ui/components/Heading";
import { VerticalSpace } from "@arc-ui/components/VerticalSpace";
import { Icon } from "@arc-ui/components/Icon";

import { BtIconQuestion } from "@arc-ui/icons/BtIconQuestion";
import { BtIconUser } from "@arc-ui/icons/BtIconUser";
import { BtIconNotification } from "@arc-ui/icons/BtIconNotification";

/* ── Notification type ──────────────────────────────────────── */
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning";
  actionLabel?: string;
  onAction?: () => void;
}

interface DashboardNavProps {
  /** Custom logo URL — replaces the BT BrandLogo when set */
  brandLogoUrl?: string;
  /** Notifications to show in the bell panel */
  notifications?: AppNotification[];
  /** Called when user clicks a notification action */
  onNotificationAction?: (id: string) => void;
  /** Mark notification as read */
  onNotificationRead?: (id: string) => void;
}

/* ── Notification item ──────────────────────────────────────── */
const typeColours: Record<AppNotification["type"], { dot: string; bg: string }> = {
  info:    { dot: "#5514b4", bg: "#f3eeff" },
  success: { dot: "#036c01", bg: "#e6f4e5" },
  warning: { dot: "#7a4f00", bg: "#fff8e1" },
};

const NotificationItem = ({
  notif,
  onAction,
}: {
  notif: AppNotification;
  onAction?: () => void;
}) => {
  const colours = typeColours[notif.type];
  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      {/* Type dot */}
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: colours.dot,
          flexShrink: 0,
          marginTop: "5px",
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <Text size="s" elementType="span">
            <strong>{notif.title}</strong>
          </Text>
          <Text size="s" tone="muted" elementType="span">
            {notif.timestamp}
          </Text>
        </div>
        <Text size="s" tone="supporting" elementType="p">{notif.body}</Text>
        {notif.actionLabel && onAction && (
          <button
            onClick={onAction}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "BT Curve, sans-serif",
              fontSize: "13px",
              color: "#5514b4",
              textDecoration: "underline",
              textAlign: "left",
              marginTop: "4px",
            }}
          >
            {notif.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export const DashboardNav = ({
  brandLogoUrl,
  notifications = [],
  onNotificationAction,
}: DashboardNavProps) => {
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  /* Render either the custom brand logo OR the BT logo — never both */
  const logoSlot = brandLogoUrl ? (
    <img
      src={brandLogoUrl}
      alt="Brand logo"
      style={{ height: "36px", maxWidth: "140px", objectFit: "contain", display: "block" }}
    />
  ) : (
    <BrandLogo size={36} />
  );

  return (
    <>
      <NavigationHeader
        isFluid
        navItems={navItems}
        /* Suppress the built-in logo area by passing an empty svg */
        logo={{ svg: "" }}
        leftSlot={
          <div style={{ display: "flex", alignItems: "center", paddingRight: "16px" }}>
            {logoSlot}
          </div>
        }
        rightSlot={
          <NavigationHeaderActionBar>
            {/* Admin dropdown */}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "14px",
                color: "var(--btw-color-text-primary)",
                padding: "8px",
                fontFamily: "inherit",
              }}
              aria-haspopup="true"
              aria-expanded="false"
            >
              Admin ▾
            </button>

            {/* Notification bell */}
            <div style={{ position: "relative", display: "inline-flex" }}>
              <button
                onClick={() => setNotifDrawerOpen(true)}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--btw-color-text-primary)",
                  position: "relative",
                }}
              >
                <Icon icon={BtIconNotification} size={20} />
              </button>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#da020f",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "BT Curve, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                  aria-hidden="true"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            <NavigationHeaderAction ariaLabel="Help" icon={BtIconQuestion} title="Help" />
            <NavigationHeaderAction ariaLabel="Account" icon={BtIconUser} title="My account" />
          </NavigationHeaderActionBar>
        }
      />

      {/* Notifications drawer */}
      <Drawer
        isOpen={notifDrawerOpen}
        onRequestClose={() => setNotifDrawerOpen(false)}
        position="right"
        size="m"
        ariaDescription="My Notifications"
      >
        <DrawerHeader title="My Notifications" isFixed />
        <DrawerContent>
          {notifications.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#f3eeff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon={BtIconNotification} size={28} />
              </div>
              <Heading level="3" size="s">No notifications yet</Heading>
              <Text size="s" tone="supporting" elementType="p">
                You'll see updates here when actions are required or things change on your account.
              </Text>
            </div>
          ) : (
            <div style={{ padding: "0 4px" }}>
              {/* Unread count */}
              {unreadCount > 0 && (
                <>
                  <Text size="s" tone="muted" elementType="p">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </Text>
                  <VerticalSpace size="8" />
                </>
              )}

              {/* Notification list */}
              {notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  onAction={
                    notif.onAction
                      ? () => {
                          notif.onAction?.();
                          onNotificationAction?.(notif.id);
                          setNotifDrawerOpen(false);
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
