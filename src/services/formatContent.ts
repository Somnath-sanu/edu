/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExploreResponse } from "../types";

export function formatContent(parsedContent: any): ExploreResponse {
  if (
    !parsedContent.domain ||
    !parsedContent.content ||
    !parsedContent.content.paragraph1 ||
    !parsedContent.content.paragraph2 ||
    !parsedContent.content.paragraph3
  ) {
    throw new Error("Invalid response structure");
  }

  // Combine paragraphs into content
  const formattedContent = [
    parsedContent.content.paragraph1,
    parsedContent.content.paragraph2,
    parsedContent.content.paragraph3,
  ].join("\n\n");

  // Ensure related topics and questions exist
  const relatedTopics = Array.isArray(parsedContent.relatedTopics)
    ? parsedContent.relatedTopics.slice(0, 5)
    : [];

  const relatedQuestions = Array.isArray(parsedContent.relatedQuestions)
    ? parsedContent.relatedQuestions.slice(0, 5)
    : [];

  return {
    content: formattedContent,
    relatedTopics: relatedTopics,
    relatedQuestions: relatedQuestions,
  };
}
