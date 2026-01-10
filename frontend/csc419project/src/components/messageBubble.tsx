interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isSent ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${message.isSent ? "order-2" : "order-1"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            message.isSent
              ? "bg-gray-700 text-white rounded-br-sm"
              : "bg-white text-gray-900 rounded-bl-sm"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <span className={`text-xs text-gray-500 mt-1 block ${message.isSent ? "text-right" : "text-left"}`}>
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}