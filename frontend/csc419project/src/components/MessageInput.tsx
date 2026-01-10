import { useState } from "react";
import { Smile, Send } from "lucide-react";

type MessageInputProps = {
  onSend: (message: string) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/150?img=33"
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Input Container */}
        <div className="flex-1 relative flex items-center gap-2 bg-[#2a2a2a] rounded-full px-4 py-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here ..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-500"
          />
          <button className="text-gray-400 hover:text-white transition">
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-full transition"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}