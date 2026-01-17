// src/pages/ExploreCollectives.tsx
import { Search, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../utils/auth";

const API_BASE_URL = "https://groupm-csc419project.onrender.com";

type Collective = {
  id: string | number;
  name: string;
  handle: string;
  avatar_url: string;
  banner_url: string;
  description: string;
  members_count: number;
};

export default function ExploreCollectives() {
  const navigate = useNavigate();
  const [collectives, setCollectives] = useState<Collective[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        setError(null);

        const endpoint = query
          ? `${API_BASE_URL}/api/groups/search?q=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/api/groups`;

        const res = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            // FIX: Added type assertion to satisfy HeadersInit
            ...(getAuthHeader() as Record<string, string>),
          },
        });

        if (!res.ok) throw new Error(`Failed to load groups: ${res.status}`);

        const data = await res.json();
        
        const mappedData = data.map((group: any) => ({
          id: group.id,
          name: group.name,
          description: group.description || "No description provided.",
          banner_url: group.cover_image || group.banner_url || "https://picsum.photos/800/200",
          members_count: group.members_count ?? 0,
          handle: group.handle || group.slug || `@group-${group.id}`,
          avatar_url: group.avatar_url || group.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${group.name}`
        }));

        setCollectives(mappedData);
      } catch (err: any) {
        console.error("Error loading groups", err);
        setError("Failed to sync with database.");
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
        fetchGroups();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="w-full min-h-screen bg-dark text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Collectives</h1>
            <p className="text-gray-500 text-sm md:text-base">
              Discover communities built around taste, aesthetics, and niche interests.
            </p>
          </div>

          <button
            onClick={() => navigate("/collectives/new")}
            className="bg-[#FF5C00] text-white font-bold py-2.5 px-5 rounded-xl hover:bg-orange-600 transition-all text-sm shadow-lg shadow-orange-500/10"
          >
            Create Collective
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search collectives..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50 transition-all text-sm"
          />
        </div>

        {/* Collectives Grid */}
        {loading ? (
           <div className="flex items-center justify-center py-20">
             <p className="text-gray-400 text-sm animate-pulse">Syncing with database...</p>
           </div>
        ) : error ? (
            <div className="flex items-center justify-center py-20">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collectives.length > 0 ? (
              collectives.map((collective) => (
                <div
                  key={collective.id}
                  onClick={() => navigate(`/collectives/${collective.id}`)}
                  className="group bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden hover:bg-zinc-900/60 transition-all cursor-pointer"
                >
                  <div className="h-24 w-full bg-zinc-800 relative">
                    <img
                      src={collective.banner_url}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      alt="Banner"
                    />
                  </div>

                  <div className="px-5 pb-6">
                    <div className="relative -mt-8 flex justify-between items-end mb-4">
                      <img
                        src={collective.avatar_url}
                        className="w-16 h-16 rounded-2xl border-4 border-dark object-cover shadow-lg"
                        alt={collective.name}
                      />
                      <div className="flex items-center gap-1.5 bg-dark px-3 py-1 rounded-full border border-white/5 text-[10px] text-gray-400 font-medium">
                        <Users size={12} className="text-[#FF5C00]" />
                        {collective.members_count.toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-lg group-hover:text-[#FF5C00] transition-colors">
                        {collective.name}
                      </h3>
                      <p className="text-xs text-gray-500">{collective.handle}</p>
                    </div>

                    <p className="mt-3 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {collective.description}
                    </p>

                    <div className="mt-5 flex items-center text-[#FF5C00] text-xs font-bold gap-2">
                      View Collective <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No collectives match your search.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}