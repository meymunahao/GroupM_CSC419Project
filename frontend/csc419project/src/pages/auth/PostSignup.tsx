import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TOPICS = [
  { id: "music", label: "Music" }, { id: "books", label: "Books" },
  { id: "travel", label: "Travel" }, { id: "cooking", label: "Cooking" },
  { id: "tech", label: "Tech" }, { id: "art", label: "Art" },
  { id: "fitness", label: "Fitness" }, { id: "photography", label: "Photography" },
  { id: "writing", label: "Writing" }, { id: "fashion", label: "Fashion" },
  { id: "science", label: "Science" }, { id: "movies", label: "Movies" },
];

export default function InterestSelection() {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((topicId) => topicId !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selectedTopics.length < 3) return;
    
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const interestLabels = selectedTopics.map(id => TOPICS.find(t => t.id === id)?.label);

    try {
      const res = await fetch("http://localhost:5000/api/profile/interests", {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ interests: interestLabels }),
      });

      if (res.ok) {
        navigate("/home");
      } else {
        const data = await res.json();
        setError(data.message || `Error: ${res.status} - Could not save interests`);
      }
    } catch (err) {
      console.error("Failed to save interests", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#121212] font-sans text-white flex flex-col overflow-hidden">
      <header className="px-6 py-4 flex items-center gap-2 shrink-0">
        <img src="/logo.svg" alt="gConnect Logo" className="w-6 h-6" />
        <span className="text-lg font-bold">gConnect</span>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-4 min-h-0">
        <div className="w-full max-w-2xl flex flex-col items-center h-full">
          <div className="shrink-0 w-full flex flex-col items-center mb-4">
            <div className="w-full max-w-sm mb-4">
              <div className="flex justify-between items-baseline mb-1">
                 <p className="text-gray-500 text-xs font-medium">Step 1 of 2</p>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-orange-500"></div>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">What do you love?</h1>
              <p className="text-gray-400 text-xs md:text-sm">Pick at least 3 topics to help us personalise your feed.</p>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
          </div>

          <div className="flex-1 w-full overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden">
             <div className="grid grid-cols-4 gap-5 w-full content-start">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`aspect-4/3 flex flex-col items-center justify-center rounded-2xl transition-all p-2 ${isSelected ? "bg-orange-500 text-white" : "bg-white text-gray-900"}`}
                  >
                    <img src={`/icons/${topic.id}.svg`} alt={topic.label} className={`w-6 h-6 mb-2 ${isSelected ? 'brightness-0 invert' : ''}`} />
                    <span className="text-[10px] md:text-xs font-bold">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 w-full py-6 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={selectedTopics.length < 3 || loading}
              className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 py-3 rounded-full text-white font-bold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}