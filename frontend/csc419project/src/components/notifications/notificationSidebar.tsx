// src/components/notifications/notificationSidebar.tsx
import { useEffect, useState } from "react";
import NotificationItem from "./notificationItem.tsx";
import NotificationSettings from "./notificationSettings.tsx";
import { getAuthHeader } from "../../utils/auth";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Notification = {
  id: string;
  type: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
};

const API_BASE_URL = "https://groupm-csc419project.onrender.com";

export default function NotificationSidebar({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "settings">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications when sidebar opens
  useEffect(() => {
    if (!isOpen || activeTab !== "all") return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications`, {
          headers: {
            "Content-Type": "application/json",
            // FIX: Type assertion to satisfy HeadersInit
            ...(getAuthHeader() as Record<string, string>),
          },
        });

        if (!res.ok) {
          console.error("Failed to load notifications");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Notification fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen, activeTab]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // FIX: Type assertion to satisfy HeadersInit
            ...(getAuthHeader() as Record<string, string>),
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to mark as read");
        return;
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  return (
    <>
      {/* OVERLAY - Click to close on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* NOTIFICATION SIDEBAR */}
      <aside
        className={`
          fixed top-0 bottom-0 z-40
          left-0 md:left-64
          bg-[#0f0f0f] border-r border-white/10 flex flex-col shadow-2xl
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "translate-x-0 opacity-100 w-full sm:w-105" // Replaced w-105 with a standard value for reliability
              : "-translate-x-full opacity-0 w-0"
          }
        `}
      >
        {/* Inner Container - Ensuring width is consistent during animation */}
        <div className="w-full sm:w-105 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/10 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-6 border-b border-white/10 text-sm shrink-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 mr-6 transition-all border-b-2 font-medium ${
                activeTab === "all"
                  ? "border-orange-500 text-white" // Using orange to match your brand
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 transition-all border-b-2 font-medium ${
                activeTab === "settings"
                  ? "border-orange-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              Settings
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === "all" ? (
              <div className="divide-y divide-white/5">
                {loading && (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mb-2"></div>
                    <p className="text-sm text-gray-400">Loading notifications...</p>
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 text-sm italic">
                      No notifications yet.
                    </p>
                  </div>
                )}

                {!loading &&
                  notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkRead={() => markAsRead(n.id)}
                    />
                  ))}
              </div>
            ) : (
              <NotificationSettings />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}