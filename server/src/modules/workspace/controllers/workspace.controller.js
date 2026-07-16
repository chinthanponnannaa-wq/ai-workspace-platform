const {
    createWorkspace,
    getWorkspaces,
    updateWorkspace,
    deleteWorkspace
} = require("../services/workspace.service");

const create = async (req, res) => {

    const result = await createWorkspace(
        req.user.id,
        req.body
    );

    return res.status(201).json(result);
};

const getAll = async (req, res) => {

    const result = await getWorkspaces(
        req.user.id
    );

    return res.status(200).json(result);
};

const update = async (req, res) => {

    const result = await updateWorkspace(
        req.user.id,
        req.params.id,
        req.body
    );

    if (!result.success) {
        return res.status(404).json(result);
    }

    return res.status(200).json(result);
};
const remove = async (req, res) => {

    const result = await deleteWorkspace(
        req.user.id,
        req.params.id
    );

    if (!result.success) {
        return res.status(404).json(result);
    }

    return res.status(200).json(result);
};

module.exports = {
    create,
    getAll,
    update,
    remove
};