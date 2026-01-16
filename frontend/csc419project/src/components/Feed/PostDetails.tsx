import { useEffect, useState } from "react";
import CommentBox from "../Feed/CommentBox";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5001";

type Post = {
  id: string;
  user_name: string;
  avatar_url: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
};

type Comment = {
  id: number;
  user_name: string;
  avatar_url: string | null;
  content: string;
  created_at: string;
};

export default function PostDetails() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchPost = async () => {
    if (!postId) return;
    try {
      setLoadingPost(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to load post:", data);
        return;
      }
      setPost({
        id: data.id,
        user_name: data.user_name ?? "Unknown",
        avatar_url: data.avatar_url ?? null,
        content: data.content,
        image_url: data.image_url ?? null,
        created_at: data.created_at,
      });
    } catch (err) {
      console.error("Error loading post", err);
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchComments = async () => {
    if (!postId) return;
    try {
      setLoadingComments(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to load comments:", data);
        return;
      }
      setComments(data);
    } catch (err) {
      console.error("Error loading comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  return (
    <main className="flex-1 py-8 px-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto relative">
        {/* Back button */}
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/home"); // adjust to your feed route
            }
          }}
          className="relative z-10 flex items-center gap-2 text-gray-400 hover:text-[#FF5C00] mb-6 transition-colors group cursor-pointer w-fit"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back to feed</span>
        </button>

        {/* Focused Post */}
        <div className="bg-[#121212] rounded-3xl p-6 border border-white/5 mb-8">
          {loadingPost && (
            <p className="text-gray-500 text-sm">Loading post...</p>
          )}

          {!loadingPost && post && (
            <>
              <div className="flex gap-4 mb-4">
                <img
                  src={post.avatar_url || "/nimi.png"}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
                <div>
                  <span className="font-bold text-white">
                    {post.user_name}
                  </span>
                  <p className="text-gray-300 mt-1">{post.content}</p>
                </div>
              </div>

              {post.image_url && (
                <img
                  src={post.image_url}
                  className="rounded-2xl w-full object-cover mb-4 border border-white/10 shadow-[0_0_30px_rgba(255,92,0,0.1)]"
                  alt="Post content"
                />
              )}
            </>
          )}
        </div>

        {/* Comment input */}
        {postId && (
          <CommentBox postId={postId} onCommentCreated={fetchComments} />
        )}

        {/* Comments list */}
        <div className="mt-10 space-y-8 relative">
          {!loadingComments && comments.length === 0 && (
            <p className="text-gray-500 text-sm">
              No replies yet. Be the first to comment.
            </p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 relative z-10">
              <img
                src={comment.avatar_url || "/nimi.png"}
                alt={comment.user_name}
                className="w-9 h-9 rounded-full"
              />
              <div className="flex-1 bg-[#121212] p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-sm">
                    {comment.user_name}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
