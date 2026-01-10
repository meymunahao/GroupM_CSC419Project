import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  User,
  Menu,
  X,
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
  onNotificationClick: () => void;
  onMessagingClick: () => void; 
};

export default function Sidebar({ onNotificationClick, onMessagingClick }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Search", path: "/search", icon: Search },
    {
      label: "Notification",
      icon: Bell,
      isNotification: true,
    },
    {
      label: "Chats",
      icon: MessageSquare,
      isMessaging: true, 
    },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-dark border-b border-white/5 px-4 py-3 flex items-center justify-between z-50">
        <h1 className="text-xl font-bold">Logo</h1>
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
          border-r border-white/10 px-6 py-8 flex flex-col
          transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* LOGO */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Logo</h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-3">
          {navItems.map(({ label, path, icon: Icon, isNotification, isMessaging }) =>
            isNotification ? (
              <button
                key={label}
                onClick={() => {
                  setOpen(false);
                  onNotificationClick();
                }}
                className="flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 transition w-full"
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
                className="flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 transition w-full"
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
                      ? "text-white font-medium"
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

          <button className="w-full bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-3 rounded-xl">
            Create
          </button>
        </nav>
      </aside>
    </>
  );
}