import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Show success feedback
      setSuccess("Account created successfully! Verify your email.");

      // Navigate after success alert
      setTimeout(() => {
        navigate("/verify-new-user", { state: { email } });
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-6 py-12">
      {/* Alerts */}
      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT SECTION */}
        <div className="space-y-4 max-w-md md:ml-6 mx-auto md:mx-0 flex flex-col justify-center text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-3xl font-semibold mb-4">
            <img src="/logo.svg" alt="gConnect logo" className="w-8 h-8" />
            <span>gConnect</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Where meaningful <br />
            connections <br />
            <span className="text-orange-500">bloom</span>
          </h1>

          <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
            Join a community built on warmth and understanding.
            Start your journey to deeper connections today.
          </p>

          <div className="rounded-xl overflow-hidden max-w-xs mx-auto md:mx-0">
            <img src="/group.png" alt="Community" className="w-full h-44 md:h-52 object-cover" />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full max-w-md mx-auto flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create an account
          </h2>

          {/* Toggle */}
          <div className="flex bg-[#ffe8d6] rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                method === "email" ? "bg-white text-black" : "text-black/70"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                method === "phone" ? "bg-white text-black" : "text-black/70"
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col space-y-4">
            <input
              type={method === "email" ? "email" : "tel"}
              placeholder={method === "email" ? "Email Address" : "Phone Number"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white text-black outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-white hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
