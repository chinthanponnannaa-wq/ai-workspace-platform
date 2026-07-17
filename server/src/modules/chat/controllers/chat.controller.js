const {
    createChat,
    getChats,
    deleteChat
} = require("../services/chat.service");

const create = async (req, res) => {

    const result = await createChat(req.body);

    return res.status(201).json(result);
};

const getAll = async (req, res) => {

    const result = await getChats(req.params.workspaceId);

    return res.status(200).json(result);
};

const remove = async (req, res) => {

    const result = await deleteChat(req.params.id);

    if (!result.success) {
        return res.status(404).json(result);
    }

    return res.status(200).json(result);
};

module.exports = {
    create,
    getAll,
    remove
};