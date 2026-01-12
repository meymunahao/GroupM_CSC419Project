import { Search } from "lucide-react";

export default function FriendsPage() {
  return (
    <main className="flex-1 py-6 px-8 overflow-y-auto">
      {" "}
      {/* Reduced py-10 to py-6 to move it up */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold">Search</h1>

          {/* Search Bar - Now aligned higher */}
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#121212] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FF5C00]/50 transition-all text-white"
            />
          </div>
        </div>

        {/* Removed the Friends Grid and Follow tabs as requested */}
        <div className="text-center py-20 text-gray-500 border border-dashed border-white/5 rounded-3xl">
          <p>Search for users to see them here.</p>
        </div>
      </div>
    </main>
  );
}
