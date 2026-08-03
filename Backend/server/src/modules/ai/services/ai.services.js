const { GoogleGenAI } = require("@google/genai");
const mongoose = require("mongoose");
const Message = require("../../message/models/Message");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateResponse = async (chatId, prompt) => {
  try {
    // Validate prompt
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return {
        success: false,
        message: "Prompt string must not be empty.",
      };
    }

    // Validate chat ID
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return {
        success: false,
        message: "Invalid chatId format. Must be a valid MongoDB ObjectId.",
      };
    }

    // Save user message
    const userMessage = await Message.create({
      content: prompt,
      role: "user",
      chat: chatId,
    });

    // Load conversation history
    const messages = await Message.find({ chat: chatId }).sort({
      createdAt: 1,
    });

    const conversation = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: message.content,
        },
      ],
    }));

    // Generate AI response
    let responseText = "";

    try {
      const response = await ai.models.generateContent({
        model: "models/gemini-flash-latest",
        contents: conversation,
      });

      responseText =
        response.text ||
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated.";
    } catch (error) {
      console.error("\n========== GEMINI API ERROR ==========");
      console.error(JSON.stringify(error, null, 2));
      console.error("======================================\n");

      throw error;
    }

    // Save assistant response
    const assistantMessage = await Message.create({
      content: responseText,
      role: "assistant",
      chat: chatId,
    });

    return {
      success: true,
      response: responseText,
      userMessage,
      assistantMessage,
    };
  } catch (error) {
    console.error("Gemini Service Error:", error);

    return {
      success: false,
      message:
        error.message ||
        "An error occurred while generating AI response.",
    };
  }
};

module.exports = {
  generateResponse,
};