const Chat = require("../models/Chat");
const Workspace = require("../../workspace/models/Workspace");
const Message = require("../../message/models/Message");

const createChat = async (userId, chatData) => {
    const workspace = await Workspace.findOne({
        _id: chatData.workspaceId,
        owner: userId
    });

    if (!workspace) {
        return {
            success: false,
            message: "Workspace not found"
        };
    }

    const chat = await Chat.create({
        title: chatData.title || "New Chat",
        workspace: chatData.workspaceId,
        user: userId
    });

    return {
        success: true,
        message: "Chat created successfully",
        chat
    };
};

const getChats = async (userId, workspaceId) => {
    const workspace = await Workspace.findOne({
        _id: workspaceId,
        owner: userId
    });

    if (!workspace) {
        return {
            success: false,
            message: "Workspace not found"
        };
    }

    const chats = await Chat.find({
        workspace: workspaceId,
        user: userId
    }).sort({ createdAt: -1 });

    return {
        success: true,
        chats
    };
};

const updateChat = async (userId, chatId, chatData) => {
    if (!chatData.title || !chatData.title.trim()) {
        return {
            success: false,
            message: "Chat title is required"
        };
    }

    const chat = await Chat.findOneAndUpdate(
        {
            _id: chatId,
            user: userId
        },
        {
            title: chatData.title.trim()
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!chat) {
        return {
            success: false,
            message: "Chat not found"
        };
    }

    return {
        success: true,
        message: "Chat renamed successfully",
        chat
    };
};

const deleteChat = async (userId, chatId) => {
    const chat = await Chat.findOne({
        _id: chatId,
        user: userId
    });

    if (!chat) {
        return {
            success: false,
            message: "Chat not found"
        };
    }

    await Message.deleteMany({
        chat: chatId
    });

    await Chat.findByIdAndDelete(chatId);

    return {
        success: true,
        message: "Chat deleted successfully"
    };
};

module.exports = {
    createChat,
    getChats,
    updateChat,
    deleteChat
};