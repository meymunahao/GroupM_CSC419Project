import { useState, useEffect } from 'react';
import { ChevronDown, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    github: '',
    privacy: 'PUBLIC'
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://redesigned-giggle.onrender.com/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            username: data.user?.username || '', 
            bio: data.bio || '',
            github: data.links?.github || '',
            privacy: data.privacy || 'PUBLIC'
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacySelect = (option: string) => {
    setFormData(prev => ({ ...prev, privacy: option.toUpperCase() }));
    setIsDropdownOpen(false);
  };

  const handleSaveChanges = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        bio: formData.bio,
        links: { github: formData.github },
        privacy: formData.privacy
      };

      const res = await fetch("https://redesigned-giggle.onrender.com/api/profile/", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/profile"); 
      } else {
        const result = await res.json();
        alert(`Error: ${result.message || "Update failed"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-h-screen text-white p-6 md:p-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold mb-12">Settings</h1>

        {/* Simplified Header without Image */}
        <div className="mb-12 border-b border-gray-800 pb-8">
          <h2 className="text-2xl font-medium text-orange-500">{formData.username || "User"}</h2>
          <p className="text-gray-500">Edit your account details and privacy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8 mb-16">
          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <label className="text-gray-300 text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-xl h-14 px-4 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter display name"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-gray-300 text-sm font-medium">Privacy setting</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#1b1c1d] border border-[#272727] rounded-xl h-14 px-4 flex items-center justify-between z-10"
                >
                  <span className="text-white uppercase font-bold text-xs tracking-wider">{formData.privacy}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b1c1d] border border-[#272727] rounded-xl z-50 shadow-2xl overflow-hidden">
                    {['Public', 'Private'].map((opt) => (
                      <div 
                        key={opt}
                        onClick={() => handlePrivacySelect(opt)}
                        className="px-4 py-4 hover:bg-[#272727] cursor-pointer text-sm transition-colors"
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
              <label className="text-gray-300 text-sm font-medium">GitHub Link</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  className="w-full bg-[#1b1c1d] border border-[#272727] rounded-xl h-14 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="https://github.com/username"
                />
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-3 grow">
              <label className="text-gray-300 text-sm font-medium">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-xl p-4 focus:outline-none focus:border-orange-500 resize-none h-32 transition-colors"
                placeholder="Write a short bio..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pb-20"> 
          <button 
            type="button"
            onClick={handleSaveChanges}
            disabled={loading}
            className="bg-[#F3641F] hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate("/profile")}
            className="text-gray-500 hover:text-white font-medium px-6 py-4 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}