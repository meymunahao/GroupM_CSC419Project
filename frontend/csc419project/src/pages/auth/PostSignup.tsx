import { useState } from "react";
import { useNavigate } from "react-router-dom";


const TOPICS = [
  { id: "music", label: "Music" },
  { id: "books", label: "Books" },
  { id: "travel", label: "Travel" },
  { id: "cooking", label: "Cooking" },
  { id: "tech", label: "Tech" },
  { id: "art", label: "Art" },
  { id: "fitness", label: "Fitness" },
  { id: "photography", label: "Photography" },
  { id: "writing", label: "Writing" },
  { id: "fashion", label: "Fashion" },
  { id: "science", label: "Science" },
  { id: "movies", label: "Movies" },
];

export default function InterestSelection() {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id)
        ? prev.filter((topicId) => topicId !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate("/profile-setup");
  };

  return (
    <div className="h-screen w-full bg-[#121212] font-sans text-white flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="px-6 py-4 flex items-center gap-2 shrink-0">
        <img src="/logo.svg" alt="gConnect Logo" className="w-6 h-6 object-contain" />
        <span className="text-lg font-bold tracking-tight">gConnect</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full px-4 min-h-0">
        <div className="w-full max-w-2xl flex flex-col items-center h-full">
          
          {/* Progress & Title Area */}
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
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                What do you love?
              </h1>
              <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                Pick at least 3 topics to help us personalise your feed.
              </p>
            </div>
          </div>

          {/* Grid of Interests */}
          {/* Added utility classes to hide scrollbar but keep functionality */}
          <div className="flex-1 w-full min-h-0 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
             <div className="grid grid-cols-4 gap-5 w-full content-start">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    // Changed aspect ratio to [4/3] to make them shorter
                    className={`
                      aspect-4/3 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 p-2 shadow-sm
                      ${isSelected 
                        ? "bg-orange-500 text-white shadow-orange-500/25" 
                        : "bg-white text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    <img 
                      src={`/icons/${topic.id}.svg`} 
                      alt={topic.label}
                      // Invert filter turns black icons white when selected
                      className={`w-6 h-6 md:w-8 md:h-8 mb-2 object-contain transition-all ${isSelected ? 'brightness-0 invert' : ''}`}
                    />
                    <span className="text-[10px] md:text-xs font-bold">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue Button */}
          <div className="shrink-0 w-full py-6 flex justify-center">
            <button
              onClick={handleContinue}
              className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 transition-colors py-3 md:py-4 rounded-full text-white font-bold text-base md:text-lg shadow-lg shadow-orange-500/20"
            >
              Continue
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}