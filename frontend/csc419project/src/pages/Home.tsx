import MyHomeFeed from "../components/MyHomeFeed";

export default function Home() {
  return (
    <main className="flex-1 max-w-2xl mx-auto py-8 px-4 overflow-y-auto">
      {/* 1. Post Input Area (Figma: What is on your mind?) */}
      <div className="bg-[#121212] rounded-3xl p-4 mb-6 border border-white/5 flex items-center gap-4">
        <img
          src="/nimi.png"
          className="w-10 h-10 rounded-full bg-gray-800"
          alt="User"
        />
        <div className="text-gray-500 text-sm">What is on your mind?</div>
      </div>

      {/* 2. Category Filter Chips (Music, Art, Philosophy, etc.) */}
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

      {/* 3. The Feed Posts */}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-gray-500 text-xs font-medium px-2">For you</span>
      </div>

      <MyHomeFeed />
    </main>
  );
}
