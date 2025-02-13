import React from "react";
import { useNavigate } from "react-router-dom";

import { Navbar } from "./Navbar";
import { Footer } from "./footer";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/", { replace: true });
    window.dispatchEvent(new CustomEvent("resetExplore"));
  };

  return (
    <div className="min-h-screen  flex flex-col bg-neutral-300 dark:bg-gray-900 text-black dark:text-white">
      <Navbar handleLogoClick={handleLogoClick} />

      <main className="flex-1 mt-14 mb-[5.5rem] bg-neutral-300 dark:bg-gray-900 text-black dark:text-white">
        <div className="max-w-4xl mx-auto px-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
