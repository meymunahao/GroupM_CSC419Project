import { useState, useEffect } from 'react';
import { ChevronDown, Camera } from 'lucide-react';

export default function Settings() {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    gender: 'Female', // Note: Check if your backend supports Gender/Username updates
    bio: '',
    privacySetting: 'PUBLIC', // Matches Screenshot (517) options: PUBLIC/PRIVATE
    photoUrl: ''
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch current profile data on mount - Based on Screenshot (514)
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            ...formData,
            bio: data.bio || '',
            privacySetting: data.privacy || 'PUBLIC',
            photoUrl: data.photoUrl || ''
          });
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacySelect = (option: string) => {
    setFormData(prev => ({ ...prev, privacySetting: option.toUpperCase() }));
    setIsDropdownOpen(false);
  };

  // Handle Photo Update - Based on Screenshot (516)
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const token = localStorage.getItem("token");
      const file = e.target.files[0];
      const data = new FormData();
      data.append("photo", file);

      try {
        const res = await fetch("http://localhost:5000/api/profile/photo", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: data
        });
        if (res.ok) {
          // Refresh photo preview locally
          setFormData(prev => ({ ...prev, photoUrl: URL.createObjectURL(file) }));
        }
      } catch (err) {
        console.error("Photo upload failed", err);
      }
    }
  };

  // Save Bio and Privacy - Based on Screenshot (517)
  const handleSaveChanges = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/profile/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          bio: formData.bio,
          privacy: formData.privacySetting
        }),
      });

      if (res.ok) {
        alert("Settings updated successfully!");
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-h-screen text-white p-10 md:p-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold mb-12">Settings</h1>

        {/* Profile Header with Photo Upload */}
        <div className="flex items-center gap-5 mb-12">
          <div className="relative group w-16 h-16 rounded-full overflow-hidden">
             <img 
              src={formData.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera size={20} />
              <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-medium">{formData.name || "User"}</h2>
            <p className="text-gray-500">Profile Settings</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8 mb-16">
          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <label className="text-gray-300">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-md h-13 px-4 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-gray-300">Privacy setting</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#1b1c1d] border border-[#272727] rounded-md h-13 px-4 flex items-center justify-between"
                >
                  <span className="text-white uppercase">{formData.privacySetting}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1b1c1d] border border-[#272727] rounded-md z-20">
                    {['Public', 'Private'].map((opt) => (
                      <div 
                        key={opt}
                        onClick={() => handlePrivacySelect(opt)}
                        className="px-4 py-3 hover:bg-[#272727] cursor-pointer"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8 flex flex-col">
            <div className="flex flex-col gap-3">
              <label className="text-gray-300">User Name</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-md h-13 px-4 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3 grow">
              <label className="text-gray-300">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-md p-4 focus:outline-none resize-none h-full min-h-40"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSaveChanges}
          disabled={loading}
          className="bg-[#3B2217] hover:bg-[#4d2d1e] text-[#F3641F] font-medium px-10 py-3 rounded-md transition-colors"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}