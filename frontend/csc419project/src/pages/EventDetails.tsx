import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";

type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    price: string;
    image: string;
    category: string;
    description: string;
};

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
        description:
            "Best of Nigeria's tech ecosystem? Join us as we set the industry's future.\nThis is where we define our tech ecosystem future.",
    },
    {
        id: "2",
        title: "The Music Hangout",
        date: "Fri, Feb 2nd",
        time: "7PM",
        location: "Victoria Island",
        price: "₦25,000",
        image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
        category: "Music",
        description:
            "Experience live music, lights, vibes and energy like never before.",
    },
    
];

export default function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
        return (
            <div className="min-h-screen bg-dark text-white p-6">
                <p>Event not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark text-white p-6">

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white 
             cursor-pointer pointer-events-auto relative z-999"
            >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back to events</span>
            </button>


            {/* Event image */}
            <img
                src={event.image}
                className="w-full h-64 object-cover rounded-xl mb-6"
                alt={event.title}
            />

            {/* Title */}
            <h1 className="text-3xl font-semibold mb-4">{event.title}</h1>

            {/* Details */}
            <div className="space-y-2 text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{event.date}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{event.time}</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{event.location}</span>
                </div>
            </div>

            {/* Price */}
            <p className="text-orange-400 font-semibold mb-6">{event.price}</p>

            {/* About */}
            <h2 className="text-xl font-semibold mb-2">About this event</h2>

            <p className="text-gray-300 whitespace-pre-line mb-8">
                {event.description}
            </p>

            {/* Get Ticket button */}
            <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg"
                onClick={() => console.log("TODO: ticket flow")}
            >
                Get ticket
            </button>
        </div>
    );
}
