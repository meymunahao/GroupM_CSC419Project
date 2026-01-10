import { useState } from "react";
import NotificationItem from "./notificationItem.tsx";
import NotificationSettings from "./notificationSettings.tsx";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NotificationSidebar({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "settings">("all");

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
          ${isOpen 
            ? "translate-x-0 opacity-100 w-[420px]" 
            : "-translate-x-full opacity-0 w-0"
          }
        `}
      >
        {/* Inner Container */}
        <div className="w-[420px] h-full flex flex-col">
          
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/10 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-6 border-b border-white/10 text-sm shrink-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 mr-6 transition-all border-b-2 ${
                activeTab === "all" ? "border-white text-white" : "border-transparent text-gray-500"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 transition-all border-b-2 ${
                activeTab === "settings" ? "border-white text-white" : "border-transparent text-gray-500"
              }`}
            >
              Settings
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "all" ? (
              <div className="divide-y divide-white/5">
                <NotificationItem />
                <NotificationItem />
                <NotificationItem />
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