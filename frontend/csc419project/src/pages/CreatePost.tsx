import { Image, Video, Mic, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
const navigate = useNavigate();

return (
    <main className="flex-1 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
    <div className="w-full max-w-xl bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
        {/* Top Right Close Icon */}
        <button
        onClick={() => navigate(-1)}
        className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
        <X size={20} />
        </button>

        {/* Header/User Info */}
        <div className="flex items-center gap-4 mb-6">
        <img
            src="/nimi.png"
            className="w-12 h-12 rounded-full border border-white/10"
            alt="avatar"
        />
        <div>
            <span className="font-bold text-white block">Oluwalonimi</span>
            <span className="text-xs text-gray-500">What is on your mind?</span>
        </div>
        </div>

        {/* Text Input Area */}
        <textarea
        placeholder="Share your thoughts..."
        className="w-full bg-transparent border-none text-white text-lg focus:outline-none resize-none min-h-150px mb-4"
        />

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-4 text-gray-400">
            <button className="hover:text-[#FF5C00] transition-colors">
            <Image size={22} />
            </button>
            <button className="hover:text-[#FF5C00] transition-colors">
            <Video size={22} />
            </button>
            <button className="hover:text-[#FF5C00] transition-colors">
            <Mic size={22} />
            </button>
        </div>

        <div className="flex gap-3">
            <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl text-white font-medium hover:bg-white/5 transition-colors"
            >
            Cancel
            </button>
            <button className="bg-[#FF5C00] px-8 py-2 rounded-xl text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
            Post
            </button>
        </div>
        </div>
    </div>
    </main>
);
}
