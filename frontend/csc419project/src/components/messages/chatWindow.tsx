// src/components/messages/chatWindow.tsx
import { useState, useEffect } from "react";
import { Bell, Search, MoreVertical, Plus, MessageSquare } from "lucide-react";
import MessageBubble from "./messageBubble";
import MessageInput from "./MessageInput";
import { getAuthHeader, getCurrentUser } from "../../utils/auth";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

interface User {
  id: string;
  username: string;
  avatar?: string;
}

type ChatWindowProps = {
  chatId: string | null;
  onChatCreated?: (chatId: string) => void;
};

const API_BASE_URL = "https://groupm-csc419project.onrender.com";

export default function ChatWindow({ chatId, onChatCreated }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const currentUser = getCurrentUser();

  // Load messages whenever chatId changes
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/chats/${chatId}/messages`,
          {
            headers: {
              "Content-Type": "application/json",
              // FIX: Type assertion for HeadersInit
              ...(getAuthHeader() as Record<string, string>),
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to load messages");
          return;
        }

        const data = await res.json();
        const currentUserId = currentUser?.id ? String(currentUser.id) : null;

        const mapped: Message[] = data.map((m: any) => {
          const rawDate = m.created_at ?? m.createdAt;
          const date = rawDate ? new Date(rawDate) : new Date();

          return {
            id: String(m.id),
            text: m.content ?? m.text ?? "",
            timestamp: date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isSent:
              currentUserId !== null &&
              String(m.sender_id ?? m.senderId) === currentUserId,
          };
        });

        setMessages(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [chatId, currentUser?.id]);

  // Send a message in an existing chat
  const handleSendMessage = async (text: string) => {
    if (!chatId || !text.trim()) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/chats/${chatId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // FIX: Type assertion for HeadersInit
            ...(getAuthHeader() as Record<string, string>),
          },
          body: JSON.stringify({
            conversationId: Number(chatId),
            content: text,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to send message", res.status, errorText);
        return;
      }

      const saved = await res.json();

      const savedMessage: Message = {
        id: String(saved.id),
        text: saved.content ?? saved.text ?? "",
        timestamp: new Date(
          saved.created_at ?? saved.createdAt ?? Date.now()
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSent: true,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === tempMessage.id ? savedMessage : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Open user picker: fetch other users from backend
  const openUserPicker = async () => {
    setShowUserPicker(true);
    setLoadingUsers(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          // FIX: Type assertion for HeadersInit
          ...(getAuthHeader() as Record<string, string>),
        },
      });

      if (!res.ok) {
        console.error("Failed to load users");
        setLoadingUsers(false);
        return;
      }

      const data = await res.json();

      const mapped: User[] = data.map((u: any) => ({
        id: String(u.id),
        username: u.username ?? u.name ?? u.email ?? "Unknown",
        avatar: u.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${u.username || 'U'}`,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Start or get a chat with a selected user
  const handleStartChatWithUser = async (user: User) => {
    if (!currentUser?.id) {
      console.error("No currentUser.id available");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // FIX: Type assertion for HeadersInit
          ...(getAuthHeader() as Record<string, string>),
        },
        body: JSON.stringify({
          userId: currentUser.id,
          otherUserId: user.id,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to create/open chat", res.status, errorText);
        return;
      }

      const chat = await res.json();
      const newChatId = String(chat.id);

      setShowUserPicker(false);

      if (onChatCreated) {
        onChatCreated(newChatId);
      }
    } catch (err) {
      console.error("handleStartChatWithUser ERROR", err);
    }
  };

  // EMPTY STATE
  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col bg-[#0f0f0f] relative">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
          <h2 className="text-white font-semibold text-sm">Messages</h2>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition"
            onClick={openUserPicker}
            type="button"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
               <MessageSquare className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl text-white font-semibold mb-2">
              Select a chat or start a new one
            </h3>
            <p className="text-gray-500">
              Use the plus button to message someone from the users list
            </p>
          </div>
        </div>

        {showUserPicker && renderUserPicker()}
      </div>
    );
  }

  // HELPER FOR USER PICKER UI (Reusable)
  function renderUserPicker() {
    return (
      <div className="absolute inset-y-0 right-0 w-full md:w-80 bg-[#1a1a1a] border-l border-white/10 shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-white font-semibold text-sm">Start a new chat</h3>
          <button
            type="button"
            onClick={() => setShowUserPicker(false)}
            className="text-gray-400 hover:text-white text-sm"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingUsers ? (
            <div className="p-4 text-sm text-gray-400 animate-pulse">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-sm text-gray-400">No other users found.</div>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleStartChatWithUser(user)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-white truncate">{user.username}</span>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  // ACTIVE CHAT STATE
  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] relative">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div>
            <h2 className="text-white font-semibold">Chat {chatId}</h2>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white transition p-2"><Bell size={20} /></button>
          <button className="text-gray-400 hover:text-white transition p-2"><Search size={20} /></button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition"
            onClick={openUserPicker}
            type="button"
          >
            <Plus size={20} />
          </button>
          <button className="text-gray-400 hover:text-white transition p-2"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <MessageInput onSend={handleSendMessage} />

      {showUserPicker && renderUserPicker()}
    </div>
  );
}