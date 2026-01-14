import { Search } from "lucide-react";
import { useState } from "react";

export default function FriendsPage() {
  const categories = ["For You", "Trending", "News", "Sports", "Entertainment"];
  const [query, setQuery] = useState("");

  const searchFeed = [
    { id: 1, img: "https://picsum.photos/400/400?random=1", span: "row-span-2" },
    { id: 2, img: "https://picsum.photos/400/400?random=2", span: "" },
    { id: 3, img: "https://picsum.photos/400/400?random=3", span: "" },
    { id: 4, img: "https://picsum.photos/400/400?random=4", span: "" },
    { id: 5, img: "https://picsum.photos/400/400?random=5", span: "row-span-2" },
    { id: 6, img: "https://picsum.photos/400/400?random=6", span: "" },
  ];

  return (
    /* FIX 1: Removed 'relative z-50' to stop it from overlapping navigation.
       FIX 2: Added 'flex justify-center' to move content to the middle.
    */
    <main className="flex-1 bg-dark py-8 px-4 overflow-y-auto flex justify-center scrollbar-hide">
      
      {/* FIX 3: Added 'w-full' and 'max-w-3xl' to keep the content centered 
         and perfectly sized for a search feed.
      */}
      <div className="w-full max-w-3xl flex flex-col">
        
        {/* Centered Search Bar */}
        <div className="relative w-full mb-8">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search moments, people, or topics"
            className="w-full bg-[#252525] border border-white/10 rounded-full py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50 transition-all shadow-xl cursor-text"
          />
        </div>

        {/* Categories - Centered using justify-center */}
        <div className="flex gap-3 mb-10 overflow-x-auto w-full justify-center scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-5 py-2 rounded-full bg-[#252525] text-sm text-gray-400 hover:text-white border border-white/5 whitespace-nowrap transition-colors cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Instagram-style Discovery Grid */}
        <div className="grid grid-cols-3 gap-3 w-full pb-20">
          {searchFeed.map((item) => (
            <div
              key={item.id}
              className={`relative group overflow-hidden rounded-xl bg-[#252525] ${item.span}`}
            >
              {/* Pulse Loader for "Final Polish" */}
              <div className="absolute inset-0 bg-white/5 animate-pulse" />

              <img
                src={item.img}
                className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500 cursor-pointer opacity-90 group-hover:opacity-100 relative z-10"
                alt="discover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}