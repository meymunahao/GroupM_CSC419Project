import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

interface LocationState {
  email?: string;
}

interface VerifyEmailResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export default function VerifyNewUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [email] = useState<string>(state?.email || "");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError(null);
    setSuccess(null);

    const otp = code.join("");
    if (otp.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data: VerifyEmailResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Show success alert
      setSuccess("Email verified successfully!");

      // Navigate after alert
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark px-4">
      {/* Alerts */}
      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      {/* Logo & Progress Indicator */}
      <div className="flex flex-col items-center absolute top-0 left-0 w-full pt-6 sm:pt-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="gConnect Logo" className="w-12 h-12 sm:w-14 sm:h-14" />
          <span className="text-3xl sm:text-4xl font-semibold tracking-wide text-white">
            gConnect
          </span>
        </div>

        <div className="flex space-x-3">
          <span className="w-10 h-1.5 rounded-full bg-white"></span>
          <span className="w-10 h-1.5 rounded-full bg-orange-500"></span>
          <span className="w-10 h-1.5 rounded-full bg-white"></span>
        </div>
      </div>

      {/* Verification Text */}
      <div className="text-center mb-8 mt-32">
        <h1 className="text-white text-2xl font-semibold mb-2">
          Verify your email
        </h1>
        <p className="text-gray-300">
          We’ve sent a verification code to{" "}
          <span className="font-medium text-white">
            {email || "your email"}
          </span>
        </p>
      </div>

      {/* Code Input */}
      <div className="flex gap-3 mb-6">
        {code.map((_, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={code[idx]}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-12 text-center text-lg font-semibold rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 transition-colors text-white py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : "Verify Account"}
      </button>
    </div>
  );
}
