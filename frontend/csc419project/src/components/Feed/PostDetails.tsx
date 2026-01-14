import CommentBox from "../Feed/CommentBox";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PostDetails() {
  return (
    <main className="flex-1 py-8 px-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Back Button - Forced to the top layer */}
        <Link
          to="/home"
          className="relative z-100 flex items-center gap-2 text-gray-400 hover:text-[#FF5C00] mb-6 transition-colors group cursor-pointer w-fit"
          style={{
            display: "flex",
            position: "relative",
            pointerEvents: "auto",
          }}
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back to feed</span>
        </Link>

        {/* The Focused Post */}
        <div className="bg-[#121212] rounded-3xl p-6 border border-white/5 mb-8">
          <div className="flex gap-4 mb-4">
            <img
              src="/nimi.png"
              className="w-10 h-10 rounded-full"
              alt="avatar"
            />
            <div>
              <span className="font-bold text-white">The anarchist</span>
              <p className="text-gray-300 mt-1">
                Just passed a storefront window full of cacti...
              </p>
            </div>
          </div>

          <img
            src="/Lookup.png"
            className="rounded-2xl w-full object-cover mb-4 border border-white/10 shadow-[0_0_30px_rgba(255,92,0,0.1)] transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(255,92,0,0.2)]"
            alt="Post content"
          />
        </div>

        {/* The Comment Input */}
        <CommentBox />

        {/* --- TASK 2 POLISHED: THREADED COMMENTS START --- */}
        <div className="mt-10 space-y-8 relative">
          {/* Vertical connection line */}
          <div className="absolute left-4 top-0 bottom-0 w-1px bg-white/10 -ml-px" />

          <div className="flex gap-4 relative z-10">
            {/* Avatar with your brand color */}
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#FF5C00] to-yellow-500 border-2 border-black shrink-0" />

            <div className="flex-1 bg-[#121212] p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white text-sm">
                  Oluwalonimi
                </span>
                <span className="text-[10px] text-gray-500">Just now</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Just passed a storefront window full of cati wearing a bunch of
                tiny santa hats, seasonal depression cured.
              </p>
            </div>
          </div>
        </div>
        {/* --- THREADED COMMENTS END --- */}

        {/* ADD THE POLISHED CODE STARTING HERE */}
        <div className="mt-10 space-y-8 relative">
          {/* The Thread Line - This creates that vertical connection look */}
          <div className="absolute left-4 top-0 bottom-0 w-[0.5px] bg-white/10 -ml-px" />

          {/* Reply #1 */}
          <div className="flex gap-4 relative z-10">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#FF5C00] to-yellow-400 border-2 border-black shrink-0" />
            <div className="flex-1 bg-[#121212] p-4 rounded-2xl border border-white/5 shadow-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-white">
                  The anarchist
                </span>
                <span className="text-[10px] text-gray-600">2h ago</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Just passed a storefront window full of cati wearing a bunch of
                tiny santa hats, seasonal depression cured.
              </p>
            </div>
          </div>

          {/* You can add a second reply here to show the grid/list working */}
        </div>
        {/* ADD THE POLISHED CODE ENDING HERE */}

        {/* Static Threaded Comments */}
        <div className="mt-10 space-y-8">
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-orange-500 to-amber-300" />
            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="font-bold text-sm text-white">
                Underrated genius
              </span>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                Just passed a storefront window full of cati wearing a bunch of
                tiny santa hats, seasonal depression cured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}