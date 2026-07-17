const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Chat", chatSchema);