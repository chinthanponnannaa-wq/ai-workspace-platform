const Message = require("../models/Message");

const createMessage = async (messageData) => {

    const message = await Message.create({
        content: messageData.content,
        role: messageData.role,
        chat: messageData.chatId
    });

    return {
        success: true,
        message: "Message created successfully",
        data: message
    };
};

const getMessages = async (chatId) => {

    const messages = await Message.find({
        chat: chatId
    }).sort({ createdAt: 1 });

    return {
        success: true,
        messages
    };
};

const deleteMessage = async (messageId) => {

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
        return {
            success: false,
            message: "Message not found"
        };
    }

    return {
        success: true,
        message: "Message deleted successfully"
    };
};

module.exports = {
    createMessage,
    getMessages,
    deleteMessage
};