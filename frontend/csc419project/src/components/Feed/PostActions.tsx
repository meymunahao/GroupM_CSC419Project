// src/components/PostActions.tsx
import { Repeat2, MessageSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function PostActions() {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  
  // Example initial counts
  const [likeCount, setLikeCount] = useState(12);
  const [repostCount, setRepostCount] = useState(4);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); // Prevents the click from bubbling to the post card
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReposted(!reposted);
    setRepostCount(prev => reposted ? prev - 1 : prev + 1);
  };

  return (
    <div className="flex gap-8 mt-4 text-gray-500">
      {/* Repost */}
      <button
        onClick={handleRepost}
        className={`flex items-center gap-2 hover:text-green-500 transition ${
          reposted ? "text-green-500" : ""
        }`}
      >
        <div className="p-2 -m-2 rounded-full hover:bg-green-500/10">
          <Repeat2 size={19} />
        </div>
        <span className="text-xs font-medium">{repostCount}</span>
      </button>

      {/* Reply */}
      <Link
  to={`/comments`} // Added the / at the start
  onClick={(e) => e.stopPropagation()}
  className="flex items-center gap-2 hover:text-[#FF5C00] transition"
>
  <div className="p-2 -m-2 rounded-full hover:bg-[#FF5C00]/10">
    <MessageSquare size={19} />
  </div>
  <span className="text-xs font-medium">Reply</span>
</Link>

      {/* Like */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 hover:text-pink-500 transition ${
          liked ? "text-pink-500" : ""
        }`}
      >
        <div className="p-2 -m-2 rounded-full hover:bg-pink-500/10">
          <Heart size={19} fill={liked ? "currentColor" : "none"} />
        </div>
        <span className="text-xs font-medium">{likeCount}</span>
      </button>
    </div>
  );
}