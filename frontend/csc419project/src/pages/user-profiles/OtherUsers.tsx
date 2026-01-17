import { useState, useEffect } from "react";
import { Settings, Github, Plus, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Updated Tabs constant
const TABS = ["Posts", "Likes", "Community", "Bookmark"];

export default function OtherProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("Posts");
  const [profile, setProfile] = useState<any>(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0, friends: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      try {
        const profileUrl = userId 
          ? `https://redesigned-giggle.onrender.com/api/profile/${userId}` 
          : "https://redesigned-giggle.onrender.com/api/profile";
          
        const res = await fetch(profileUrl, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to load profile");
        
        const data = await res.json();
        setProfile(data);
        setIsOwner(!userId);

        const countUrl = userId 
          ? `https://redesigned-giggle.onrender.com/api/social/counts/${userId}` 
          : "https://redesigned-giggle.onrender.com/api/social/counts";

        const countRes = await fetch(countUrl, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (countRes.ok) {
          const countData = await countRes.json();
          setCounts({
            followers: countData.followers || 0,
            following: countData.following || 0,
            friends: countData.friends || 0
          });
        }

        if (userId) {
          const followRes = await fetch(`https://redesigned-giggle.onrender.com/api/follow/following/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (followRes.ok) {
            const followData = await followRes.json();
            setIsFollowing(followData.isFollowing || (Array.isArray(followData) && followData.length > 0));
          }
        }
      } catch (err) {
        console.error("Fetch profile failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Updated Follow logic to use your specific API
  const handleFollowAction = async () => {
    const token = localStorage.getItem("token");
    // If following, use DELETE; if not, use POST to your endpoint
    const method = isFollowing ? "DELETE" : "POST"; 
    
    try {
      const res = await fetch(`https://redesigned-giggle.onrender.com/api/follow/${userId}`, {
        method,
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        // Optimistic UI update: Toggle state and adjust count locally
        setIsFollowing(!isFollowing);
        setCounts(prev => ({
          ...prev,
          followers: isFollowing ? prev.followers - 1 : prev.followers + 1
        }));
      }
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a] text-white">
        <Loader2 className="animate-spin text-[#FF5C00]" size={40} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a] text-white">
        <p>Profile not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#121212] min-h-screen text-white">
      <div className="w-full relative mb-4">
        <div className="h-48 md:h-60 w-full bg-gray-800 relative">
          <img src="https://picsum.photos/1200/400" className="w-full h-full object-cover opacity-50" alt="Banner" />
        </div>

        <div className="px-4 relative">
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 rounded-full border-[6px] border-[#121212] overflow-hidden bg-gray-700">
              <img 
                src={profile.photoUrl || profile.profile?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} 
                className="w-full h-full object-cover" 
                alt="Avatar" 
              />
            </div>
          </div>

          <div className="pt-20 md:pt-24 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">
                    {profile.user?.username || profile.username || "User"}
                  </h1>
                  
                  {profile.links?.github ? (
                    <a 
                      href={profile.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-500 flex items-center gap-1.5 text-sm hover:underline mt-1"
                    >
                      <Github size={14} />
                      {profile.links.github.replace("https://", "")}
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                       <Github size={14} /> No GitHub linked
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isOwner ? (
                    <>
                      <button onClick={() => navigate("/settings")} className="p-2.5 border border-gray-800 rounded-xl hover:bg-gray-800 transition-all">
                        <Settings size={20} />
                      </button>
                      <button onClick={() => navigate("/create")} className="bg-orange-500 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                        <Plus size={18} /> New Post
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleFollowAction}
                      className={`${
                        isFollowing ? "bg-gray-800 text-white border border-gray-700" : "bg-orange-500 text-white"
                      } px-8 py-2.5 rounded-xl font-bold transition-all`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm max-w-xl">
                {profile.bio || profile.profile?.bio || "No bio yet."}
              </p>

              <div className="flex items-center gap-8 mt-2">
                <div className="flex gap-1.5"><span className="font-bold">{counts.following}</span><span className="text-gray-500">Following</span></div>
                <div className="flex gap-1.5"><span className="font-bold">{counts.followers}</span><span className="text-gray-500">Followers</span></div>
                <div className="flex gap-1.5"><span className="font-bold">{counts.friends}</span><span className="text-gray-500">Friends</span></div>
              </div>
            </div>
          </div>

          {/* Rendered Tabs Section */}
          <div className="flex items-center gap-8 border-b border-gray-800 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab ? "text-orange-500" : "text-gray-500 hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Placeholder */}
          <div className="py-4">
            {activeTab === "Posts" && <div className="text-gray-400">No posts to display.</div>}
            {/* Add logic for other tabs here */}
          </div>
        </div>
      </div>
    </div>
  );
}