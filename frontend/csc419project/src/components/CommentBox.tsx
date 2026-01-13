// src/components/CommentBox.tsx


export default function CommentBox() {
  return (
    <div className="w-full bg-[#121212] rounded-2xl border border-white/5 p-4 flex items-center gap-4">
      {/* User Avatar - Static placeholder */}
      <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oluwalonimi"
        className="w-9 h-9 rounded-full bg-gray-800"
        alt="User"
      />

      {/* Fake Input Area to match Figma Desktop-3 */}
      <div className="flex-1 text-gray-500 text-sm">Leave a reply...</div>

      {/* Static Post Button */}
      <button className="text-orange-500 font-semibold text-sm hover:text-orange-400 transition-colors">
        Post
      </button>
    </div>
  );
}
