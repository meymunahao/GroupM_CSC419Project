// src/pages/CollectivesPage.tsx
import { useEffect, useState } from "react";
import { Repeat2, MessageSquare, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getAuthHeader } from "../utils/auth";

const API_BASE_URL = "https://groupm-csc419project.onrender.com";

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
  const { groupId } = useParams<{ groupId: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function fetchGroupAndPosts() {
      try {
        setLoading(true);
        setError(null);

        const id = groupId || "1";

        const [groupRes, postsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/groups/${id}`, {
            headers: { 
              ...(getAuthHeader() as Record<string, string>) 
            },
          }),
          fetch(`${API_BASE_URL}/api/groups/${id}/posts`, {
            headers: { 
              ...(getAuthHeader() as Record<string, string>) 
            },
          }),
        ]);

        if (!groupRes.ok) throw new Error("Failed to load collective details");
        if (!postsRes.ok) throw new Error("Failed to load posts");

        const groupData = await groupRes.json();
        const postsData = await postsRes.json();

        setGroup({
          ...groupData,
          avatar_url: groupData.avatar_url || groupData.avatar || "/statue.png",
          banner_url: groupData.banner_url || groupData.cover_image || "/head.png",
        });
        setPosts(postsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGroupAndPosts();
  }, [groupId]);

  const handleJoin = async () => {
    if (!group) return;
    setJoining(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${group.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthHeader() as Record<string, string>),
        },
      });

      if (res.ok) {
        alert("Successfully joined the collective!");
      } else {
        alert("Failed to join.");
      }
    } catch (err) {
      console.error("Join error", err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-dark flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading collective...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="w-full min-h-screen bg-dark flex items-center justify-center">
        <p className="text-red-400">{error || "Collective not found"}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-dark text-white overflow-x-hidden">
      {/* 1. Banner */}
      <div className="w-full h-40 md:h-52 bg-zinc-800">
        <img
          src={group.banner_url}
          className="w-full h-full object-cover opacity-80"
          alt="Banner"
        />
      </div>

      {/* 2. Content */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-10 md:-mt-12 flex flex-col items-start">
          <img
            src={group.avatar_url}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-dark object-cover"
            alt="Avatar"
          />

          <div className="w-full flex flex-col md:flex-row justify-between items-start mt-4 gap-4">
            <div className="w-full md:w-auto">
              <h1 className="text-lg md:text-xl font-bold">{group.name}</h1>
              <p className="text-gray-500 text-sm">@{group.handle || group.id}</p>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="flex-1 md:px-8 bg-[#FF5C00] text-white font-bold py-2 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                  {joining ? "Joining..." : "Join Collective"}
                </button>
                <Link
                  to="/create"
                  className="px-4 bg-zinc-800 text-white font-bold py-2 rounded-xl hover:bg-zinc-700 transition-all"
                >
                  New Post
                </Link>
              </div>
            </div>

            <div className="md:text-right max-w-full md:max-w-55">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Created {new Date(group.created_at).toLocaleDateString()}
              </p>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                {group.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/5 mt-10 mb-8 text-xs font-medium text-gray-500">
          <button className="pb-4 text-white border-b-2 border-primary">Posts</button>
          <button className="pb-4">Members</button>
          <button className="pb-4">About</button>
        </div>

        {/* Feed */}
        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostItem
                key={post.id}
                name={post.author_name}
                handle={post.author_handle}
                content={post.content}
                avatar={post.avatar_url || "/nimi.png"}
                postImage={post.media_url || undefined}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">No posts yet in this collective.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PostItem({ name, handle, content, avatar, postImage }: any) {
  return (
    <div className="flex gap-4 border-b border-white/5 pb-8">
      <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt={name} />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{name}</span>
          <span className="text-gray-500 text-xs">{handle}</span>
        </div>
        <p className="text-sm text-gray-300">{content}</p>
        {postImage && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-white/5">
            <img src={postImage} className="w-full h-auto max-h-125 object-cover" alt="Post" />
          </div>
        )}
        <div className="flex gap-6 mt-3 text-gray-500">
          <Repeat2 size={16} className="hover:text-green-500 cursor-pointer transition-colors" />
          <MessageSquare size={16} className="hover:text-orange-500 cursor-pointer transition-colors" />
          <Heart size={16} className="hover:text-red-500 cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
}