import { Loading } from "../shared/Loading";
import { StatsDisplay } from "./StatsDisplay";
import { QuestionDisplay } from "./QuestionDisplay";
import { InitialSearchView } from "../shared/InitialSearchView";
import { usePlayground } from "./hooks/usePlayground";
import { PlaygroundViewProps } from "./types";
import { COUNTDOWN_DURATION } from "./constants";

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  initialQuery,
  onError,
  onSuccess,
  userContext,
}) => {
  const {
    isInitialLoading,
    currentQuestion,
    selectedAnswer,
    isPaused,
    nextQuestionCountdown,
    currentQuestionTime,
    sessionStats,
    stats,
    handleSearch,
    handleAnswer,
    togglePause,
  } = usePlayground(initialQuery, onError, onSuccess, userContext);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col">
      {!currentQuestion || sessionStats.isSessionComplete ? (
        <InitialSearchView handleSearch={handleSearch} type="practice" />
      ) : (
        <div className="w-full max-w-3xl mx-auto px-4 ">
          <StatsDisplay
            stats={stats}
            currentQuestionTime={currentQuestionTime}
          />
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            isPaused={isPaused}
            nextQuestionCountdown={nextQuestionCountdown}
            COUNTDOWN_DURATION={COUNTDOWN_DURATION}
            onAnswer={handleAnswer}
            onTogglePause={togglePause}
          />
        </div>
      )}
    </div>
  );
};
