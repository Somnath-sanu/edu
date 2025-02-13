import React, { useState } from "react";
import { Message } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FiClock } from "react-icons/fi";

interface ExploreHistoryProps {
  chatHistory: Message[][];
  onHistoryItemClick?: (messages: Message[]) => void;
}

export const ExploreHistory: React.FC<ExploreHistoryProps> = ({
  chatHistory,
  onHistoryItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHistory = () => {
    setIsOpen(!isOpen);
  };

  const truncateText = (text: string = "", maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <>
      {/* History Toggle Button */}
      <button
        onClick={toggleHistory}
        className="fixed left-4 top-20 z-50 p-2 rounded-full bg-neutral-200 dark:bg-gray-800 
          hover:bg-neutral-300 dark:hover:bg-gray-700 transition-all duration-200 
          shadow-lg"
        aria-label="Toggle History"
      >
        <FiClock className="w-5 h-5 dark:text-gray-200 text-gray-700" />
      </button>

   
      <AnimatePresence>
        {isOpen && (
          <>
           
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleHistory}
              className="fixed inset-0 bg-black z-40"
            />

            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-neutral-100 dark:bg-gray-900 
                z-50 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-800">
                  Conversation History
                </h2>
                <button
                  onClick={toggleHistory}
                  className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-gray-800 
                    transition-colors"
                >
                  <IoMdClose className="w-5 h-5 dark:text-gray-400 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversation history yet
                  </div>
                ) : (
                  <div className="divide-y dark:divide-gray-800">
                    {chatHistory.map((conversation, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onHistoryItemClick?.(conversation);
                          toggleHistory();
                        }}
                        className="w-full text-left p-4 hover:bg-neutral-200 
                          dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="space-y-2">
                        
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              You:
                            </span>
                            <p className="text-sm dark:text-gray-300 text-gray-700">
                              {truncateText(
                                conversation.find((m) => m.type === "user")
                                  ?.content,
                                60
                              )}
                            </p>
                          </div>

                        
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              AI:
                            </span>
                            <p className="text-sm dark:text-gray-400 text-gray-600">
                              {truncateText(
                                conversation.find((m) => m.type === "ai")?.content,
                                100
                              )}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
