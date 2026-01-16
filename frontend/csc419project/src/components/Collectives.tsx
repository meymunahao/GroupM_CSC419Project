import { useEffect, useState } from "react";
import { getAuthHeader } from "../utils/auth";

interface Collective {
  id: number | string;
  name: string;
  subtitle: string;
  avatar: string;
}

const API_BASE_URL = "http://localhost:5001";

export default function Collectives() {
  const [collectives, setCollectives] = useState<Collective[]>([]);
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState<string | number | null>(null);

  // Load groups from backend
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/groups`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });

        if (!res.ok) {
          console.error("Failed to load groups");
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Map backend -> UI shape; adjust field names to match your API
        const mapped: Collective[] = data.map((g: any) => ({
          id: g.id,
          name: g.name,
          subtitle: g.slug ?? g.handle ?? g.description ?? "",
          avatar: g.coverImage ?? g.cover_image ?? "/avatar1.jpg",
        }));

        setCollectives(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleJoin = async (groupId: string | number) => {
    setJoiningId(groupId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${groupId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to join group");
        setJoiningId(null);
        return;
      }

      // Optionally update local state to reflect membership
      setCollectives((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, subtitle: g.subtitle } : g
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <aside className="hidden lg:block w-64 mr-12">
      <div className="sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-orange-500 font-semibold">Collectives</h3>
          <button className="text-orange-500 text-sm hover:underline">
            See all
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading && (
            <p className="text-gray-500 text-sm">Loading groups...</p>
          )}

          {!loading && collectives.length === 0 && (
            <p className="text-gray-500 text-sm">No groups yet.</p>
          )}

          {!loading &&
            collectives.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  className="text-orange-500 text-sm font-medium hover:underline disabled:text-gray-500"
                  onClick={() => handleJoin(item.id)}
                  disabled={joiningId === item.id}
                >
                  {joiningId === item.id ? "Joining..." : "Join"}
                </button>
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
