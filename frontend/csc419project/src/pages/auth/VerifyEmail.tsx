import React, { useState, useRef } from "react";
import logo from "../../assets/logo.svg"; // Replace with your logo path
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
const navigate = useNavigate();
  const [code, setCode] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input
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

  const handleVerify = () => {
    const verificationCode = code.join("");
    console.log("Verifying code:", verificationCode);
    // TODO: call your API to verify
    navigate("/home"); // navigate after verification
  };

  const handleResend = () => {
    console.log("Resend code clicked");
    // TODO: call API to resend code
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark px-4">
      {/* Logo & Progress Indicator */}
      <div className="flex flex-col items-center absolute top-0 left-0 w-full pt-6 sm:pt-10">

  {/* Logo and Text */}
  <div className="flex items-center gap-3 mb-6">
    <img src={logo} alt="gConnect Logo" className="w-12 h-12 sm:w-14 sm:h-14" />
    <span className="text-3xl sm:text-4xl font-semibold tracking-wide text-white">gConnect</span>
  </div>

  {/* Progress Indicator */}
  <div className="flex space-x-3">
    <span className="w-10 h-1.5 rounded-full bg-white"></span>
    <span className="w-10 h-1.5 rounded-full bg-orange-500"></span>
    <span className="w-10 h-1.5 rounded-full bg-white"></span>
  </div>
</div>


      {/* Verification Text */}
      <div className="text-center mb-8">
        <h1 className="text-white text-2xl font-semibold mb-2">Verify your email</h1>
        <p className="text-gray-300">
          We’ve sent a verification code to <span className="font-medium text-white">mail@example.com</span>
        </p>
      </div>

      {/* Code Input */}
      <div className="flex gap-3 mb-6">
        {code.map((num, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={num}
            ref={(el) => (inputRefs.current[idx] = el)}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-12 text-center text-lg font-semibold rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 transition-colors text-white py-3 rounded-xl font-semibold mb-4"
      >
        Verify Account
      </button>

      {/* Resend */}
      <p className="text-gray-400">
        Didn’t receive the code?{" "}
        <span onClick={handleResend} className="text-orange-500 font-medium cursor-pointer">
          Resend Code
        </span>
      </p>
    </div>
  );
}