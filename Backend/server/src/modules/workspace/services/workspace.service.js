const Workspace = require("../models/Workspace");

const createWorkspace = async (userId, workspaceData) => {

    const workspace = await Workspace.create({
        title: workspaceData.title,
        owner: userId
    });

    return {
        success: true,
        message: "Workspace created successfully",
        workspace
    };
};

const getWorkspaces = async (userId) => {

    const workspaces = await Workspace.find({
        owner: userId
    });

    return {
        success: true,
        message: "Workspaces fetched successfully",
        workspaces
    };
};
const updateWorkspace = async (userId, workspaceId, workspaceData) => {

    const workspace = await Workspace.findOneAndUpdate(
        {
            _id: workspaceId,
            owner: userId
        },
        {
            title: workspaceData.title
        },
        {
            new: true
        }
    );

    if (!workspace) {
        return {
            success: false,
            message: "Workspace not found"
        };
    }

    return {
        success: true,
        message: "Workspace updated successfully",
        workspace
    };
};
const deleteWorkspace = async (userId, workspaceId) => {

    const workspace = await Workspace.findOneAndDelete(
        {
            _id: workspaceId,
            owner: userId
        }
    );

    if (!workspace) {
        return {
            success: false,
            message: "Workspace not found"
        };
    }

    return {
        success: true,
        message: "Workspace deleted successfully"
    };
};

module.exports = {
    createWorkspace,
    getWorkspaces,
    updateWorkspace,
    deleteWorkspace
};