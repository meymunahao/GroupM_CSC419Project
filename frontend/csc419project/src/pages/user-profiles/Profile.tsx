import { useState } from "react";
import { MessageCircle, Repeat, Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- MOCK DATA FOR FEED ---
const POSTS = [
  {
    id: 1,
    name: "The anarchist",
    handle: "@anarchist",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    content:
      "Just passed a storefront window full of cacti wearing a bunch of tiny santa hats. seasonal depression cured.",
    time: "2h",
    hasImage: false,
  },
  {
    id: 2,
    name: "Underrated genius",
    handle: "@genius",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    content:
      "Just passed a storefront window full of cacti wearing a bunch of tiny santa hats. seasonal depression cured.",
    time: "4h",
    hasImage: false,
  },
  {
    id: 3,
    name: "The anarchist",
    handle: "@anarchist",
    subtext: "from music collective",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    content:
      "Just passed a storefront window full of cacti wearing a bunch of tiny santa hats. seasonal depression cured.",
    time: "5h",
    hasImage: true,
    postImage: "https://picsum.photos/seed/picsum/600/400",
  },
];

const TABS = ["Posts", "Likes", "Community", "Bookmark"];

export default function UserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <div className="w-full">
      {/* Profile Header Section */}
      <div className="w-full relative mb-4">
        {/* Banner Image */}
        <div className="h-48 md:h-60 w-full bg-gray-800 rounded-lg overflow-hidden relative">
          <img
            src="https://picsum.photos/1200/400"
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info Container */}
        <div className="px-4 relative">
          {/* Avatar - Overlapping Banner */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-[6px] border-[#121212] overflow-hidden bg-gray-700">
              <img
                src="https://i.pravatar.cc/300"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Header Content Wrapper */}
          <div className="pt-20 md:pt-24 mb-6">
            {/* --- DESKTOP LAYOUT (Hidden on Mobile) --- */}
            <div className="hidden md:flex flex-row justify-between items-center gap-4">
              {/* Name & Handle */}
              <div className="flex flex-col shrink-0">
                <h1 className="text-3xl font-bold text-white leading-tight">
                  Oluwalonimi
                </h1>
                <p className="text-gray-500 text-sm font-medium mt-1">
                  @nimitimi
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group">
                  <span className="font-bold text-white text-xl">24</span>
                  <span className="text-gray-500 text-base group-hover:text-gray-300">
                    Following
                  </span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group">
                  <span className="font-bold text-white text-xl">12</span>
                  <span className="text-gray-500 text-base group-hover:text-gray-300">
                    Followers
                  </span>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group">
                  <span className="font-bold text-white text-xl">48</span>
                  <span className="text-gray-500 text-base group-hover:text-gray-300">
                    Friends
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => navigate("/create")}
                className="bg-[#FF5C00] text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
              >
                New Post
              </button>
            </div>

            {/* --- MOBILE LAYOUT (Hidden on Desktop) --- */}
            <div className="flex flex-col md:hidden gap-4">
              {/* Row 1: Name and Small Button Side-by-Side */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col shrink-0">
                  <h1 className="text-2xl font-bold text-white leading-tight">
                    Oluwalonimi
                  </h1>
                  <p className="text-gray-500 text-sm font-medium mt-0.5">
                    @nimitimi
                  </p>
                </div>

                {/* Smaller Button beside Name */}
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-4 rounded-lg transition-colors text-xs shadow-lg shadow-orange-500/20 shrink-0 ml-4 mt-1">
                  New Post
                </button>
              </div>

              {/* Row 2: Stats below */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors group">
                  <span className="font-bold text-white text-lg">24</span>
                  <span className="text-gray-500 text-sm group-hover:text-gray-300">
                    Following
                  </span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors group">
                  <span className="font-bold text-white text-lg">12</span>
                  <span className="text-gray-500 text-sm group-hover:text-gray-300">
                    Followers
                  </span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors group">
                  <span className="font-bold text-white text-lg">48</span>
                  <span className="text-gray-500 text-sm group-hover:text-gray-300">
                    Friends
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "bg-[#1f1f1f] text-white"
                      : "text-gray-500 hover:text-gray-300 hover:bg-[#1f1f1f]/50"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Section */}
      <div className="px-2 md:px-4">
        {POSTS.map((post) => (
          <div
            key={post.id}
            className="py-6 border-b border-gray-800 flex gap-4"
          >
            {/* Post Avatar */}
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                <img
                  src={post.avatar}
                  alt={post.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Post Content */}
            <div className="flex-1">
              {/* Post Header */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm text-gray-100">
                  {post.name}
                </span>
                {post.subtext && (
                  <span className="text-gray-500 text-xs">{post.subtext}</span>
                )}
              </div>

              {/* Post Text */}
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {post.content}
              </p>

              {/* Optional Post Image */}
              {post.hasImage && post.postImage && (
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-800 mt-3">
                  <img
                    src={post.postImage}
                    alt="Post content"
                    className="w-full h-auto object-cover max-h-96"
                  />
                </div>
              )}

              {/* Action Icons */}
              <div className="flex items-center gap-8 text-gray-500 mt-2">
                <button className="hover:text-orange-500 transition-colors flex items-center gap-1 group">
                  <Repeat size={18} className="group-hover:stroke-orange-500" />
                </button>
                <button className="hover:text-orange-500 transition-colors flex items-center gap-1 group">
                  <MessageCircle
                    size={18}
                    className="group-hover:stroke-orange-500"
                  />
                </button>
                <button className="hover:text-orange-500 transition-colors flex items-center gap-1 group">
                  <Triangle
                    size={18}
                    className="group-hover:stroke-orange-500 rotate-90"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
