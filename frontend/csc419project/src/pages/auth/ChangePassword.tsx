import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

interface LocationState {
  email?: string;
}

interface ResetPasswordResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const email = state?.email || "";

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("No email found. Please restart the reset process.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data: ResetPasswordResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(data.message || "Password changed successfully!");

      // Redirect to home after short delay
      setTimeout(() => navigate("/home"), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col px-6">
      {/* Alerts */}
      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

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

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Change Your Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* New Password */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none pr-12"
                required
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
                required
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
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
