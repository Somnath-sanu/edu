import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const Navbar = ({
  handleLogoClick,
}: {
  handleLogoClick: (e: React.MouseEvent) => void;
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="">
      <header className="fixed top-0 left-0 right-0 bg-neutral-300 dark:bg-gray-900 text-black dark:text-white backdrop-blur-lg z-40 flex justify-between gap-4 items-center flex-1 px-4 border-b border-gray-800 dark:border-slate-700">
        <div className="flex justify-center items-center h-14 px-4">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                <path
                  fill="currentColor"
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <span className="text-xl font-bold dark:text-white text-black">
              educasm
            </span>
          </a>
        </div>
        <div
          className="px-4 cursor-pointer"
          onClick={toggleTheme}
          title="toggleTheme"
        >
          {theme === "dark" ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-800" />
          )}
        </div>
      </header>
    </nav>
  );
};
