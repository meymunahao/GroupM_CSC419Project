import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NotificationSidebar from "../components/notifications/notificationSidebar";


export default function generalLayout() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
 

  return (
    <div className="min-h-screen bg-dark text-white flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        isNotificationActive={isNotificationOpen}
    
        onNotificationClick={() => {
          setIsNotificationOpen((prev) => !prev);
        }}
      
      />

      {/* Notification Panel */}
      <NotificationSidebar
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

     

      {/* Main Content */}
      <main className="flex-1 flex justify-center overflow-y-auto scrollbar-hide px-6 pt-20 md:pt-10">
        {/* Centered Outlet; shift right on desktop only */}
        <div className="w-full max-w-3xl relative md:left-24 left-0">
          <Outlet />
        </div>
      </main>

      {/* Right Sidebar: hidden on small screens */}
      
    </div>
  );
}
