import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User } from "lucide-react";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/new-user");
  };

  return (
    <div className="h-screen w-full bg-[#121212] font-sans text-white flex flex-col overflow-hidden">
      {/* Header / Logo */}
      <header className="px-8 py-6 flex items-center gap-2 shrink-0">
        <img src="/logo.svg" alt="gConnect Logo" className="w-6 h-6 object-contain" />
        <span className="text-xl font-bold tracking-tight">gConnect</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full px-4 min-h-0">
        <div className="w-full max-w-2xl flex flex-col items-center h-full">
          {/* Progress & Title */}
          <div className="shrink-0 w-full flex flex-col items-center mb-6">
            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <p className="text-gray-500 text-xs font-medium">Step 2 of 2</p>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-orange-500"></div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed text-center">
              Add a photo and tell us a little about yourself so friends can find you.
            </p>

            {/* Avatar Upload */}
            <div className="flex justify-center mb-6">
              <label className="relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-[#121212] shadow-sm relative z-10">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-black" size={44} strokeWidth={1.5} />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1 z-20">
                  <div className="bg-orange-500 p-1.5 rounded-full border-4 border-[#121212]">
                    <Plus className="text-white" size={18} />
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-4 w-full max-w-sm">
            {/* Full Name */}
            <div>
              <label className="text-sm font-bold text-gray-200 mb-1.5 block ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-bold text-gray-200 mb-1.5 block ml-1">
                Bio
              </label>
              <textarea
                placeholder="I love hiking, coffee, and exploring new places..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 rounded-2xl px-5 py-3.5 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Create Profile Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 transition-colors py-3.5 rounded-full text-white font-bold text-lg shadow-lg shadow-orange-500/20"
            >
              Create Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
