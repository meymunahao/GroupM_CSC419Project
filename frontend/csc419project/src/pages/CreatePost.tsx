import { useState, useRef } from "react";
import { Image, Video, Mic, X, Trash2, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuthHeader, getCurrentUser } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreatePost() {
  const navigate = useNavigate();
  
  // 1. GET LOGGED IN USER DATA
  const currentUser = getCurrentUser();
  const displayName = currentUser?.username || currentUser?.email || "there";
  
  // MATCHING HOMEFEED LOGIC: Use user's avatar url OR hardcoded /nimi.png
  const userAvatar = currentUser?.avatar_url || currentUser?.profile_url || currentUser?.photoUrl || "/nimi.png";

  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: string;
    file: File | Blob;
  } | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMedia({ url, type: file.type, file });
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          setSelectedMedia({ url, type: "audio/webm", file: blob });
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        alert("Microphone access denied or not available.");
      }
    }
  };

  const removeMedia = () => {
    if (selectedMedia) URL.revokeObjectURL(selectedMedia.url);
    setSelectedMedia(null);
  };

  const handleSubmitPost = async () => {
    if (!postText.trim() && !selectedMedia) return;

    try {
      setSubmitting(true);
      // FIX: Explicitly cast authHeaders to avoid Type 2322
      const authHeaders = getAuthHeader() as Record<string, string>;

      const createRes = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          content: postText,
          visibility: "public",
        }),
      });

      const createdPost = await createRes.json();
      if (!createRes.ok) throw new Error(createdPost.error || "Failed to create post");

      const postId = createdPost.id;

      if (selectedMedia && !selectedMedia.type.startsWith("audio/")) {
        const formData = new FormData();
        formData.append("file", selectedMedia.file);

        const mediaRes = await fetch(`${API_BASE_URL}/api/posts/${postId}/media`, {
          method: "POST",
          headers: { ...authHeaders },
          body: formData,
        });

        if (!mediaRes.ok) throw new Error("Media upload failed");
      }

      setPostText("");
      removeMedia();
      navigate(-1);
    } catch (err: any) {
      console.error("Error submitting post", err);
      alert(err.message || "Something went wrong while posting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />

      <div className="w-full max-w-xl bg-[#121212] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
              <img src={userAvatar} alt="profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-white font-bold">Create Post</h2>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Input Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={`What's on your mind, ${displayName}?`}
            className="w-full min-h-30 bg-transparent text-gray-200 text-lg resize-none focus:outline-none placeholder:text-gray-600"
            autoFocus
          />

          {/* Media Previews */}
          {selectedMedia && (
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-white/10 bg-black/20">
              <button onClick={removeMedia} className="absolute top-2 right-2 z-10 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors">
                <Trash2 size={16} />
              </button>
              {selectedMedia.type.startsWith("image/") && <img src={selectedMedia.url} className="w-full h-auto max-h-75 object-contain" alt="preview" />}
              {selectedMedia.type.startsWith("video/") && <video src={selectedMedia.url} controls className="w-full max-h-75" />}
              {selectedMedia.type.startsWith("audio/") && (
                <div className="p-8 flex flex-col items-center gap-3">
                  <Mic className="text-[#FF5C00]" size={32} />
                  <audio src={selectedMedia.url} controls className="w-full h-10" />
                </div>
              )}
            </div>
          )}

          {isRecording && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-500">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-sm font-medium">Recording Audio...</span>
              </div>
              <button onClick={toggleRecording} className="text-red-500 hover:scale-110 transition-transform">
                <Square size={20} fill="currentColor" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#181818]/50 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-6">
            <button onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); } }} className="flex items-center gap-2 text-gray-400 hover:text-[#FF5C00] transition-colors">
              <Image size={20} />
              <span className="hidden sm:inline text-sm font-medium">Photo</span>
            </button>
            <button onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = "video/*"; fileInputRef.current.click(); } }} className="flex items-center gap-2 text-gray-400 hover:text-[#FF5C00] transition-colors">
              <Video size={20} />
              <span className="hidden sm:inline text-sm font-medium">Video</span>
            </button>
            <button onClick={toggleRecording} className={`flex items-center gap-2 transition-colors ${isRecording ? "text-red-500" : "text-gray-400 hover:text-[#FF5C00]"}`}>
              <Mic size={20} />
              <span className="hidden sm:inline text-sm font-medium">Audio</span>
            </button>
          </div>

          <button
            onClick={handleSubmitPost}
            disabled={submitting || (!postText.trim() && !selectedMedia)}
            className="bg-[#FF5C00] text-white px-8 py-2 rounded-xl font-bold disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}