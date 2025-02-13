/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { Question, UserContext } from "../../../types";
import { Stats, SessionStats } from "../types";
import { useApi } from "../../../hooks/useApi";
import { COUNTDOWN_DURATION, SESSION_LIMIT } from "../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const usePlayground = (
  initialQuery: string | undefined,
  onError: (message: string) => void,
  _onSuccess: (message: string) => void,
  userContext: UserContext
) => {
  const navigate = useNavigate();
  const { getQuestion } = useApi();
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery || "");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  // const [showExplanation, setShowExplanation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [currentQuestionTime, setCurrentQuestionTime] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [nextQuestionCountdown, setNextQuestionCountdown] = useState<
    number | null
  >(null);

  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    sessionLimit: SESSION_LIMIT,
    isSessionComplete: false,
  });

  const [stats, setStats] = useState<Stats>({
    questions: 0,
    accuracy: 0,
    streak: 0,
    bestStreak: 0,
    avgTime: 0,
  });

  const handleSearch = useCallback(
    async (newQuery: string) => {
      if (sessionStats.totalQuestions === sessionStats.sessionLimit) {
        toast.success("Session completed! 🎉");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
        return;
      }
      try {
        setIsInitialLoading(true);
        setQuery(newQuery);
        const question = await getQuestion(newQuery, 1, userContext);
        setCurrentQuestion(question);
        setSelectedAnswer(null);
        setCurrentQuestionTime(0);
      } catch (error) {
        onError("Failed to load question");
      } finally {
        setIsInitialLoading(false);
      }
    },
    [
      getQuestion,
      userContext,
      onError,
      navigate,
      sessionStats.sessionLimit,
      sessionStats.totalQuestions,
    ]
  );

  const handleAnswer = useCallback(
    (index: number) => {
      if (!currentQuestion || selectedAnswer !== null) return;
      setSelectedAnswer(index);
      setStats((prev) => {
        const isCorrect = index === currentQuestion.correctAnswer;
        if (isCorrect) {
          setCorrectAnswers((prev) => prev + 1);
        }
        const newStreak = isCorrect ? prev.streak + 1 : 0;
        const bestStreak = Math.max(prev.bestStreak, newStreak);
        return {
          ...prev,
          questions: prev.questions + 1,
          streak: newStreak,
          bestStreak,
          accuracy: Math.round(
            ((correctAnswers + (isCorrect ? 1 : 0)) / SESSION_LIMIT) * 100
          ),
        };
      });

      setSessionStats((prev) => {
        const newTotal = prev.totalQuestions + 1;
        const isComplete = newTotal > prev.sessionLimit;

        if (isComplete) {
          toast.success("Session completed! 🎉");
        }
        return {
          ...prev,
          totalQuestions: newTotal,
          isSessionComplete: isComplete,
        };
      });
      setNextQuestionCountdown(COUNTDOWN_DURATION);
    },
    [currentQuestion, selectedAnswer, correctAnswers]
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  useEffect(() => {
    if (!isPaused && currentQuestion && selectedAnswer === null) {
      const interval = setInterval(() => {
        setCurrentQuestionTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, currentQuestion, selectedAnswer]);

  useEffect(() => {
    if (nextQuestionCountdown === null) return;

    if (nextQuestionCountdown > 0) {
      if (sessionStats.totalQuestions > sessionStats.sessionLimit) {
        toast("session completed!🎉");
        return;
      }
      const countdownInterval = setInterval(() => {
        setNextQuestionCountdown((prev) => prev! - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else {
      setNextQuestionCountdown(null);
      setSelectedAnswer(null);
      setCurrentQuestionTime(0);
      handleSearch(query);
    }

    if (!sessionStats.isSessionComplete) {
      handleSearch(query);
    } else {
      toast("session completed!🎉");
    }
  }, [nextQuestionCountdown, handleSearch, query, sessionStats]);

  return {
    isInitialLoading,
    query,
    currentQuestion,
    selectedAnswer,
    // showExplanation,
    isPaused,
    nextQuestionCountdown,
    currentQuestionTime,
    sessionStats,
    stats,
    handleSearch,
    handleAnswer,
    togglePause,
  };
};
