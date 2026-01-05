import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Simulate password change
    setIsChanged(true);
    setTimeout(() => navigate("/home"), 2000);
  };

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col px-6">
      {/* Top Section: Logo & Progress */}
      <div className="w-full max-w-md mx-auto mt-8 mb-12 flex flex-col items-center">
        <div className="flex items-center gap-2 text-3xl font-semibold mb-4">
          <img src={logo} alt="gConnect logo" className="w-8 h-8 object-contain" />
          <span>gConnect</span>
        </div>

        {/* Progress Indicator */}
  <div className="flex space-x-3">
    <span className="w-10 h-1.5 rounded-full bg-white"></span>
    <span className="w-10 h-1.5 rounded-full bg-white"></span>
    <span className="w-10 h-1.5 rounded-full bg-orange-500"></span>
  </div>
</div>

      {/* Form Section - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Change Your Password</h2>

          {!isChanged ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold"
              >
                Change Password
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-500 mb-4">Password changed successfully!</p>
              <p>Redirecting to home page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
