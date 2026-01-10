export default function NotificationSettings() {
  return (
    <div className="p-6 text-sm text-gray-300 space-y-6">
      <div>
        <h3 className="text-white font-medium mb-2">
          Push Notifications
        </h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-white" />
          Enable push notifications
        </label>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">
          Email Notifications
        </h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-white" />
          Receive email updates
        </label>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">
          Notification Types
        </h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-white" />
          Likes
        </label>
        <label className="flex items-center gap-3 mt-2">
          <input type="checkbox" className="accent-white" />
          Comments
        </label>
        <label className="flex items-center gap-3 mt-2">
          <input type="checkbox" className="accent-white" />
          Mentions
        </label>
      </div>
    </div>
  );
}
