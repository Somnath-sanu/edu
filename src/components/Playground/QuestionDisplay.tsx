import React from "react";
import { Play, Pause, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Question } from "../../types";

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer: number | null;
  isPaused: boolean;
  nextQuestionCountdown: number | null;
  COUNTDOWN_DURATION: number;
  onAnswer: (index: number) => void;
  onTogglePause: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  isPaused,
  nextQuestionCountdown,
  COUNTDOWN_DURATION,
  onAnswer,
  onTogglePause,
}) => {
  return (
    <div className="card flex-1 flex flex-col mt-4 bg-neutral-300 dark:bg-gray-900 shadow-sm gap-2">
      <div className="flex justify-between items-start">
        <h2
          className="text-xs sm:text-base font-medium leading-relaxed 
          dark:text-gray-200 text-slate-300 max-w-3xl whitespace-pre-line tracking-wide"
        >
          {question.text}
        </h2>
        <button
          onClick={onTogglePause}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-primary" />
          ) : (
            <Pause className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>

      <div className="space-y-2">
        {question.options?.map((option: string, idx: number) => (
          <button
            key={idx}
            onClick={() => onAnswer(idx)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg 
              text-xs sm:text-sm leading-relaxed text-slate-300 ${
                selectedAnswer === null
                  ? "bg-card hover:bg-gray-800"
                  : idx === question.correctAnswer
                  ? "bg-green-500/20 text-green-500"
                  : selectedAnswer === idx
                  ? "bg-red-500/20 text-red-500"
                  : "bg-card"
              }`}
          >
            <span className="inline-block w-5 sm:w-6 font-medium">
              {String.fromCharCode(65 + idx)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer !== null && (
        <QuestionExplanation
          question={question}
          selectedAnswer={selectedAnswer}
          isPaused={isPaused}
          nextQuestionCountdown={nextQuestionCountdown}
          COUNTDOWN_DURATION={COUNTDOWN_DURATION}
        />
      )}
    </div>
  );
};

const QuestionExplanation: React.FC<{
  question: Question;
  selectedAnswer: number;
  isPaused: boolean;
  nextQuestionCountdown: number | null;
  COUNTDOWN_DURATION: number;
}> = ({
  question,
  selectedAnswer,
  isPaused,
  nextQuestionCountdown,
  COUNTDOWN_DURATION,
}) => {
  return (
    <div className="mt-3 space-y-2 text-sm">
      {!isPaused && nextQuestionCountdown !== null && (
        <div className="mb-2">
          <div className="relative h-1 bg-neutral-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-100 w-2 rounded-full"
              style={{
                width: `${(nextQuestionCountdown / COUNTDOWN_DURATION) * 100}%`,
              }}
            />
          </div>
          <div className="mt-1 text-xs dark:text-gray-400 text-white text-center">
            Next question in {nextQuestionCountdown.toFixed(0)}s
          </div>
        </div>
      )}

      <div
        className={`px-3 py-2 rounded-lg ${
          selectedAnswer === question.correctAnswer
            ? "bg-green-500/20 text-green-500"
            : "bg-red-500/20 text-red-500"
        }`}
      >
        <div className="flex items-start gap-2">
          <div
            className={`p-1 rounded-full ${
              selectedAnswer === question.correctAnswer
                ? "bg-green-500/20"
                : "bg-red-500/20"
            }`}
          >
            {selectedAnswer === question.correctAnswer ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {selectedAnswer === question.correctAnswer
                ? "Correct!"
                : `Incorrect. The right answer is ${String.fromCharCode(
                    65 + question.correctAnswer
                  )}`}
            </p>
            <p className="text-xs mt-1 opacity-90">
              {question.explanation.correct}
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 rounded-lg bg-blue-500 border border-blue-500/20">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-400" />
          <p className="text-xs text-blue-400">
            {question.explanation.key_point}
          </p>
        </div>
      </div>
    </div>
  );
};
