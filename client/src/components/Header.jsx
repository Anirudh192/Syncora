import { Link, useLocation } from "react-router-dom";
import { Menu, Search, LogOut, LogIn, User, Bell } from "lucide-react";
import useAuthStore from "../store/authStore.js";
import { useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log("The user is authenticated: ", isAuthenticated)
  },[isAuthenticated])

  const pageTitle = location.pathname.split("/")[1] || "Dashboard";

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2.75 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center space-x-6">

          <div className="flex gap-2">
            {/* User Icon */}
            <button className="cursor-pointer">
              {user?.avatar ? (
                <img
                  src={`${user?.avatar}`}
                  className="w-6 h-6 rounded-xl"
                  alt=""
                />
              ) : (
                <User className="w-6 h-6 text-gray-600 dark:text-white" />
              )}
            </button>

            <Link to={"/login"}>
              <button className="cursor-pointer">
                {isAuthenticated ? (
                  <LogOut color="#ffffff" className="mt-1.5" />
                ) : (
                  <LogIn color="#ffffff" className="mt-1.5" />
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
