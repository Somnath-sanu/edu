// src/components/Explore/ExploreView.tsx
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SearchBar } from "../shared/SearchBar";
import { GPTService } from "../../services/gptService";

import { RelatedTopics } from "./RelatedTopics";
import { RelatedQuestions } from "./RelatedQuestions";
import { LoadingAnimation } from "../shared/LoadingAnimation";
import { Message, StreamChunk, ExploreViewProps } from "./types";
import { MarkdownComponents } from "./MarkdownComponents";
import { InitialSearchView } from "../shared/InitialSearchView";
import { RelatedQueries } from "./RelatedQueries";
import { ExploreHistory } from "./ExploreHistory";

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialQuery,
  onError,
  onRelatedQueryClick,
  userContext,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInitialSearch, setShowInitialSearch] = useState(!initialQuery);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gptService = useMemo(() => GPTService.getInstance(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<Message[][]>([]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 100);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToTop();
    }
  }, [messages.length, scrollToTop]);

  useEffect(() => {
    const handleReset = () => {
      setMessages([]);
      setShowInitialSearch(true);
    };

    window.addEventListener("resetExplore", handleReset);
    return () => window.removeEventListener("resetExplore", handleReset);
  }, []);

  const handleHistoryItemClick = useCallback((selectedMessages: Message[]) => {
    setMessages(selectedMessages);
    setShowInitialSearch(false);
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        if (window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
        scrollToTop();
        setIsLoading(true);

        // const contextMessages = chatHistory.slice(-3).flat();
        // const contextText = contextMessages
        //   .map((msg) => `${msg.type === "user" ? "You" : "AI"}: ${msg.content}`)
        //   .join("\n");

        // const promptWithContext = `${contextText}\n${query}\n`;

        const newConversation: Message[] = [
          { type: "user" as const, content: query },
          { type: "ai" as const, content: "" },
        ];

        setMessages(newConversation);
        setShowInitialSearch(false);

        let isComplete = false;

        await gptService.streamExploreContent(
          query,
          userContext,
          (chunk: StreamChunk) => {
            const updatedMessages: Message[] = [
              { type: "user" as const, content: query },
              {
                type: "ai" as const,
                content: chunk.text,
                topics: chunk.topics,
                questions: chunk.questions,
              },
            ];
            setMessages(updatedMessages);

            if (chunk.text && !isComplete && chunk.topics && chunk.questions) {
              isComplete = true;
              setChatHistory((prev) => {
                const exists = prev.some(
                  (conversation) =>
                    conversation[0].content === query &&
                    conversation[1].content === chunk.text
                );

                if (!exists) {
                  return [...prev, updatedMessages];
                }
                return prev;
              });
            }
          }
        );
      } catch (error) {
        console.error("Search error:", error);
        onError(
          error instanceof Error ? error.message : "Failed to load content"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [gptService, onError, userContext, scrollToTop]
  );

  const handleRelatedQueryClick = useCallback(
    (query: string) => {
      scrollToTop();

      if (onRelatedQueryClick) {
        onRelatedQueryClick(query);
      }
      handleSearch(query);
    },
    [handleSearch, onRelatedQueryClick, scrollToTop]
  );

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] flex flex-col relative"
      ref={containerRef}
    >
      <ExploreHistory
        chatHistory={chatHistory}
        onHistoryItemClick={handleHistoryItemClick}
      />

      {showInitialSearch ? (
        <>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <InitialSearchView handleSearch={handleSearch} type="explore" />
          </div>
        </>
      ) : (
        <div
          ref={messagesContainerRef}
          className="relative flex flex-col w-full"
        >
          <div className="space-y-2 pb-16">
            {messages.map((message, index) => (
              <div key={index} className="px-2 sm:px-4 w-full mx-auto">
                <div className="max-w-3xl mx-auto">
                  {message.type === "user" ? (
                    <div className="w-full">
                      <div className="flex-1 text-base sm:text-lg font-semibold dark:text-gray-100 text-black">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex-1 min-w-0">
                        {!message.content && isLoading ? (
                          <div className="flex items-center space-x-2 py-2">
                            <LoadingAnimation />
                            <span className="text-sm dark:text-gray-100 text-black">
                              Thinking...
                            </span>
                          </div>
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              ...MarkdownComponents,
                              p: ({ children }) => (
                                <p
                                  className="text-sm sm:text-base dark:text-gray-100 text-black my-1.5 leading-relaxed 
                                  break-words"
                                >
                                  {children}
                                </p>
                              ),
                            }}
                            className="whitespace-pre-wrap break-words space-y-1.5"
                          >
                            {message.content || ""}
                          </ReactMarkdown>
                        )}

                        {message.topics && message.topics.length > 0 && (
                          <div className="mt-3">
                            <RelatedTopics
                              topics={message.topics}
                              onTopicClick={handleRelatedQueryClick}
                            />
                          </div>
                        )}

                        {message.questions && message.questions.length > 0 && (
                          <div className="mt-3">
                            <RelatedQuestions
                              questions={message.questions}
                              onQuestionClick={handleRelatedQueryClick}
                            />
                          </div>
                        )}
                        {message.queries && message.queries.length > 0 && (
                          <div className="mt-3">
                            <RelatedQueries
                              queries={message.queries}
                              onQueryClick={handleRelatedQueryClick}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div
              ref={messagesEndRef}
              className="h-8 w-full"
              aria-hidden="true"
            />
          </div>

          <div className="fixed bottom-12 left-0 right-0 bg-neutral-300 dark:bg-gray-900  pb-1 pt-2 z-50 ">
            <div className="w-full px-2 sm:px-4 max-w-3xl mx-auto drop-shadow-sm">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Ask a follow-up question..."
                centered={false}
                className="bg-neutral-300 dark:bg-gray-900  backdrop-blur-lg border border-gray-700/50 h-10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ExploreView.displayName = "ExploreView";
