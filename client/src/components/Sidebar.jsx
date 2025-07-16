import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Moon, Sun, LogOut, User, LogIn } from "lucide-react";
import '../index.css'
import useAuthStore from "../store/authStore.js";

const navItems = [
  { name: "Dashboard", to: "/dashboard", icon: DashboardIcon },
  { name: "Projects", to: "/projects", icon: ProjectsIcon },
  { name: "Tasks", to: "/tasks", icon: TasksIcon },
  { name: "Chat", to: "/chat", icon: ChatIcon },
  { name: "Team", to: "/team", icon: TeamIcon },
  { name: "WhiteBoard", to: "/whiteboard", icon: TeamIcon },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const logout = useAuthStore((state) => state.logout)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    console.log(useAuthStore.getState().user)
  },[])

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
    
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };  

  const handleLogout = async () => {
    logout();
  }

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-full fixed top-0 left-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            SC
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              SynCora
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          {collapsed ? <RightArrowIcon /> : <LeftArrowIcon />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors space-x-3 ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {!collapsed && <span className="sidebar-text">{name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t dark:border-gray-700">
        <button
          className="flex items-center space-x-3 p-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          
            {
              useAuthStore.getState().user?.user?.avatar ? <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium"> <img src={useAuthStore.getState().user?.user?.avatar} alt="" /></div> : <User className="text-white"/>
            } 
          
          {!collapsed && (
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {useAuthStore.getState().user?.user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {useAuthStore.getState().user?.user?.email|| "Email"}
              </span>
            </div>
          )}
        </button>

        <button
          onClick={toggleDarkMode}
          className="mt-2 w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        <button
          onClick={handleLogout}
          className="mt-2 w-full cursor-pointer flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
        >
          {isAuthenticated ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" /> 
          }{!collapsed && (isAuthenticated ? <span>Logout</span>:<span>Login</span>  )}
        </button>
      </div>
    </aside>
  );
}

function LeftArrowIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-600 dark:text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );
}

function RightArrowIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-600 dark:text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  );
}

// Example dummy icons for now
function DashboardIcon(props) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>;
}

function ProjectsIcon(props) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5M14 5v14" /></svg>;
}

function TasksIcon(props) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6v14H9z" /></svg>;
}

function ChatIcon(props) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function TeamIcon(props) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6 0v-1a6 6 0 00-9-5.197" /></svg>;
}
