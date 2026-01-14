interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online?: boolean;
}

type ChatItemProps = {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void; // ✅ no args
};

export default function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-white/5 transition hover:bg-white/5 ${
        isSelected ? "bg-white/10" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
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
              <span className="text-xs text-white font-semibold">
                {chat.unread}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{chat.name}</h3>
          <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>

          <div className="flex items-center gap-1 mt-1">
            <svg
              className="w-3 h-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-gray-500">{chat.timestamp}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
