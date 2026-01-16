// src/pages/HomeFeed.tsx
import { useEffect, useState } from "react";
import PostCard from "../components/Feed/PostCard";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { getAuthHeader, getCurrentUser } from "../utils/auth";

const API_BASE_URL = "http://localhost:5001";

type Post = {
  id: number;
  user: string;
  avatar: string;
  content: string;
  image?: string | null;
};

import CommentBox from "../components/Feed/CommentBox";

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activePostId, setActivePostId] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const displayName = currentUser?.username || currentUser?.email || "there";

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/posts/feed`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch posts: ${res.status}`);
        }

        const data = await res.json();

        const mappedPosts: Post[] = data.map((p: any) => ({
          id: p.id,
          user: p.user_name ?? `User ${p.user_id}`,
          avatar: p.avatar_url ?? "/nimi.png",
          content: p.content,
          image: p.image_url,
        }));

        setPosts(mappedPosts);
      } catch (err: any) {
        console.error("Error fetching posts", err);
        setError(err.message ?? "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="space-y-6 relative">
      {/* Loading popup (optional) */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#121212] border border-white/10 rounded-2xl px-6 py-4 shadow-xl">
            <p className="text-white font-medium">Loading posts...</p>
          </div>
        </div>
      )}

      <Link
        to="/create"
        className="flex items-center gap-4 bg-[#121212] p-4 rounded-2xl border border-white/5 hover:bg-[#1a1a1a] transition"
      >
        <img src="/nimi.png" className="w-10 h-10 rounded-full" />
        <span className="text-gray-500 flex-1">
          {`What's on your mind, ${displayName}?`}
        </span>
        <div className="bg-[#FF5C00] p-2.5 rounded-xl text-white">
          <Send size={18} />
        </div>
      </Link>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading &&
        !error &&
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onReply={() => setActivePostId(String(post.id))}
          />
        ))}

      {/* Comment popup modal triggered by reply */}
      {activePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-xl bg-[#121212] border border-white/10 rounded-3xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white font-semibold text-sm">
                Reply to post
              </h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setActivePostId(null)}
              >
                ✕
              </button>
            </div>
            <CommentBox
              postId={activePostId}
              onCommentCreated={() => {
                // Optionally: refresh comments somewhere else
                setActivePostId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
