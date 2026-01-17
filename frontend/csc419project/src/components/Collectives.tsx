import { useEffect, useState } from "react";
import { getAuthHeader } from "../utils/auth";

interface Collective {
  id: number | string;
  name: string;
  subtitle: string;
  avatar: string;
}

// Ensure this matches your live backend
const API_BASE_URL = "https://groupm-csc419project.onrender.com";

export default function Collectives() {
  const [collectives, setCollectives] = useState<Collective[]>([]);
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/groups`, {
          headers: {
            "Content-Type": "application/json",
            // FIX: Type assertion to satisfy HeadersInit
            ...(getAuthHeader() as Record<string, string>),
          },
        });

        if (!res.ok) {
          console.error("Failed to load groups");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Mapping backend DB columns to your UI interface
        const mapped: Collective[] = data.map((g: any) => ({
          id: g.id,
          name: g.name,
          subtitle: g.slug ?? g.handle ?? g.description ?? "Community",
          // Fallback logic for avatars
          avatar: g.avatar_url ?? g.cover_image ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${g.name}`,
        }));

        setCollectives(mapped);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleJoin = async (groupId: string | number) => {
    setJoiningId(groupId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // FIX: Type assertion here as well
          ...(getAuthHeader() as Record<string, string>),
        },
      });

      if (!res.ok) {
        alert("Failed to join group");
        return;
      }

      alert("Successfully joined!");
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <aside className="hidden lg:block w-64 mr-12">
      <div className="sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-orange-500 font-semibold">Collectives</h3>
          <button className="text-orange-500 text-sm hover:underline">See all</button>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-gray-500 text-sm animate-pulse">Loading...</p>}

          {!loading && collectives.map((item) => (
            <div key={item.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/10"
                />
                <div className="max-w-30">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-gray-500 text-[10px] truncate">{item.subtitle}</p>
                </div>
              </div>

              <button
                className="text-orange-500 text-sm font-medium hover:text-orange-400 disabled:text-gray-600 transition-colors"
                onClick={() => handleJoin(item.id)}
                disabled={joiningId === item.id}
              >
                {joiningId === item.id ? "..." : "Join"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}