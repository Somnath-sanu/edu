/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { Question, UserContext, ExploreResponse } from "../types";
import { formatContent } from "./formatContent";
import { buildPrompt } from "./prompts/build";
import { explorePrompts } from "./prompts/explore";
import { playgroundQuestionPrompts } from "./prompts/playground";
import { validateQuestionFormat } from "./questionValidator";
import { makeRequest } from "./requestHandler";

export class GPTService {
  private static instance: GPTService;

  private constructor() {}

  public static getInstance(): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService();
    }
    return GPTService.instance;
  }

  async getExploreContent(
    query: string,
    userContext: UserContext
  ): Promise<ExploreResponse> {
    try {
      const { systemPrompt, userPrompt } = explorePrompts(
        query,
        userContext.age
      );
      const content = await makeRequest(systemPrompt, userPrompt);

      if (!content) {
        throw new Error("Empty response from GPT");
      }

      const parsedContent = JSON.parse(content);

      return formatContent(parsedContent);
    } catch (error) {
      console.error("Explore content error:", error);
      throw new Error("Failed to generate explore content");
    }
  }

  async getPlaygroundQuestion(
    topic: string,
    level: number,
    userContext: UserContext
  ): Promise<Question> {
    try {
      const { userPrompt, systemPrompt } = playgroundQuestionPrompts(
        topic,
        level,
        userContext.age
      );

      const content = await makeRequest(systemPrompt, userPrompt, 1500);

      if (!content) {
        throw new Error("Empty response received");
      }

      let rawText = content.candidates[0]?.content?.parts[0]?.text;
      if (!rawText) {
        throw new Error("Invalid response structure");
      }
      rawText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      console.log("Extracted JSON String:", rawText);

      let parsedContent: Question;
      try {
        parsedContent = JSON.parse(rawText);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        throw new Error("Invalid JSON response");
      }

      const shuffled = this.shuffleOptionsAndAnswer(parsedContent);

      const formattedQuestion: Question = {
        text: shuffled.text || "",
        options: shuffled.options,
        correctAnswer: shuffled.correctAnswer,
        explanation: {
          correct:
            shuffled.explanation?.correct || "Correct answer explanation",
          key_point: shuffled.explanation?.key_point || "Key learning point",
        },
        difficulty: level,
        topic: topic,
        subtopic: parsedContent.subtopic || topic,
        questionType: "conceptual",
        ageGroup: userContext.age.toString(),
      };

      if (validateQuestionFormat(formattedQuestion)) {
        return formattedQuestion;
      }

      throw new Error("Generated question failed validation");
    } catch (error) {
      console.error("Question generation error:", error);
      throw new Error("Failed to generate valid question");
    }
  }

  private shuffleOptionsAndAnswer(question: Question): Question {
    // Create array of option objects with original index
    const optionsWithIndex = question.options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === question.correctAnswer,
    }));

    // Shuffle the options
    for (let i = optionsWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndex[i], optionsWithIndex[j]] = [
        optionsWithIndex[j],
        optionsWithIndex[i],
      ];
    }

    // Find new index of correct answer
    const newCorrectAnswer = optionsWithIndex.findIndex((opt) => opt.isCorrect);

    return {
      ...question,
      options: optionsWithIndex.map((opt) => opt.text),
      correctAnswer: newCorrectAnswer,
    };
  }

  async getTestQuestions(
    topic: string,
    examType: "JEE" | "NEET"
  ): Promise<Question[]> {
    try {
      const systemPrompt = `Create a ${examType} exam test set about ${topic}.
        Generate exactly 15 questions following this structure:
        {
          "questions": [
            {
              "text": "Clear question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": 0,
              "explanation": "Step-by-step solution",
              "difficulty": 1,
              "topic": "${topic}",
              "subtopic": "specific concept",
              "examType": "${examType}",
              "questionType": "conceptual"
            }
          ]
        }`;

      const aiResponse = await makeRequest(
        systemPrompt,
        `Create 15 ${examType} questions about ${topic} (5 easy, 5 medium, 5 hard)`,
        4000
      );

      if (!aiResponse) {
        console.error("Empty response from API");
        throw new Error("No content received from API");
      }

      const responseText = aiResponse.candidates[0].content.parts[0].text;
      const content = responseText
        .replace(/```json\n|```/g, "")
        .replace(/\\n/g, "")
        .replace(/\\t/g, "")
        .replace(/\s+/g, " ")
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (error) {
        console.error("JSON parse error:", error);

        throw new Error("Failed to parse API response");
      }

      if (!parsed?.questions || !Array.isArray(parsed.questions)) {
        console.error("Invalid response structure:", parsed);
        throw new Error("Invalid response structure");
      }

      const processedQuestions = parsed.questions.map(
        (q: Partial<Question>, index: number) => {
          const difficulty = Math.floor(index / 5) + 1;
          return {
            text: q.text || "",
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer:
              typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
            explanation: {
              correct: q.explanation || "",
              key_point: "Key point not provided",
            },
            difficulty,
            topic,
            subtopic: q.subtopic || `${topic} Concept ${index + 1}`,
            examType,
            questionType: "conceptual",
            ageGroup: "16-18",
          } as Question;
        }
      );

      const validQuestions = processedQuestions.filter((q: Question) => {
        const isValid = validateQuestionFormat(q);
        if (!isValid) {
          console.error("Invalid question:", q);
        }
        return isValid;
      });

      if (validQuestions.length >= 5) {
        const finalQuestions = validQuestions.slice(0, 10); // 10 questions

        return finalQuestions;
      }

      throw new Error(
        `Only ${validQuestions.length} valid questions generated`
      );
    } catch (error) {
      console.error("Test generation error:", error);
      throw new Error(
        `Failed to generate test questions: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async exploreQuery(query: string): Promise<string> {
    try {
      console.log(import.meta.env.VITE_API_URL);
      const userLanguage = localStorage.getItem("userLanguage") ?? "english";
      console.log({
        userLanguage,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/explore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: buildPrompt(query),
            userLanguage,
          }),
        }
      );

      if (response.status === 429) {
        toast.error("Too Many Requests.Please try again after some time");
        throw new Error("Too Many Requests");
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return (
        data.content || "bestie, the wifi must be acting up... let me try again"
      );
    } catch (error) {
      console.error("Error in exploreQuery:", error);
      return "bestie, the wifi must be acting up... let me try again";
    }
  }

  async streamExploreContent(
    query: string,
    userContext: UserContext,
    onChunk: (content: {
      text?: string;
      topics?: any[];
      questions?: any[];
      queries?: any[];
    }) => void
  ): Promise<void> {
    const maxRetries = 3;
    let retryCount = 0;
    const userLanguage = JSON.parse(
      localStorage.getItem("userLanguage") ?? "english"
    );

    while (retryCount < maxRetries) {
      try {
        console.log(import.meta.env.VITE_API_URL);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/explore-content`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,
              age: userContext.age,
              userLanguage,
            }),
          }
        );

        if (response.status === 429) {
          toast.error("Too Many Requests.Please try again after some time");
          throw new Error("Too Many Requests");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }

        // const reader = response.body?.getReader();
        // const decoder = new TextDecoder();
        const result = await response.json();

        const stream = result.content.candidates[0].content.parts[0].text;
        let mainContent = "";
        let jsonContent = "";
        const currentTopics: any[] = [];
        const currentQuestions: any[] = [];
        const currentQueries: any[] = [];
        let isJsonSection = false;

        const chunks = stream.split("\n");

        chunks.forEach((chunk: any) => {
          const content = chunk;

          if (content.includes("---")) {
            isJsonSection = true;
            return;
          }

          if (isJsonSection) {
            jsonContent += content;
            try {
              if (jsonContent.includes("}")) {
                const jsonStr = jsonContent.trim();
                if (jsonStr.startsWith("{") && jsonStr.endsWith("}")) {
                  const parsed = JSON.parse(jsonStr);

                  if (parsed.topics && Array.isArray(parsed.topics)) {
                    parsed.topics.forEach((topic: any) => {
                      if (!currentTopics.some((t) => t.topic === topic.name)) {
                        currentTopics.push({
                          topic: topic.name,
                          type: topic.type,
                          reason: topic.detail,
                        });
                      }
                    });
                  }

                  if (parsed.questions && Array.isArray(parsed.questions)) {
                    parsed.questions.forEach((question: any) => {
                      if (
                        !currentQuestions.some(
                          (q) => q.question === question.text
                        )
                      ) {
                        currentQuestions.push({
                          question: question.text,
                          type: question.type,
                          context: question.detail,
                        });
                      }
                    });
                  }

                  onChunk({
                    text: mainContent.trim(),
                    topics:
                      currentTopics.length > 0 ? currentTopics : undefined,
                    questions:
                      currentQuestions.length > 0
                        ? currentQuestions
                        : undefined,
                    queries:
                      currentQueries.length > 0 ? currentQueries : undefined,
                  });
                }
              }
            } catch (error) {
              console.debug("JSON parse error:", error);
            }
          } else {
            mainContent += content;
            onChunk({
              text: mainContent.trim(),
              topics: currentTopics.length > 0 ? currentTopics : undefined,
              questions:
                currentQuestions.length > 0 ? currentQuestions : undefined,
            });
          }
        });

        return;
      } catch (error) {
        retryCount++;
        console.error(`API attempt ${retryCount} failed:`, error);

        if (retryCount === maxRetries) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          throw new Error(
            `Failed to stream content after ${maxRetries} attempts. ${errorMessage}`
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retryCount) * 1000)
        );
      }
    }
  }
}
