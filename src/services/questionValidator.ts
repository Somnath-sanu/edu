import { Question } from "../types";

export function validateQuestionFormat(question: Question): boolean {
  try {
    // Basic validation
    if (!question.text?.trim()) return false;
    if (!Array.isArray(question.options) || question.options.length !== 4)
      return false;
    if (question.options.some((opt) => !opt?.trim())) return false;
    if (
      typeof question.correctAnswer !== "number" ||
      question.correctAnswer < 0 ||
      question.correctAnswer > 3
    )
      return false;

    // Explanation validation
    if (
      !question.explanation?.correct?.trim() ||
      !question.explanation?.key_point?.trim()
    )
      return false;

    // Additional validation
    if (question.text.length < 10) return false; // Too short
    if (question.options.length !== new Set(question.options).size)
      return false; // Duplicates
    if (
      question.explanation.correct.length < 5 ||
      question.explanation.key_point.length < 5
    )
      return false; // Too short explanations

    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}
