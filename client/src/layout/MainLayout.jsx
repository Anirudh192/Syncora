import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import '../index.css'

export default function MainLayout() {

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="px-6 py-4 h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
