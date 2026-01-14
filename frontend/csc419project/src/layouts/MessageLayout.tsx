import { useState } from "react";

// Components
import Sidebar from "../components/Sidebar";
import NotificationSidebar from "../components/notifications/notificationSidebar";
import ChatList from "../components/messages/chatList";
import ChatWindow from "../components/messages/chatWindow";




export default function MessageLayout() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white overflow-hidden">

  {/* 1. SIDEBAR */}
  <div className="shrink-0 w-64 relative z-20">
    <Sidebar
      isNotificationActive={isNotificationOpen}
      onNotificationClick={() => setIsNotificationOpen((prev) => !prev)}
    />

    {/* 2. NOTIFICATION PANEL (absolute so it overlays) */}
    <NotificationSidebar
      isOpen={isNotificationOpen}
      onClose={() => setIsNotificationOpen(false)}
    />
  </div>

  {/* 3. MAIN CONTENT */}
  <main className="flex-1 flex flex-col z-30">
    <div className="flex-1 flex ">
      <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      <ChatWindow chatId={selectedChatId} />
    </div>
  </main>

</div>
  );
}