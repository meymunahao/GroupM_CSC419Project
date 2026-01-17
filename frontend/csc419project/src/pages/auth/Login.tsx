import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";

type AuthMethod = "email" | "phone";

interface LoginResponse {
  token?: string;
  accessToken?: string;
  message?: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [method, setMethod] = useState<AuthMethod>("email");

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    setError("");
    setLoading(true);

    try {
      // 1. Authenticate with the server
      const res = await fetch("https://redesigned-giggle.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: method === "email" ? email : undefined,
          phone: method === "phone" ? phone : undefined,
          password,
        }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Login failed: ${res.status}`);
      }

      // 2. Extract and Save Token
      // We use "token" to match your getAuthHeader() utility
      const token = data.token || data.accessToken;
      if (!token) {
        throw new Error("No token received. Check backend response structure.");
      }
      localStorage.setItem("token", token);

      // 3. Check Profile Status
      // This determines if we go to /home or /profile-setup
      try {
        const profileRes = await fetch("https://redesigned-giggle.onrender.com/api/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (profileRes.status === 404) {
          // User exists but has no profile details yet
          navigate("/profile-setup");
        } else {
          // Profile exists or server error - proceed to main feed
          navigate("/home");
        }
      } catch (profileErr) {
        console.error("Error fetching profile:", profileErr);
        // Fallback to home if the profile check fails technically
        navigate("/home");
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SECTION */}
        <div className="space-y-4 max-w-md md:ml-6 mx-auto md:mx-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-3xl font-semibold mb-4">
            <img src="/logo.svg" alt="gConnect logo" className="w-8 h-8" />
            <span>gConnect</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Where meaningful <br />
            connections <br />
            <span className="text-orange-500">bloom</span>
          </h1>

          <p className="text-gray-400 text-sm max-w-xs">
            Join a community built on warmth and understanding.
          </p>

          <img
            src="/group.png"
            alt="Community"
            className="w-full max-w-xs rounded-xl"
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome back</h2>

          {/* Toggle Email/Phone */}
          <div className="flex bg-[#ffe8d6] rounded-xl p-1 mb-6">
            {(["email", "phone"] as AuthMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  method === m ? "bg-white text-black" : "text-black/70"
                }`}
              >
                {m === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>

          {/* Input Fields */}
          {method === "email" ? (
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-orange-500"
            />
          ) : (
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          {/* Password Field */}
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-right text-gray-400 text-sm mb-3">
            {/* data-attribute used here to avoid non-boolean prop warning */}
            <Link to="/forgot-password" data-university-link="true" className="hover:underline">
              Forgot Password?
            </Link>
          </p>

          {/* Error Message Display */}
          {error && <ErrorAlert message={error} />}

          {/* Action Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold mb-4 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>

          <p className="text-center text-gray-400 mb-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-white hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}