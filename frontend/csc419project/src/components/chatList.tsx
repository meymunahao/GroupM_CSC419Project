import { useState } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import ChatItem from "./chatItem";

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

  // Filter chats based on search query
  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={onSelectChat}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
}