import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState("email");

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SECTION */}
        <div className="space-y-4 max-w-md ml-6">
  <div className="flex items-center gap-2 text-3xl font-semibold ml-8">
  <img
    src="/logo.svg"
    alt="gConnect logo"
    className="w-8 h-8 object-contain"
  />
  <span>gConnect</span>
</div>

  <h1 className="text-3xl font-bold leading-snug">
    Where meaningful <br />
    connections <br />
    <span className="text-orange-500">bloom</span>
  </h1>

  <p className="text-gray-400 text-sm max-w-xs">
    Join a community built on warmth and understanding.
    Start your journey to deeper connections today.
  </p>

  <div className="rounded-xl overflow-hidden max-w-xs">
    <img
      src="/group.png"
      alt="Community"
      className="w-full h-44 object-cover"
    />
  </div>
</div>


        {/* RIGHT SECTION */}
        <div className="bg-transparent w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome back</h2>

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

          {/* Forgot Password */}
            <p className="text-right text-gray-400 text-sm mb-2">
             <Link to="/forgot-password" className="hover:underline">
             Forgot Password?
            </Link>
            </p>

          {/* Login Button */}
          <Link to="/home">
          <button className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold mb-4">
            Log In
          </button>
            </Link>

          {/* Signup */}
          <p className="text-center text-gray-400 mb-6">
            Don’t have an account?{" "}
            <Link to="/signup">
            <span className="text-white hover:underline cursor-pointer">
              Sign Up
            </span>
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <span className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm">OR</span>
            <span className="flex-1 h-px bg-gray-700" />
          </div>

          {/* OAuth */}
          <button className="w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 mb-3">
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Log In with Google
          </button>

          <button className="w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2">
            <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
            Log In with Apple
          </button>
        </div>
      </div>
    </div>
  );
}
