import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Collectives from "../components/Collectives";
import NotificationSidebar from "../components/notifications/notificationSidebar";
import MessagingPanel from "../components/messages/messagingPanel";

export default function AppLayout() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark text-white flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        isNotificationActive={isNotificationOpen}
        isMessagingActive={isMessagingOpen}
        onNotificationClick={() => {
          setIsMessagingOpen(false);
          setIsNotificationOpen((prev) => !prev);
        }}
        onMessagingClick={() => {
          setIsNotificationOpen(false);
          setIsMessagingOpen((prev) => !prev);
        }}
      />

      {/* Notification Panel */}
      <NotificationSidebar
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Messaging Panel */}
      <MessagingPanel
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex justify-center overflow-y-auto scrollbar-hide px-6 pt-20 md:pt-10">
        {/* Centered Outlet; shift right on desktop only */}
        <div className="w-full max-w-3xl relative md:left-24 left-0">
          <Outlet />
        </div>
      </main>

      {/* Right Sidebar: hidden on small screens */}
      <div className="hidden md:flex">
        <Collectives />
      </div>
    </div>
  );
}
