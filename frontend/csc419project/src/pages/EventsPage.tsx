import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  category: string;
};

const categories = [
  "Arts",
  "Technology",
  "Music",
  "Religion",
  "Sports",
  "Food and drinks",
];

const mockEvents: Event[] = [
  {
    id: "1",
    title: "The Lets make an app party",
    date: "Sun, Jan 24th",
    time: "2PM",
    location: "Road 12345, marinopa street",
    price: "₦50,000",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    category: "Arts",
  },
  {
    id: "2",
    title: "The Lets make an app party",
    date: "Sun, Jan 24th",
    time: "2PM",
    location: "Road 12345, marinopa street",
    price: "₦50,000",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    category: "Arts",
  },
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Arts");

  const filteredEvents = mockEvents.filter(
    (event) => event.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-dark text-white px-6 py-6">

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6">Find Events</h1>

      {/* Category pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-4 py-1 rounded-md text-sm
              ${selectedCategory === cat
                ? "bg-white/10 text-white"
                : "bg-transparent text-gray-400 hover:text-white"}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="border border-white/10 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold mb-2">{event.title}</h2>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar size={16} />
                <p>
                  {event.date}, {event.time}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                <MapPin size={16} />
                <p>{event.location}</p>
              </div>

              <p className="text-orange-400 font-semibold mt-3">{event.price}</p>
            </div>

            <img
              src={event.image}
              className="w-28 h-28 object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
