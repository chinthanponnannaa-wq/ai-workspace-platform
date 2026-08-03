const { generateResponse } = require("../services/ai.services");

const chat = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body);

        const { chatId, prompt } = req.body;

        if (!chatId || !prompt) {
            return res.status(400).json({
                success: false,
                message: "chatId and prompt are required.",
            });
        }

        const result = await generateResponse(chatId, prompt);

        if (!result.success) {
            return res.status(500).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    chat,
};