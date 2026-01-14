import { useState } from 'react';
import { ChevronDown, Link2, Trash2 } from 'lucide-react';

export default function Settings() {
  const [formData, setFormData] = useState({
    name: 'Alexa Rawles',
    userName: '@alexarawles',
    gender: 'Female',
    bio: '',
    privacySetting: 'Select privacy setting'
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacySelect = (option: string) => {
    setFormData(prev => ({ ...prev, privacySetting: option }));
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-dark min-h-screen text-white p-10 md:p-20">
      <div className="max-w-5xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl font-semibold mb-12 font-['Inter',sans-serif]">
          Settings
        </h1>

        {/* Profile Section */}
        <div className="flex items-center gap-5 mb-12">
          <div className="w-16 h-16 rounded-full overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-medium font-['Poppins',sans-serif]">Alexa Rawles</h2>
            <p className="text-gray-500 font-['Poppins',sans-serif]">alexarawles@gmail.com</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8 mb-16">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <label className="text-gray-300 font-['Poppins',sans-serif]">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-md h-13 px-4 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-gray-300 font-['Poppins',sans-serif]">Gender</label>
              <input
                type="text"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-md h-13 px-4 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-gray-300 font-['Poppins',sans-serif]">Privacy setting</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#1b1c1d] border border-[#272727] rounded-md h-13 px-4 flex items-center justify-between focus:outline-none focus:border-gray-500"
                >
                  <span className={formData.privacySetting.includes('Select') ? 'text-gray-500' : 'text-white'}>
                    {formData.privacySetting}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1b1c1d] border border-[#272727] rounded-md overflow-hidden z-20">
                    {['Public', 'Private', 'Friends'].map((opt) => (
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

          {/* Right Column */}
          <div className="space-y-8 flex flex-col">
            <div className="flex flex-col gap-3">
              <label className="text-gray-300 font-['Poppins',sans-serif]">User Name</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-md h-13 px-4 focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3 grow">
              <label className="text-gray-300 font-['Poppins',sans-serif]">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-[#1b1c1d] border border-[#272727] rounded-md p-4 focus:outline-none focus:border-gray-500 transition-colors resize-none h-full min-h-40"
              />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 font-['Inter',sans-serif]">Theme</h2>
          <div className="relative group rounded-2xl overflow-hidden aspect-16/5 bg-[#222]">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
              alt="Theme background" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Floating Buttons */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              <button className="p-2 bg-[#1b1c1d]/80 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
                <Link2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-[#1b1c1d]/80 rounded-full hover:bg-red-500/20 transition-all backdrop-blur-sm border border-white/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="bg-[#3B2217] hover:bg-[#4d2d1e] text-[#F3641F] font-medium px-10 py-3 rounded-md transition-colors font-['Poppins',sans-serif]">
          Save changes
        </button>
      </div>
    </div>
  );
}