import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  User,
  Users,
  Calendar,
  Menu,
  X,
  LogOut,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  path?: string;
  icon: LucideIcon;
  isNotification?: boolean;
  isMessaging?: boolean;
}

type SidebarProps = {
  isNotificationActive: boolean;
  isMessagingActive: boolean;
  onNotificationClick: () => void;
  onMessagingClick: () => void;
};

export default function Sidebar({
  isNotificationActive,
  isMessagingActive,
  onNotificationClick,
  onMessagingClick,
}: SidebarProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Search", path: "/search", icon: Search },
    { label: "Notification", icon: Bell, isNotification: true },
    { label: "Chats", icon: MessageSquare, isMessaging: true },
    { label: "Collectives", path: "/collectives", icon: Users },
    { label: "Events", path: "/events", icon: Calendar },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear auth tokens)
    navigate("/");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-dark border-b border-white/5 px-4 py-3 flex items-center justify-between z-50">
        <button onClick={() => navigate("/home")}>
          <img src="./logo.svg" alt="gConnect logo" className="w-8 h-8" />
        </button>
        <h2 className="text-xl font-bold text-white">gConnect</h2>
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0f0f0f]
          border-r border-white/10 px-6 py-8 flex flex-col justify-between
          transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div>
          {/* LOGO */}
          <div
            className="mb-8 flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <h2 className="text-2xl font-bold text-white">gConnect</h2>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col space-y-3">
            {navItems.map(
              ({ label, path, icon: Icon, isNotification, isMessaging }) =>
                isNotification ? (
                  <button
                    key={label}
                    onClick={() => {
                      setOpen(false);
                      onNotificationClick();
                    }}
                    className={`flex items-center gap-4 p-3 rounded-xl transition w-full
                    ${
                      isNotificationActive
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-sm tracking-wide">{label}</span>
                  </button>
                ) : isMessaging ? (
                  <button
                    key={label}
                    onClick={() => {
                      setOpen(false);
                      onMessagingClick();
                    }}
                    className={`flex items-center gap-4 p-3 rounded-xl transition w-full
                    ${
                      isMessagingActive
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-sm tracking-wide">{label}</span>
                  </button>
                ) : (
                  <NavLink
                    key={label}
                    to={path!}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 p-3 rounded-xl transition group
                    ${
                      isActive
                        ? "text-white font-medium bg-white/10"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={24}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-gray-200"
                          }
                        />
                        <span className="text-sm tracking-wide">{label}</span>
                      </>
                    )}
                  </NavLink>
                )
            )}

            <Link
              to="/create"
              className="mt-6 w-full bg-[#FF5C00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all text-center block shadow-lg shadow-orange-500/10"
            >
              Create
            </Link>
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 p-3 rounded-xl text-red-500 hover:text-white hover:bg-white/5 transition"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>
    </>
  );
}
