import Sidebar from "../components/Sidebar"; 
import { Outlet } from "react-router-dom";
import NotificationSidebar from "../components/notifications/notificationSidebar";
import { useState } from "react";

export default function ProfileLayout() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    // Remove 'overflow-hidden' and 'h-screen' from parent to allow mobile scroll
    <div className="flex min-h-screen bg-[#121212] text-white">

      {/* Sidebar Wrapper */}
      <div className="shrink-0 h-full z-20">
        <Sidebar
          isNotificationActive={isNotificationOpen}
          onNotificationClick={() => {
            setIsNotificationOpen((prev) => !prev);
          }}
         
        />

        <NotificationSidebar
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        
      </div>

      {/* Main Scrollable Area */}
      <main className="flex-1 flex justify-center overflow-y-auto w-full relative scrollbar-hide">
        {/* Content Container */}
        <div className="w-full max-w-4xl pt-4 md:pt-6 px-4 pb-20 md:ml-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
