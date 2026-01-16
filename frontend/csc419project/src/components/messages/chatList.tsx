import { useState, useEffect } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import ChatItem from "./ChatItem";
import { getAuthHeader } from "../../utils/auth";

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
  onSelectChat: (chatId: string | null) => void;
  selectedChatId: string | null;
  reloadKey?: number; // used to trigger refetch when chats change
};

const API_BASE_URL = "http://localhost:5001";

export default function ChatList({
  onSelectChat,
  selectedChatId,
  reloadKey = 0,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  // Load chats from backend
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/chats`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });

        if (!res.ok) {
          console.error("Failed to load chats");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Map backend shape -> Chat interface; adjust field names to match your API
        const mapped: Chat[] = data.map((c: any) => ({
          id: String(c.id),
          name:
            c.other_user_email ??
            c.otherUserEmail ??
            c.otherUserName ??
            "Unknown",
          avatar: c.avatar ?? "https://i.pravatar.cc/150?img=1",
          lastMessage: c.lastMessage ?? c.last_message_text ?? "",
          timestamp:
            c.lastMessageAt || c.last_message_at || c.last_message_time
              ? new Date(
                  c.lastMessageAt ??
                    c.last_message_at ??
                    c.last_message_time
                ).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  day: "2-digit",
                })
              : "",
          unread: c.unreadCount ?? c.unread_count ?? 0,
          online: c.online ?? c.is_online ?? false,
        }));

        setChats(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [reloadKey]);

  // Filter chats by search query
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      chat.name.toLowerCase().includes(q) ||
      chat.lastMessage.toLowerCase().includes(q)
    );
  });

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
          <button
            className="bg-orange-500 hover:bg-orange-600 p-2 rounded-lg transition"
            type="button"
            onClick={() => {
              console.log("ORANGE PLUS CLICKED");
              onSelectChat(null); // show empty ChatWindow state
            }}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-sm text-gray-400">Loading chats...</div>
        )}

        {!loading && filteredChats.length === 0 && (
          <div className="p-4 text-sm text-gray-400">No chats found.</div>
        )}

        {!loading &&
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
      </div>
    </div>
  );
}
