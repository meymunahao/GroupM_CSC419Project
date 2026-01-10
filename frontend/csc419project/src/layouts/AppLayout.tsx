import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Collectives from "../components/Collectives";
import NotificationSidebar from "../components/notifications/notificationSidebar";
import MessagingPanel from "../components/messagingPanel";

export default function AppLayout() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false); 

  return (
    <div className="min-h-screen bg-dark text-white flex">
      
      <Sidebar
        onNotificationClick={() => setIsNotificationOpen((prev) => !prev)}
        onMessagingClick={() => setIsMessagingOpen((prev) => !prev)} 
      />

      
      <NotificationSidebar
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      
      <MessagingPanel
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
      />

      
      <main className="flex-1 ml-0 md:ml-64 px-6 pt-20 md:pt-10 max-w-3xl mx-auto">
        <Outlet />
      </main>

      
      <Collectives />
    </div>
  );
}