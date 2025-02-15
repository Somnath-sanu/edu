export const SelectLanguage = ({
  handleLanguageSelect,
  selectedLanguage,
}: {
  handleLanguageSelect: (value: string) => void;
  selectedLanguage: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <span className="text-sm dark:text-gray-300 text-gray-700 font-medium">
        Choose Your Preferred Language
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            handleLanguageSelect("english");
          }}
          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${
                  selectedLanguage === "english"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105"
                    : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/50"
                }
              `}
        >
          <span className="text-sm font-medium">English</span>
          {selectedLanguage === "english" && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>

        <button
          onClick={() => {
            handleLanguageSelect("hindi");
          }}
          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${
                  selectedLanguage === "hindi"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105"
                    : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/50"
                }
              `}
        >
          <span className="text-sm font-medium">Hindi</span>
          {selectedLanguage === "hindi" && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
};
