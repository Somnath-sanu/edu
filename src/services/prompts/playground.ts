const aspects = [
  "core_concepts",
  "applications",
  "problem_solving",
  "analysis",
  "current_trends",
];

export const playgroundQuestionPrompts = (
  topic: string,
  level: number,
  age: number
) => {
  const selectedAspect = aspects[Math.floor(Math.random() * aspects.length)];

  const systemPrompt = `Generate a UNIQUE multiple-choice question about ${topic}.
        Focus on: ${selectedAspect.replace("_", " ")}

        Return in this JSON format:
        {
          "text": "question text here",
          "options": ["option A", "option B", "option C", "option D"],
          "correctAnswer": RANDOMLY_PICKED_NUMBER_0_TO_3,
          "explanation": {
            "correct": "Brief explanation of why the correct answer is right (max 15 words)",
            "key_point": "One key concept to remember (max 10 words)"
          },
          "difficulty": ${level},
          "topic": "${topic}",
          "subtopic": "specific subtopic",
          "questionType": "conceptual",
          "ageGroup": "${age}"
        }

        IMPORTANT RULES FOR UNIQUENESS:
        1. For ${topic}, based on selected aspect:
           - core_concepts: Focus on fundamental principles and theories
           - applications: Focus on real-world use cases and implementations
           - problem_solving: Present a scenario that needs solution
           - analysis: Compare different approaches or technologies
           - current_trends: Focus on recent developments and future directions

        2. Question Variety:
           - NEVER use the same question pattern twice
           - Mix theoretical and practical aspects
           - Include industry-specific examples
           - Use different question formats (what/why/how/compare)
           - Incorporate current developments in ${topic}

        3. Answer Choices:
           - Make ALL options equally plausible
           - Randomly assign the correct answer (0-3)
           - Ensure options are distinct but related
           - Include common misconceptions
           - Make wrong options educational

        4. Format Requirements:
           - Question must be detailed and specific
           - Each option must be substantive
           - Explanation must cover why correct answer is right AND why others are wrong
           - Include real-world context where possible
           - Use age-appropriate language

        ENSURE HIGH ENTROPY:
        - Randomize question patterns
        - Vary difficulty within level ${level}
        - Mix theoretical and practical aspects
        - Use different companies/technologies as examples
        - Include various ${topic} scenarios

        EXPLANATION GUIDELINES:
        - Keep explanations extremely concise and clear
        - Focus on the most important point only
        - Use simple language
        - Highlight the key concept
        - No redundant information
        - Maximum 25 words total`;

  const userPrompt = `Create a completely unique ${level}/10 difficulty question about ${topic}.
        Focus on ${selectedAspect.replace("_", " ")}.
        Ensure the correct answer is randomly placed.
        Make it engaging for a ${age} year old student.
        Use current examples and trends.`;

  return {
    userPrompt,
    systemPrompt,
  };
};
