import React from "react";
import { SearchBar } from "./SearchBar";

interface InitialSearchViewProps {
  handleSearch: (query: string) => void;
  type: "explore" | "practice";
}

export const InitialSearchView: React.FC<InitialSearchViewProps> = ({
  handleSearch,
  type,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        What do you want to {type}?
      </h1>

      <div className="w-full max-w-xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Enter what you want to practice..."
          centered={true}
          className="bg-gray-900/80"
        />

        <p className="text-sm dark:text-gray-400 text-black font-bold text-center mt-1">
          Press Enter to search
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span className="text-sm dark:text-gray-400 text-black font-semibold">
            Try:
          </span>
          <button
            onClick={() => handleSearch("Quantum Physics")}
            className="px-3 py-1.5 rounded-lg dark:bg-purple-500/20 hover:bg-purple-500/30 
              border border-purple-500/30 transition-colors text-xs sm:text-sm text-purple-300 bg-black/70 hover:text-white"
          >
            ⚛️ Quantum Physics
          </button>
          <button
            onClick={() => handleSearch("Machine Learning")}
            className="px-3 py-1.5 rounded-lg dark:bg-blue-500/20 hover:bg-blue-500/30 
              border border-blue-500/30 bg-black/70 transition-colors text-xs sm:text-sm text-blue-300 hover:text-white"
          >
            🤖 Machine Learning
          </button>
          <button
            onClick={() => handleSearch("World History")}
            className="px-3 py-1.5 rounded-lg dark:bg-green-500/20 hover:bg-green-500/30 
              border border-green-500/30 bg-black/70 transition-colors text-xs sm:text-sm text-green-300 hover:text-white"
          >
            🌍 World History
          </button>
        </div>
      </div>
    </div>
  );
};
