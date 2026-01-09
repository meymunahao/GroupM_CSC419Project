import Sidebar from "../components/Sidebar";
import Collectives from "../components/Collectives";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-dark text-white flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-6 pt-20 md:pt-10 max-w-3xl mx-auto md:mr-4">
        <Outlet />
      </main>


      {/* Right Panel */}
      <Collectives />
    </div>
  );
}
