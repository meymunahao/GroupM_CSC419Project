import Sidebar from "../components/Sidebar"; 
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    // 'h-screen' and 'overflow-hidden' locks the window scroll so only Main scrolls
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
      
      {/* Sidebar Wrapper */}
      <div className="shrink-0 h-full z-20">
        <Sidebar />
      </div>

      {/* Main Scrollable Area */}
      {/* 'justify-center' horizontally centers the child content */}
      <main className="flex-1 overflow-y-auto flex justify-center w-full relative">
        
        {/* Content Container */}
        {/* Added 'md:ml-20' to push the content container to the right on desktop */}
        <div className="w-full max-w-4xl pt-4 md:pt-6 px-4 pb-20 md:ml-50">
          <Outlet />
        </div>

      </main>
    </div>
  );
}