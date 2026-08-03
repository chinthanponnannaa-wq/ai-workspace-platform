const {
    createChat,
    getChats,
    updateChat,
    deleteChat
} = require("../services/chat.service");

const create = async (req, res) => {
    try {
        const result = await createChat(
            req.user.id,
            req.body
        );

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error("Create chat error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create chat"
        });
    }
};

const getAll = async (req, res) => {
    try {
        const result = await getChats(
            req.user.id,
            req.params.workspaceId
        );

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Get chats error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch chats"
        });
    }
};

const update = async (req, res) => {
    try {
        const result = await updateChat(
            req.user.id,
            req.params.id,
            req.body
        );

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Update chat error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to rename chat"
        });
    }
};

const remove = async (req, res) => {
    try {
        const result = await deleteChat(
            req.user.id,
            req.params.id
        );

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Delete chat error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete chat"
        });
    }
};

module.exports = {
    create,
    getAll,
    update,
    remove
};