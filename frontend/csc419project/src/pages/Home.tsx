import MyHomeFeed from "../components/HomeFeed";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Category Filter Chips */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {["Music", "Art", "Philosophy", "Design"].map((cat) => (
          <button
            key={cat}
            className={`px-5 py-1.5 rounded-full text-sm transition-all ${
              cat === "Art"
                ? "bg-[#222222] text-white border border-white/10"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Label */}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-gray-500 text-xs font-medium px-2">
          For you
        </span>
      </div>

      {/* Feed */}
      <MyHomeFeed />
    </div>
  );
}