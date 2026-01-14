import { Repeat2, MessageSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom"; // Replace useNavigate with Link

export default function CollectivesPage() {

  return (
    <div className="w-full min-h-screen bg-[#161718] text-white overflow-x-hidden">
      {/* 1. Responsive Banner: Height scales down on mobile */}
      <div className="w-full h-40 md:h-52 bg-zinc-800">
        <img
          src="/head.png"
          className="w-full h-full object-cover opacity-80"
          alt="Group Banner"
        />
      </div>

      {/* 2. Main Content Lane: Flexible width */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="relative -mt-10 md:-mt-12 flex flex-col items-start">
          <img
            src="/statue.png"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#161718] object-cover shadow-xl"
            alt="Collective Profile"
          />

          {/* Header Row: Stack on mobile, side-by-side on tablet+ */}
          <div className="w-full flex flex-col md:flex-row justify-between items-start mt-4 gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-lg md:text-xl font-bold tracking-tight">
                Underrated genius
              </h1>
              <p className="text-gray-500 text-sm">@nimitimi</p>

              <Link
                to="/create"
                className="mt-6 w-full bg-[#FF5C00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all text-center block shadow-lg shadow-orange-500/10"
              >
                New Post
              </Link>
            </div>

            {/* Meta Info: Hidden or shrunk on small mobile, aligned right on desktop */}
            <div className="md:text-right max-w-full md:max-w-[220px]">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Created by anarchist on 12/21/2202
              </p>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                Taste, storytelling, aesthetics, and creative authenticity are
                everywhere right now. Designers are loading much of this work in
                startups.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs: Scrollable horizontally on small screens */}
        <div className="flex gap-4 md:gap-8 border-b border-white/5 mt-10 mb-8 text-xs font-medium text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button className="pb-4 text-white border-b-2 border-[#FF6719] px-2 bg-white/5 rounded-t-md">
            Posts
          </button>
          <button className="pb-4 hover:text-gray-300 transition">Likes</button>
          <button className="pb-4 hover:text-gray-300 transition">
            Community
          </button>
          <button className="pb-4 hover:text-gray-300 transition">
            Bookmark
          </button>
        </div>

        {/* 4. Feed */}
        <div className="space-y-8 md:space-y-10">
          <PostItem
            name="The anarchist"
            handle="@anarchist"
            content="Just passed a storefront window full of cacti wearing a bunch of tiny santa hats. seasonal depression cured."
            avatar="/nimi.png"
          />
          {/* ... Other posts ... */}
          <PostItem
            name="The anarchist"
            handle="from music collective"
            content="Just passed a storefront window full of cacti wearing a bunch of tiny santa hats."
            avatar="/brow.png"
            postImage="/Lookup.png"
          />
        </div>
      </div>
    </div>
  );
}

// Responsive Post Item Component
function PostItem({
  name,
  handle,
  content,
  avatar,
  postImage,
}: {
  name: string;
  handle: string;
  content: string;
  avatar: string;
  postImage?: string;
}) {
  return (
    <div className="flex gap-3 md:gap-4 border-b border-white/5 pb-6 md:pb-8">
      <img
        src={avatar}
        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover"
        alt={name}
      />
      <div className="flex flex-col gap-1 w-full overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-xs md:text-sm">{name}</span>
          <span className="text-gray-500 text-[10px] md:text-xs">{handle}</span>
        </div>
        <p className="text-xs md:text-sm text-gray-300 leading-snug">
          {content}
        </p>

        {postImage && (
          <div className="mt-3 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl w-full">
            <img
              src={postImage}
              className="w-full h-auto object-cover max-h-[400px] md:max-h-[500px]"
              alt="Post Content"
            />
          </div>
        )}

        <div className="flex gap-4 md:gap-6 mt-3 text-gray-500">
          <Repeat2
            size={14}
            className="md:w-4 md:h-4 hover:text-green-500 cursor-pointer"
          />
          <MessageSquare
            size={14}
            className="md:w-4 md:h-4 hover:text-orange-500 cursor-pointer"
          />
          <Heart
            size={14}
            className="md:w-4 md:h-4 hover:text-red-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
