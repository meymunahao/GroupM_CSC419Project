import { Search, Loader2, UserPlus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FriendsPage() {
  const navigate = useNavigate();
  
  // FIX: Removed unused 'categories' array to clear TypeScript error 6133

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `https://redesigned-giggle.onrender.com/api/profile/search?q=${query}&page=1&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, 
            },
          }
        );

        const data = await response.json();
        
        if (data && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleFollowClick = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation(); 
    
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`https://redesigned-giggle.onrender.com/api/follow/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setFollowedIds((prev) => [...prev, userId]);
      }
    } catch (error) {
      console.error("Follow request failed:", error);
    }
  };

  return (
    <main className="flex-1 bg-[#0a0a0a] py-8 px-4 overflow-y-auto flex justify-center scrollbar-hide">
      <div className="w-full max-w-4xl flex flex-col">
        
        {/* Search Bar */}
        <div className="relative w-full mb-8">
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            {isLoading ? <Loader2 className="text-[#FF5C00] animate-spin" size={20} /> : <Search className="text-gray-400" size={20} />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search usernames..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-full py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50"
          />
        </div>

        {/* Results Grid */}
        {query.trim().length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
            {results.length > 0 ? (
              results.map((user: any) => {
                const isAlreadyFollowed = followedIds.includes(user.id);

                return (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/other-profiles/${user.id}`)}
                    className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center hover:border-[#FF5C00]/50 transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 mb-3 group-hover:scale-105 transition-transform bg-[#222]">
                      <img
                        src={user.profile?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`)}
                      />
                    </div>

                    <h3 className="text-white font-bold text-lg truncate w-full">{user.username}</h3>
                    <p className="text-[#FF5C00] text-xs font-medium mb-2">@{user.username?.toLowerCase()}</p>
                    
                    {/* FIX: min-h-[32px] changed to min-h-8 */}
                    <p className="text-gray-400 text-xs line-clamp-2 mb-4 min-h-8">
                      {user.profile?.bio || "No bio available"}
                    </p>

                    <button 
                      disabled={isAlreadyFollowed}
                      onClick={(e) => handleFollowClick(e, user.id)}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        isAlreadyFollowed 
                        ? "bg-gray-800 text-gray-400 cursor-default" 
                        : "bg-white text-black hover:bg-[#FF5C00] hover:text-white"
                      }`}
                    >
                      {isAlreadyFollowed ? (
                        <> <Check size={14} /> Followed </>
                      ) : (
                        <> <UserPlus size={14} /> Follow </>
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              !isLoading && <div className="col-span-full text-center py-20 text-gray-500">No users found.</div>
            )}
          </div>
        ) : (
          <div className="text-gray-600 text-center">Enter a name to start searching</div>
        )}
      </div>
    </main>
  );
}