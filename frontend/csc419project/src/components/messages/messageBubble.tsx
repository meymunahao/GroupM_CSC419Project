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
  const base = "max-w-xs rounded-2xl px-3 py-2 text-sm mb-2";
  const sent = "ml-auto bg-orange-500 text-white";
  const received = "mr-auto bg-white/10 text-gray-100";

  return (
    <div className={`${base} ${message.isSent ? sent : received}`}>
      <p>{message.text}</p>
      <span className="block mt-1 text-[10px] text-gray-400 text-right">
        {message.timestamp}
      </span>
    </div>
  );
}
