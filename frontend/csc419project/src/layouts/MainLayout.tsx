import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Feed from '../pages/Home';
import Collectives from '../components/Collectives';
import NotificationSidebar from "../components/notifications/notificationSidebar";


const MainLayout: React.FC = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-325 mx-auto flex justify-center relative">
        
        {/* LEFT COLUMN: Sidebar - Stays at the very top */}
        <div className="shrink-0 w-20 xl:w-64 sticky top-0 h-screen z-50 bg-dark">
          <Sidebar
            isNotificationActive={isNotificationOpen}
            
            onNotificationClick={() => {
              
              setIsNotificationOpen((prev) => !prev);
            }}
            
          />
        </div>

        {/* DYNAMIC PANEL AREA: Stays at the very top */}
        {(isNotificationOpen) && (
          <div className={`
            fixed top-0 h-screen z-50 bg-dark border-r border-gray-800
            w-[85vw] sm:w-80 
            transition-all duration-300 ease-in-out
            left-20 xl:left-64 
          `}>
            {isNotificationOpen && (
              <NotificationSidebar
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            )}
            
          </div>
        )}

        {/* MIDDLE COLUMN: Feed */}
        {/* Added 'pt-10' to push content down from the top */}
        <main className="flex-1 max-w-150 min-h-screen min-w-0 pt-10">
          <Feed />
        </main>

        {/* RIGHT COLUMN: Collectives */}
        {/* Added 'pt-20' here to align better with the shifted feed */}
        <div className="hidden lg:block w-87.5 sticky top-0 h-screen p-12 ml-20 pt-20">
          <Collectives />
        </div>

        {/* MOBILE OVERLAY DIMMER */}
        {(isNotificationOpen ) && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
            onClick={() => {
              setIsNotificationOpen(false);
              
            }}
          />
        )}

      </div>
    </div>
  );
};

export default MainLayout;