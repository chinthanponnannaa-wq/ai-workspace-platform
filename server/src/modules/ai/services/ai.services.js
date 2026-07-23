const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateResponse = async (prompt) => {
  try {
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return {
        success: false,
        message: "Prompt string must not be empty.",
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
    });

    return {
      success: true,
      response: response.text,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      success: false,
      message: error.message || "An error occurred while generating AI response",
    };
  }
};

module.exports = { generateResponse };