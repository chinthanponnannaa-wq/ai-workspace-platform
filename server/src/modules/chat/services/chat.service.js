const Chat = require("../models/Chat");

const createChat = async (chatData) => {

    const chat = await Chat.create({
        title: chatData.title,
        workspace: chatData.workspaceId
    });

    return {
        success: true,
        message: "Chat created successfully",
        chat
    };
};

const getChats = async (workspaceId) => {

    const chats = await Chat.find({
        workspace: workspaceId
    }).sort({ createdAt: -1 });

    return {
        success: true,
        chats
    };
};

const deleteChat = async (chatId) => {

    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
        return {
            success: false,
            message: "Chat not found"
        };
    }

    return {
        success: true,
        message: "Chat deleted successfully"
    };
};

module.exports = {
    createChat,
    getChats,
    deleteChat
};