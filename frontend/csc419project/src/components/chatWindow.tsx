import { useState, useEffect } from "react";
import { Bell, Search, MoreVertical } from "lucide-react";
import MessageBubble from "./messageBubble";
import MessageInput from "./MessageInput";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
}

type ChatWindowProps = {
  chatId: string | null;
};


const mockChats: Chat[] = [
  { id: "1", name: "Jennifer Markus", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Iva Ryan", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "3", name: "Jerry Helfer", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "4", name: "David Elson", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: "5", name: "Mary Freund", avatar: "https://i.pravatar.cc/150?img=9" },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", text: "Hello! I really liked your recent post", timestamp: "04:45 PM", isSent: false },
    { id: "2", text: "Thank you so much", timestamp: "04:45 PM", isSent: true },
    { id: "3", text: "So you are into fashion?", timestamp: "04:45 PM", isSent: false },
    { id: "4", text: "Yes, I am", timestamp: "04:45 PM", isSent: true },
  ],
  "2": [
    { id: "1", text: "Hey! How are you?", timestamp: "03:30 PM", isSent: false },
    { id: "2", text: "I'm good, thanks! How about you?", timestamp: "03:31 PM", isSent: true },
  ],
  "3": [
    { id: "1", text: "Did you see the game last night?", timestamp: "02:15 PM", isSent: false },
    { id: "2", text: "Yes! It was amazing!", timestamp: "02:16 PM", isSent: true },
  ],
  "4": [
    { id: "1", text: "Let's meet up this weekend", timestamp: "01:20 PM", isSent: false },
    { id: "2", text: "Sounds great! Saturday works for me", timestamp: "01:22 PM", isSent: true },
  ],
  "5": [
    { id: "1", text: "Thanks for your help earlier!", timestamp: "12:45 PM", isSent: false },
    { id: "2", text: "No problem! Happy to help", timestamp: "12:46 PM", isSent: true },
  ],
};

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const selectedChat = mockChats.find((c) => c.id === chatId);

 
  useEffect(() => {
    if (chatId) {
      setMessages(mockMessages[chatId] || []);
    }
  }, [chatId]); // Re-run whenever chatId changes

  const handleSendMessage = (text: string) => {
    if (!chatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
      isSent: true,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Later: Send to backend
    // sendMessageToAPI(text, chatId);
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Center Message */}
        <div className="text-center z-10">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl text-white font-semibold mb-2">Select a chat to start messaging</h3>
          <p className="text-gray-500">Choose a conversation from the left to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f]">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <img
            src={selectedChat?.avatar}
            alt={selectedChat?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-white font-semibold">{selectedChat?.name}</h2>
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
          <button className="text-gray-400 hover:text-white transition p-2">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}