import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#06060a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
