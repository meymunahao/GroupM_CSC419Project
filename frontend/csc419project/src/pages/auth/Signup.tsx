import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState("email");

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT SECTION */}
        <div className="space-y-4 max-w-md md:ml-6 mx-auto md:mx-0 flex flex-col justify-center text-center md:text-left">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-3xl font-semibold mb-4">
            <img
              src="/logo.svg"
              alt="gConnect logo"
              className="w-8 h-8 object-contain"
            />
            <span>gConnect</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Where meaningful <br />
            connections <br />
            <span className="text-orange-500">bloom</span>
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
            Join a community built on warmth and understanding.
            Start your journey to deeper connections today.
          </p>

          {/* Community Image */}
          <div className="rounded-xl overflow-hidden max-w-xs mx-auto md:mx-0">
            <img
              src="/group.png"
              alt="Community"
              className="w-full h-44 md:h-52 object-cover"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-transparent w-full max-w-md mx-auto flex flex-col justify-center h-full">
          {/* Create Account */}
          <h2 className="text-3xl font-bold mb-6 text-center md:text-center">
            Create an account
          </h2>

          {/* Toggle */}
          <div className="flex bg-[#ffe8d6] rounded-xl p-1 mb-6">
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                method === "email"
                  ? "bg-white text-black"
                  : "text-black/70"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                method === "phone"
                  ? "bg-white text-black"
                  : "text-black/70"
              }`}
            >
              Phone
            </button>
          </div>

          {/* Email / Phone Input */}
          <input
            type={method === "email" ? "email" : "tel"}
            placeholder={method === "email" ? "Email Address" : "Phone Number"}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white text-black outline-none"
          />

          {/* Password */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Sign Up Button */}
          <Link to="/post-signup">
            <button className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold mb-4">
              Sign Up
            </button>
          </Link>

          {/* Login */}
          <p className="text-center md:text-center text-gray-400 mb-6">
            Already have an account?{" "}
            <Link to="/">
              <span className="text-white hover:underline cursor-pointer">
                Log In
              </span>
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <span className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm">OR</span>
            <span className="flex-1 h-px bg-gray-700" />
          </div>

          {/* OAuth Buttons */}
          <button className="w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 mb-3">
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Sign Up with Google
          </button>


          <p className="text-center md:text-center text-gray-500 text-xs mt-2">
            By continuing, you agree to our <br />
            Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
