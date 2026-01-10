import { useState } from "react";
import ChatList from "./chatList";
import ChatWindow from "./chatWindow";

type MessagingPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MessagingPanel({ isOpen, onClose }: MessagingPanelProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      {/* MESSAGING PANEL */}
      <div
        className={`
          fixed top-0 bottom-0 z-40
          left-0 md:left-64
          bg-[#0f0f0f] flex shadow-2xl
          transition-all duration-300 ease-in-out
          ${isOpen
            ? "translate-x-0 opacity-100 w-full md:w-[calc(100%-16rem)]"
            : "-translate-x-full opacity-0 w-0"
          }
        `}
      >
        {isOpen && (
          <div className="w-full h-full flex">
            <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
            <ChatWindow chatId={selectedChatId} />
          </div>
        )}
      </div>
    </>
  );
}