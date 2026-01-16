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

const API_BASE_URL = "http://localhost:5001";

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
            ...getAuthHeader(),
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
        console.error(err);
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
            ...getAuthHeader(),
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
      console.error(err);
    }
  };

  return (
    <>
      {/* OVERLAY - Click to close on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
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
              ? "translate-x-0 opacity-100 w-105"
              : "-translate-x-full opacity-0 w-0"
          }
        `}
      >
        {/* Inner Container */}
        <div className="w-105 h-full flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/10 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 transition"
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
              className={`py-4 mr-6 transition-all border-b-2 ${
                activeTab === "all"
                  ? "border-white text-white"
                  : "border-transparent text-gray-500"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 transition-all border-b-2 ${
                activeTab === "settings"
                  ? "border-white text-white"
                  : "border-transparent text-gray-500"
              }`}
            >
              Settings
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "all" ? (
              <div className="divide-y divide-white/5">
                {loading && (
                  <div className="p-4 text-sm text-gray-400">
                    Loading notifications...
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="p-4 text-sm text-gray-400">
                    No notifications yet.
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
