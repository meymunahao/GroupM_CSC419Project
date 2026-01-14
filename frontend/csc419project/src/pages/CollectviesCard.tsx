import { Search, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for the list
const COLLECTIVES_DATA = [
  {
    id: "underrated-genius",
    name: "Underrated genius",
    handle: "@nimitimi",
    avatar: "/statue.png",
    banner: "/head.png",
    description: "Taste, storytelling, aesthetics, and creative authenticity are everywhere right now.",
    members: "2.4k"
  },
  {
    id: "digital-anarchy",
    name: "Digital Anarchy",
    handle: "@anarchist",
    avatar: "/brow.png",
    banner: "/Lookup.png",
    description: "Exploring the intersection of brutalist design and modern web interfaces.",
    members: "1.2k"
  },
  {
    id: "sound-collective",
    name: "Music Collective",
    handle: "@soundwaves",
    avatar: "/nimi.png",
    banner: "/head.png",
    description: "A space for underground producers and sound designers to share raw loops.",
    members: "850"
  }
];

export default function ExploreCollectives() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#161718] text-white pb-20">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Collectives</h1>
        <p className="text-gray-500 text-sm md:text-base mb-8">
          Discover communities built around taste, aesthetics, and niche interests.
        </p>

        {/* Search Bar */}
        <div className="relative w-full mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search collectives..." 
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50 transition-all text-sm"
          />
        </div>

        {/* Collectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLECTIVES_DATA.map((collective) => (
            <div 
              key={collective.id}
              onClick={() => navigate(`/collectives/${collective.id}`)}
              className="group bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden hover:bg-zinc-900/60 transition-all cursor-pointer shadow-xl"
            >
              {/* Card Banner */}
              <div className="h-24 w-full bg-zinc-800 relative">
                <img 
                  src={collective.banner} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                  alt="Banner" 
                />
              </div>

              {/* Card Content */}
              <div className="px-5 pb-6">
                <div className="relative -mt-8 flex justify-between items-end mb-4">
                  <img 
                    src={collective.avatar} 
                    className="w-16 h-16 rounded-2xl border-4 border-[#161718] object-cover shadow-lg" 
                    alt={collective.name} 
                  />
                  <div className="flex items-center gap-1.5 bg-[#161718] px-3 py-1 rounded-full border border-white/5 text-[10px] text-gray-400 font-medium">
                    <Users size={12} className="text-[#FF5C00]" />
                    {collective.members}
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
          ))}
        </div>
      </div>
    </div>
  );
}