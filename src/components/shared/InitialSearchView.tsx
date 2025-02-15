import React from "react";
import { SearchBar } from "./SearchBar";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getColorClasses } from "../../utils";
import { SelectLanguage } from "./SelectLanguage";

interface InitialSearchViewProps {
  handleSearch: (query: string) => void;
  type: "explore" | "practice";
}

export const InitialSearchView: React.FC<InitialSearchViewProps> = ({
  handleSearch,
  type,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage(
    "userLanguage",
    "english"
  );

  const suggestions = {
    english: [
      { text: "Quantum Physics", icon: "⚛️", color: "purple" },
      { text: "Machine Learning", icon: "🤖", color: "blue" },
      { text: "World History", icon: "🌍", color: "green" },
    ],
    hindi: [
      { text: "क्वांटम भौतिकी", icon: "⚛️", color: "purple" },
      { text: "मशीन लर्निंग", icon: "🤖", color: "blue" },
      { text: "विश्व इतिहास", icon: "🌍", color: "green" },
    ],
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        What do you want to {type}?
      </h1>

      <div className="w-full max-w-xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          placeholder={`Enter what you want to ${type}...`}
          centered={true}
          className="bg-gray-900/80"
        />

        <p className="text-sm dark:text-gray-400 text-black font-bold text-center mt-1">
          Press Enter to search
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span className="text-sm dark:text-gray-400 text-black font-semibold">
            {selectedLanguage === "hindi" ? "कोशिश करें:" : "Try:"}
          </span>
          {suggestions[selectedLanguage as keyof typeof suggestions].map(
            (suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion.text)}
                className={`px-3 py-1.5 rounded-lg border transition-all duration-200 
                text-xs sm:text-sm bg-black/70 hover:text-white
                ${getColorClasses(suggestion.color)}`}
              >
                {suggestion.icon} {suggestion.text}
              </button>
            )
          )}
        </div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          handleLanguageSelect={handleLanguageSelect}
        />
      </div>
    </div>
  );
};
