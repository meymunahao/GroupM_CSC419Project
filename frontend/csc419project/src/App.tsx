import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ChangePassword from "./pages/auth/ChangePassword";
import ProfileSetup from "./pages/auth/ProfileSetup";
import NewUser from "./pages/user-profiles/NewUser";
import PostSignup from "./pages/auth/PostSignup";
import ProfileLayout from "./layouts/ProfileLayout";
import UserProfile from "./pages/user-profiles/Profile";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/post-signup" element={<PostSignup />} />

      {/* User Profiles */}
      <Route element={<ProfileLayout />}>
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* App */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/new-user" element={<NewUser />} />
      </Route>
    </Routes>
  );
}
