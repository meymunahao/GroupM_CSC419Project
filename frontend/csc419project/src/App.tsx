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
import VerifyNewUser from "./pages/auth/VerifyNewUser";
// import PostDetails from "./components/Feed/PostDetails";
import FriendsPage from "./pages/SearchPage";
import CreatePost from "./pages/CreatePost";
import MainLayout from "./layouts/MainLayout";
import Comments from "./components/Feed/PostDetails";
import EventsPage from "./pages/EventsPage";
import GeneralLayout from "./layouts/generalLayout";
import MessageLayout from "./layouts/MessageLayout";
import EventDetails from "./pages/EventDetails";
import Settings from "./pages/user-profiles/Settings";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-new-user" element={<VerifyNewUser />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/post-signup" element={<PostSignup />} />

      {/* User Profiles */}
      <Route element={<ProfileLayout />}>
        <Route path="/profile" element={<UserProfile />} />
      </Route>

       <Route path="/chats" element={<MessageLayout />} />


      <Route element={<GeneralLayout />}>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/new-user" element={<NewUser />} />
      </Route>

      {/* App */}
      <Route element={<AppLayout />}>
        <Route path="/search" element={<FriendsPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/comments" element={<Comments />} />
      </Route>

     
    </Routes>
  );
}
