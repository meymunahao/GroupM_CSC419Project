import { X, Download, Share2 } from "lucide-react";

interface MediaViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export default function MediaViewer({ imageUrl, onClose }: MediaViewerProps) {
  return (
    <div className="fixed inset-0 z-100 bg-black/95 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 text-white">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition"
        >
          <X size={28} />
        </button>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <Download size={20} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={imageUrl}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
          alt="Fullscreen view"
        />
      </div>
    </div>
  );
}
