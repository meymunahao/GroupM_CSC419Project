// src/pages/HomeFeed.tsx
import PostCard from "../components/Feed/PostCard";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";

const MOCK_POSTS = [
  {
    id: 1,
    user: "The anarchist",
    avatar: "/nimi.png",
    content:
      "Just passed a storefront window full of cacti wearing a bunch of tiny santa hats. seasonal depression cured.",
    image: "/Lookup.png",
  },
  {
    id: 2,
    user: "Underrated genius",
    avatar: "/brow.png",
    content:
      "In your 20s, there is an apology you'll never receive and it's VERY important that you move on anyway.",
    image: "/quote.png",
  },
];

export default function HomeFeed() {
  return (
    <div className="space-y-6">
      {/* Create post bubble */}
      <Link
        to="/create"
        className="flex items-center gap-4 bg-[#121212] p-4 rounded-2xl border border-white/5 hover:bg-[#1a1a1a] transition"
      >
        <img src="/nimi.png" className="w-10 h-10 rounded-full" />
        <span className="text-gray-500 flex-1">
          What's on your mind, Oluwalonimi?
        </span>
        <div className="bg-[#FF5C00] p-2.5 rounded-xl text-white">
          <Send size={18} />
        </div>
      </Link>

      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
