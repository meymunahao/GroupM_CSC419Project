import { useEffect, useState } from "react";
import { Repeat2, MessageSquare, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const GROUP_API_BASE = "http://localhost:5001";

type Group = {
  id: number;
  name: string;
  handle: string;
  creator_name: string;
  created_at: string;
  description: string;
  avatar_url: string;
  banner_url: string;
};

type GroupPost = {
  id: number;
  author_name: string;
  author_handle: string;
  content: string;
  avatar_url: string;
  media_url?: string | null;
};

export default function CollectivesPage() {
  // optional: if you route like /collectives/:groupId
  const { groupId } = useParams<{ groupId: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroupAndPosts() {
      try {
        setLoading(true);
        setError(null);

        const id = groupId || "1"; // default to group 1 if no param yet

        const [groupRes, postsRes] = await Promise.all([
          fetch(`${GROUP_API_BASE}/api/groups/${id}`),
          fetch(`${GROUP_API_BASE}/api/groups/${id}/posts`),
        ]);

        if (!groupRes.ok) {
          throw new Error(`Failed to load group: ${groupRes.status}`);
        }
        if (!postsRes.ok) {
          throw new Error(`Failed to load group posts: ${postsRes.status}`);
        }

        const groupData = await groupRes.json();
        const postsData = await postsRes.json();

        setGroup(groupData);
        setPosts(postsData);
      } catch (err: any) {
        console.error("Error loading collective", err);
        setError(err.message ?? "Failed to load collective");
      } finally {
        setLoading(false);
      }
    }

    fetchGroupAndPosts();
  }, [groupId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#161718] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading collective...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="w-full min-h-screen bg-[#161718] text-white flex items-center justify-center">
        <p className="text-red-400 text-sm">{error || "Collective not found"}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#161718] text-white overflow-x-hidden">
      {/* 1. Responsive Banner */}
      <div className="w-full h-40 md:h-52 bg-zinc-800">
        <img
          src={group.banner_url || "/head.png"}
          className="w-full h-full object-cover opacity-80"
          alt="Group Banner"
        />
      </div>

      {/* 2. Main Content Lane */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="relative -mt-10 md:-mt-12 flex flex-col items-start">
          <img
            src={group.avatar_url || "/statue.png"}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#161718] object-cover shadow-xl"
            alt="Collective Profile"
          />

          {/* Header Row */}
          <div className="w-full flex flex-col md:flex-row justify-between items-start mt-4 gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-lg md:text-xl font-bold tracking-tight">
                {group.name}
              </h1>
              <p className="text-gray-500 text-sm">@{group.handle}</p>

              <Link
                to="/create"
                className="mt-6 w-full bg-[#FF5C00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all text-center block shadow-lg shadow-orange-500/10"
              >
                New Post
              </Link>
            </div>

            {/* Meta Info */}
            <div className="md:text-right max-w-full md:max-w-[220px]">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Created by {group.creator_name} on{" "}
                {new Date(group.created_at).toLocaleDateString()}
              </p>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                {group.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Feed */}
        <div className="space-y-8 md:space-y-10">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              name={post.author_name}
              handle={post.author_handle}
              content={post.content}
              avatar={post.avatar_url || "/nimi.png"}
              postImage={post.media_url || undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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
