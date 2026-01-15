import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const TABS = ["Posts", "Likes", "Community", "Bookmark"];

export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Use for visiting others
  const [activeTab, setActiveTab] = useState("Posts");
  const [profile, setProfile] = useState<any>(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0, friends: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        // 1. Fetch Profile - Based on Screenshot (514).png
        const profileUrl = userId ? `http://localhost:5000/api/profile/${userId}` : "http://localhost:5000/api/profile";
        const res = await fetch(profileUrl, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
        setIsOwner(!userId);

        // 2. Fetch Counts - Based on Screenshot (525).png
        const countRes = await fetch("http://localhost:5000/api/social/counts", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const countData = await countRes.json();
        setCounts(countData);

        // 3. Check Following Status if not owner - Based on Screenshot (523).jpg
        if (userId) {
          const followRes = await fetch(`http://localhost:5000/api/follow/following/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const followData = await followRes.json();
          setIsFollowing(!!followData.length);
        }
      } catch (err) {
        console.error("Fetch profile failed", err);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleFollowAction = async () => {
    const token = localStorage.getItem("token");
    const method = isFollowing ? "DELETE" : "POST"; // Based on Screenshot (522).jpg & Screenshot (524).jpg
    try {
      const res = await fetch(`http://localhost:5000/api/follow/${userId}`, {
        method,
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  if (!profile) return <div className="p-10 text-white">Loading profile...</div>;

  return (
    <div className="w-full bg-[#121212] min-h-screen text-white">
      <div className="w-full relative mb-4">
        <div className="h-48 md:h-60 w-full bg-gray-800 relative">
          <img src="https://picsum.photos/1200/400" className="w-full h-full object-cover" alt="Banner" />
        </div>

        <div className="px-4 relative">
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 rounded-full border-[6px] border-[#121212] overflow-hidden bg-gray-700">
              <img src={profile.photoUrl || "https://i.pravatar.cc/300"} className="w-full h-full object-cover" alt="Avatar" />
            </div>
          </div>

          <div className="pt-20 md:pt-24 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{profile.fullName || "User"}</h1>
                  <p className="text-gray-500">@{profile.userId?.slice(0, 8)}</p>
                </div>

                <div className="flex items-center gap-3">
                  {isOwner ? (
                    <>
                      <button onClick={() => navigate("/settings")} className="p-2.5 border border-gray-800 rounded-xl">
                        <Settings size={20} />
                      </button>
                      <button onClick={() => navigate("/create")} className="bg-orange-500 px-6 py-2.5 rounded-xl font-bold">
                        New Post
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleFollowAction}
                      className={`${isFollowing ? 'bg-gray-800' : 'bg-orange-500'} px-8 py-2.5 rounded-xl font-bold`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm max-w-xl">{profile.bio || "No bio yet."}</p>

              <div className="flex items-center gap-10 mt-2">
                <div className="flex gap-1.5"><span className="font-bold">{counts.following}</span><span className="text-gray-500">Following</span></div>
                <div className="flex gap-1.5"><span className="font-bold">{counts.followers}</span><span className="text-gray-500">Followers</span></div>
                <div className="flex gap-1.5"><span className="font-bold">{counts.friends}</span><span className="text-gray-500">Friends</span></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-gray-800 pb-4 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm transition-all ${activeTab === tab ? "bg-[#1f1f1f]" : "text-gray-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}