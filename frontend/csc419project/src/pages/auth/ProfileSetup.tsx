import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, Github } from "lucide-react"; // Added Github icon

export default function ProfileSetup() {
  const navigate = useNavigate();
  // Updated state variables
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAvatar(e.target.files[0]);
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Create Profile with the new schema
      const profileRes = await fetch("https://redesigned-giggle.onrender.com/api/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          username, 
          bio, 
          privacy: "PUBLIC", // Automatically set to PUBLIC
          links: {
            github: githubLink
          }
        }), 
      });

      if (!profileRes.ok) throw new Error("Profile creation failed");

      // 2. Upload Photo (remains the same)
      if (avatar) {
        const formData = new FormData();
        formData.append("photo", avatar);
        await fetch("https://redesigned-giggle.onrender.com/api/profile/photo", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
      }

      navigate("/post-signup");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#121212] text-white flex flex-col overflow-hidden">
      <header className="px-8 py-6 flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
        <span className="text-xl font-bold">gConnect</span>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-4 overflow-y-auto pb-10">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="w-full max-w-sm mb-6 flex flex-col items-center">
            <div className="w-full h-1 bg-gray-800 rounded-full mb-4">
              <div className="w-full h-full bg-orange-500"></div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
            
            <label className="relative cursor-pointer group mb-6">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-[#121212]">
                {avatar ? (
                  <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <User className="text-black" size={44} />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full border-4 border-[#121212]">
                <Plus className="text-white" size={18} />
              </div>
            </label>
          </div>

          <form onSubmit={handleContinue} className="space-y-4 w-full max-w-sm">
            {/* Username Input */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-2xl px-5 py-3.5 outline-none"
              required
            />

            {/* Bio Input */}
            <textarea
              placeholder="Bio (e.g. Backend developer and I love food)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white text-gray-900 rounded-2xl px-5 py-3.5 resize-none outline-none"
            />

            {/* Links Section */}
            <div className="relative">
              <input
                type="url"
                placeholder="GitHub Profile URL"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-2xl px-5 py-3.5 pl-12 outline-none"
              />
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 py-3.5 rounded-full text-white font-bold hover:bg-orange-600 transition-colors"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-2">
              Your profile will be set to <strong>Public</strong> by default.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}