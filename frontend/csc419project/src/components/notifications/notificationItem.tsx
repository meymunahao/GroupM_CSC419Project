export default function NotificationItem() {
  return (
    <div className="px-6 py-4 flex gap-4 hover:bg-white/5 cursor-pointer">
      <img
        src="/avatar.jpg"
        alt=""
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1">
        <p className="text-sm text-gray-200">
          <span className="font-medium text-white">
            Mary Freund
          </span>{" "}
          liked your post
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Today · 05:30 PM
        </p>
      </div>
    </div>
  );
}
