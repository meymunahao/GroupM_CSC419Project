import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import logo from "../../assets/logo.svg";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

interface ForgotPasswordResponse {
  message?: string;
  error?: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: ForgotPasswordResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      // Show success alert
      setSuccess(data.message || "Password reset email sent!");

      // Navigate to verify-email after short delay
      setTimeout(() => {
        navigate("/verify-email", { state: { email } });
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#161616] px-4 sm:px-6 lg:px-8">
      {/* Alerts */}
      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      {/* Top Section: Back Arrow + Logo & Progress Indicator */}
      <div className="flex flex-col items-center mt-6 sm:mt-10 relative">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 mt-2 sm:mt-2 p-2 text-white hover:text-orange-500"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Logo and Text */}
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="gConnect Logo" className="w-12 h-12 sm:w-14 sm:h-14" />
          <span className="text-3xl sm:text-4xl font-semibold tracking-wide text-white">
            gConnect
          </span>
        </div>

        {/* Progress Indicator */}
        <div className="flex space-x-3">
          <span className="w-10 h-1.5 rounded-full bg-orange-500" />
          <span className="w-10 h-1.5 rounded-full bg-white" />
          <span className="w-10 h-1.5 rounded-full bg-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center mt-8 sm:mt-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-center text-white">
            Forgot your Password
          </h1>

          <form onSubmit={handleReset} className="flex flex-col space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition py-3 rounded-lg font-medium text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
