/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Test/TestView.tsx
import { useState, useEffect } from "react";
import { SearchBar } from "../shared/SearchBar";
import { Loading } from "../shared/Loading";
import { useApi } from "../../hooks/useApi";
import { Trophy, Clock, AlertCircle } from "lucide-react";
import { Question, UserContext } from "../../types";
import { calculateRank } from "./calculateRank";

interface TestViewProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  userContext: UserContext;
}

export interface IndexedQuestion extends Question {
  index: number;
}

export const TestView: React.FC<TestViewProps> = ({ onError, onSuccess }) => {
  const { isLoading, generateTest } = useApi();
  const [mode, setMode] = useState<"selection" | "test" | "result">(
    "selection"
  );
  const [examType, setExamType] = useState<"JEE" | "NEET" | null>(null);
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<IndexedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<IndexedQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState("00:00");

  // Forward-counting timer
  useEffect(() => {
    if (mode === "test" && testStarted) {
      const timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setTimeSpent(
          `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`
        );
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, startTime, testStarted]);

  const startTest = async () => {
    if (!examType || !topic) {
      onError("Please select an exam type and topic");
      return;
    }

    try {
      setMode("test");
      const generatedQuestions = await generateTest(topic, examType);

      if (
        !Array.isArray(generatedQuestions) ||
        generatedQuestions.length < 10
      ) {
        throw new Error(
          `Expected 10 questions, got ${generatedQuestions.length}`
        );
      }

      const questionsWithIndex = generatedQuestions.map((q, idx) => ({
        ...q,
        index: idx,
      }));

      setQuestions(questionsWithIndex);
      setCurrentQuestion(questionsWithIndex[0]);
      setAnswers(
        Object.fromEntries(questionsWithIndex.map((q) => [q.index, -1]))
      ); // Initialize all answers as -1 (unanswered)
      setTestStarted(true);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Test generation error:", error);
      onError("Failed to generate test questions. Please try again.");
      setMode("selection");
    }
  };

  // Add effect to start timer when first question is viewed
  useEffect(() => {
    if (mode === "test" && !testStarted && questions.length > 0) {
      setStartTime(Date.now());
      setTestStarted(true);
    }
  }, [mode, questions, testStarted]);

  const submitTest = () => {
    let totalMarks = 0;
    Object.values(answers).forEach((answer) => {
      if (answer === -1) return; // Skip unanswered
      if (answer === questions[answer].correctAnswer) {
        totalMarks += 4; // +4 for correct
      } else {
        totalMarks -= 1; // -1 for wrong
      }
    });

    setMode("result");
    onSuccess("Test completed! Check your results.");
  };

  // Selection View - Exam Type and Topic Selection
  const renderSelectionView = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Select Exam Type</h2>
        <div className="grid grid-cols-2 gap-4">
          {["JEE Mains", "NEET"].map((type) => (
            <button
              key={type}
              onClick={() => setExamType(type === "JEE Mains" ? "JEE" : "NEET")}
              className={`p-4 rounded-lg border-2 transition-colors ${
                (examType === "JEE" && type === "JEE Mains") ||
                (examType === "NEET" && type === "NEET")
                  ? "border-primary bg-primary/10"
                  : "border-gray-700 hover:border-primary/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Enter Topic</h2>
        <SearchBar
          placeholder="e.g., Photosynthesis, Newton's Laws, etc."
          onSearch={(newTopic) => {
            if (newTopic.trim()) {
              setTopic(newTopic);
            }
          }}
          initialValue={topic}
        />
      </div>

      <button
        onClick={startTest}
        disabled={!examType || !topic}
        className="btn btn-primary w-full disabled:opacity-50"
      >
        Start Test
      </button>
    </div>
  );

  // Test View - Questions and Timer
  const renderTestView = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Timer and Progress */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">
              Question {currentQuestion ? currentQuestion.index + 1 : ""}/10
            </span>
            <div className="h-2 w-32 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion ? currentQuestion.index + 1 : 0) / 10) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-lg font-medium text-primary bg-primary/10 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5" />
            <span>{timeSpent}</span>
          </div>
        </div>

        {/* Question Navigation Grid */}
        <div className="flex flex-wrap gap-2">
          {Array(10)
            .fill(0)
            .map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(questions[idx])}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 
                ${
                  currentQuestion === questions[idx]
                    ? "bg-primary text-white scale-110 shadow-lg"
                    : answers[idx] !== -1
                    ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {idx + 1}
              </button>
            ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-medium mb-6 leading-relaxed">
          {currentQuestion?.text}
        </h2>

        <div className="flex flex-col space-y-4">
          {/* Question options */}
          {currentQuestion?.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`p-4 rounded-lg ${
                answers[currentQuestion.index] === idx
                  ? "bg-primary text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {option}
            </button>
          ))}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={goToPrevious}
              disabled={!currentQuestion || currentQuestion.index === 0}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={goToNext}
              disabled={
                !currentQuestion ||
                currentQuestion.index === questions.length - 1
              }
              className="px-4 py-2 rounded bg-primary hover:bg-primary-dark disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Answered Questions Count */}
      <div className="text-center text-sm text-gray-400">
        {Object.values(answers).filter((a) => a !== -1).length} of 10 questions
        answered
      </div>
    </div>
  );

  // Result View
  const renderResultView = () => {
    const totalMarks = Object.values(answers).reduce((acc, ans) => {
      if (ans === -1) return acc;
      return acc + (ans === questions[ans].correctAnswer ? 4 : -1);
    }, 0);

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-primary">
                  {totalMarks}
                </span>
                <span className="text-gray-400 text-sm ml-2">marks</span>
              </div>
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Out of {questions.length * 4} marks
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-purple-500">
                  {timeSpent}
                </span>
                <span className="text-gray-400 text-sm ml-2">duration</span>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Expected Rank Range</h2>
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-green-500" />
            <div>
              <span className="text-3xl font-bold text-green-500">
                {calculateRank(totalMarks, examType!, questions)}
              </span>
              <p className="text-sm text-gray-400 mt-1">
                Based on {examType} {new Date().getFullYear()} scoring patterns
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setMode("selection");
            setAnswers({});
            setCurrentQuestion(null);
          }}
          className="btn btn-primary w-full"
        >
          Take Another Test
        </button>
      </div>
    );
  };

  // Add proper index handling
  const handleAnswer = (selectedIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.index]: selectedIndex,
    }));
  };

  // Fix navigation with proper index handling
  const goToNext = () => {
    if (!currentQuestion) return;
    const nextIndex = currentQuestion.index + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex]);
    }
  };

  const goToPrevious = () => {
    if (!currentQuestion) return;
    const prevIndex = currentQuestion.index - 1;
    if (prevIndex >= 0) {
      setCurrentQuestion(questions[prevIndex]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">
          Rank Predictor
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          Predict your potential rank based on topic performance
        </p>
        <div className="inline-block px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400 border border-gray-700/50">
          Currently supporting JEE Mains & NEET • More exams coming soon ✨
        </div>
      </div>

      {mode === "selection" && renderSelectionView()}
      {mode === "test" && (
        <>
          {renderTestView()}
          <button onClick={submitTest} className="btn btn-primary mt-6 w-full">
            Submit Test
          </button>
        </>
      )}
      {mode === "result" && renderResultView()}
    </div>
  );
};
