// src/components/Feed/PostCard.tsx
import { useNavigate } from "react-router-dom";
import PostActions from "./PostActions";

interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  image?: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const handleReply = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="group relative z-10">
      <div className="flex gap-4 mb-3">
        <img
          src={post.avatar}
          className="w-10 h-10 rounded-full object-cover"
          alt="avatar"
        />
        <div>
          <span className="font-bold text-sm text-white">{post.user}</span>
          <p className="text-gray-300 text-[14px] leading-snug mt-1">
            {post.content}
          </p>
        </div>
      </div>

      <div className="ml-14">
        {post.image && (
          <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#121212] mb-3">
            <img
              src={post.image}
              className="w-full max-h-112.5 object-cover"
              alt="post"
            />
          </div>
        )}

        <div className="relative z-20">
          <PostActions onReply={handleReply} />
        </div>

        <div className="h-px bg-white/5 w-full mt-8" />
      </div>
    </div>
  );
}
