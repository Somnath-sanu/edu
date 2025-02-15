import toast from "react-hot-toast";

export async function makeRequest(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
) {
  try {
    const userLanguage = JSON.parse(
      localStorage.getItem("userLanguage") ?? "english"
    );

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          maxTokens,
          userLanguage,
        }),
      }
    );

    if (response.status === 429) {
      toast.error("Too Many Requests.Please try again after some time");
      throw new Error("Too Many Requests");
    }

    const data = await response.json();
    return data.content || "";
  } catch (error) {
    console.error("Request Error:", error);
    throw new Error("Failed to generate content");
  }
}
