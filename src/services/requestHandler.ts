export async function makeRequest(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        maxTokens,
      }),
    });

    const data = await response.json();
    return data.content || "";
  } catch (error) {
    console.error("Request Error:", error);
    throw new Error("Failed to generate content");
  }
}
