import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User } from "lucide-react";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
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
      // 1. Create Profile - Based on Screenshot (513).jpg
      const profileRes = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ bio, privacy: "PUBLIC" }), 
      });

      if (!profileRes.ok) throw new Error("Profile creation failed");

      // 2. Upload Photo - Based on Screenshot (516).jpg
      if (avatar) {
        const formData = new FormData();
        formData.append("photo", avatar);
        await fetch("http://localhost:5000/api/profile/photo", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });
      }

      navigate("/new-user");
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

      <main className="flex-1 flex flex-col items-center w-full px-4">
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
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-2xl px-5 py-3.5 outline-none"
              required
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white text-gray-900 rounded-2xl px-5 py-3.5 resize-none outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 py-3.5 rounded-full text-white font-bold"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}