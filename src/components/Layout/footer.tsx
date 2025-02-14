import { Compass, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PiStudent } from "react-icons/pi";

export function Footer() {
  const location = useLocation();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-neutral-300 dark:bg-gray-900 text-black dark:text-white backdrop-blur-lg 
        border-t border-gray-800 z-40"
    >
      <div className="flex justify-around items-center h-12 max-w-4xl mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-lg
              transition-colors ${
                location.pathname === "/"
                  ? "text-primary"
                  : "dark:text-gray-400 text-slate-500 dark:hover:text-gray-500 hover:text-black"
              }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </Link>

        <Link
          to="/playground"
          className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-lg
              transition-colors ${
                location.pathname === "/playground"
                  ? "text-primary"
                  : "dark:text-gray-400 text-slate-500 dark:hover:text-gray-500 hover:text-black"
              }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px]">Playground</span>
        </Link>
        <Link
          to="/test"
          className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-lg
              transition-colors ${
                location.pathname === "/test"
                  ? "text-primary"
                  : "dark:text-gray-400 text-slate-500 dark:hover:text-gray-500 hover:text-black"
              }`}
        >
          <PiStudent className="w-5 h-5" />
          <span className="text-[10px]">Test</span>
        </Link>
      </div>
    </nav>
  );
}
