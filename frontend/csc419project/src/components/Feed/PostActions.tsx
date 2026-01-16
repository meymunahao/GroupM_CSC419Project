// src/components/Feed/PostActions.tsx
import { Repeat2, MessageSquare, Heart } from "lucide-react";
import { useState } from "react";

interface PostActionsProps {
  onReply?: () => void;
}

export default function PostActions({ onReply }: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);

  const [likeCount, setLikeCount] = useState(12);
  const [repostCount, setRepostCount] = useState(4);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReposted(!reposted);
    setRepostCount((prev) => (reposted ? prev - 1 : prev + 1));
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReply?.();
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
      <button
        type="button"
        onClick={handleReplyClick}
        className="flex items-center gap-2 hover:text-[#FF5C00] transition"
      >
        <div className="p-2 -m-2 rounded-full hover:bg-[#FF5C00]/10">
          <MessageSquare size={19} />
        </div>
        <span className="text-xs font-medium">Reply</span>
      </button>

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
