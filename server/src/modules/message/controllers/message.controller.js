const {
    createMessage,
    getMessages,
    deleteMessage
} = require("../services/message.services");

const create = async (req, res) => {

    const result = await createMessage(req.body);

    return res.status(201).json(result);
};

const getAll = async (req, res) => {

    const result = await getMessages(req.params.chatId);

    return res.status(200).json(result);
};

const remove = async (req, res) => {

    const result = await deleteMessage(req.params.id);

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