import { useState, useEffect } from "react";
import { Bell, Search, MoreVertical, Plus } from "lucide-react";
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

const API_BASE_URL = "http://localhost:5001";

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
              ...getAuthHeader(),
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
            ...getAuthHeader(),
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
          ...getAuthHeader(),
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
        avatar: u.avatar ?? "https://i.pravatar.cc/150?img=11",
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
          ...getAuthHeader(),
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

  // EMPTY STATE: no chat selected
  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col bg-[#0f0f0f] relative">
        {/* Simple header with plus */}
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

        {/* Center message */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="text-center z-10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4" />
            <h3 className="text-xl text-white font-semibold mb-2">
              Select a chat or start a new one
            </h3>
            <p className="text-gray-500">
              Use the plus button to message someone from the users list
            </p>
          </div>
        </div>

        {/* User picker panel */}
        {showUserPicker && (
          <div className="absolute inset-y-0 right-0 w-full md:w-80 bg-[#1a1a1a] border-l border-white/10 shadow-xl z-20 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">
                Start a new chat
              </h3>
              <button
                type="button"
                onClick={() => setShowUserPicker(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingUsers && (
                <div className="p-4 text-sm text-gray-400">
                  Loading users...
                </div>
              )}

              {!loadingUsers && users.length === 0 && (
                <div className="p-4 text-sm text-gray-400">
                  No other users found.
                </div>
              )}

              {!loadingUsers &&
                users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleStartChatWithUser(user)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-white truncate">
                      {user.username}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // NORMAL STATE: chat selected
  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] relative">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div>
            <h2 className="text-white font-semibold">Chat {chatId}</h2>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white transition p-2">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white transition p-2">
            <Search className="w-5 h-5" />
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition"
            onClick={openUserPicker}
            type="button"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white transition p-2">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSendMessage} />

      {/* User picker side panel */}
      {showUserPicker && (
        <div className="absolute inset-y-0 right-0 w-full md:w-80 bg-[#1a1a1a] border-l border-white/10 shadow-xl z-20 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">
              Start a new chat
            </h3>
            <button
              type="button"
              onClick={() => setShowUserPicker(false)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingUsers && (
              <div className="p-4 text-sm text-gray-400">
                Loading users...
              </div>
            )}

            {!loadingUsers && users.length === 0 && (
              <div className="p-4 text-sm text-gray-400">
                No other users found.
              </div>
            )}

            {!loadingUsers &&
              users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleStartChatWithUser(user)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg_white/5 text-left"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-white truncate">
                    {user.username}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
