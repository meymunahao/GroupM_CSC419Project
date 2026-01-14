import { useState } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online?: boolean;
}

type ChatListProps = {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
};

// Mock data - replace with your actual data
const mockChats: Chat[] = [
  {
    id: "1",
    name: "Jennifer Markus",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hello! I really liked your recent post",
    timestamp: "Today | 09:30 PM",
    unread: 4,
    online: true,
  },
  {
    id: "2",
    name: "Iva Ryan",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Hello! I really liked your recent post",
    timestamp: "Today | 09:30 PM",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Jerry Helfer",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Hello! I really liked your recent post",
    timestamp: "Today | 09:30 PM",
    unread: 0,
  },
  {
    id: "4",
    name: "David Elson",
    avatar: "https://i.pravatar.cc/150?img=8",
    lastMessage: "Hello! I really liked your recent post",
    timestamp: "Today | 09:30 PM",
    unread: 0,
  },
  {
    id: "5",
    name: "Mary Freund",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "Hello! I really liked your recent post",
    timestamp: "Today | 09:30 PM",
    unread: 0,
  },
];

export default function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full md:w-[400px] h-full bg-[#1a1a1a] border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filter and New Chat */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-white text-sm font-medium">
            All Messages
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-lg transition">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 border-b border-white/5 cursor-pointer transition hover:bg-white/5 ${
              selectedChatId === chat.id ? "bg-white/10" : ""
            }`}
          >
            <div className="flex gap-3">
              {/* Avatar with online indicator */}
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
                )}
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-semibold">{chat.unread}</span>
                  </div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium truncate">{chat.name}</h3>
                </div>
                <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}