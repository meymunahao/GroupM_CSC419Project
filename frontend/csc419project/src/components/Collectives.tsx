interface Collective {
  name: string;
  subtitle: string;
  avatar: string;
}

const collectives: Collective[] = [
  {
    name: "Underrated genius",
    subtitle: "Music_Collective",
    avatar: "/avatar1.jpg",
  },
  {
    name: "Biology",
    subtitle: "Biology_discuss",
    avatar: "/avatar2.jpg",
  },
  {
    name: "Physics",
    subtitle: "Physics_Discuss",
    avatar: "/avatar3.jpg",
  },
];

export default function Collectives() {
  return (
    <aside className="hidden lg:block w-64 mr-12"> {/* Reduced width from w-80 to w-64 and added margin-left */}
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
          {collectives.map((item, index) => (
            <div
              key={index}
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

              <button className="text-orange-500 text-sm font-medium hover:underline">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
