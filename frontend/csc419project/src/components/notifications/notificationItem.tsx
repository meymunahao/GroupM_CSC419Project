type Notification = {
  id: string;
  type: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
};

type NotificationItemProps = {
  notification: Notification;
  onMarkRead?: () => void;
};

export default function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  const { type, data, createdAt, isRead } = notification;

  // Simple mapping from type/data to text; adjust to your schema
  const actorName = data?.actorName ?? "Someone";
  const avatar = data?.actorAvatar ?? "/avatar.jpg";
  const message =
    type === "FRIEND_REQUEST"
      ? `${actorName} sent you a friend request`
      : type === "FRIEND_ACCEPTED"
      ? `${actorName} accepted your friend request`
      : `${actorName} did something`;

  return (
    <div
      className={`px-6 py-4 flex gap-4 hover:bg-white/5 cursor-pointer ${
        !isRead ? "bg-white/5" : ""
      }`}
    >
      <img
        src={avatar}
        alt={actorName}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1">
        <p className="text-sm text-gray-200">
          <span className="font-medium text-white">{actorName}</span>{" "}
          {message.replace(actorName, "").trim()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>

      {onMarkRead && !isRead && (
        <button
          type="button"
          onClick={onMarkRead}
          className="text-xs text-orange-400 hover:underline self-start"
        >
          Mark as read
        </button>
      )}
    </div>
  );
}
