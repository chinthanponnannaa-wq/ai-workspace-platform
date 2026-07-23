const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/routes/auth.routes");
const workspaceRoutes = require("../modules/workspace/routes/workspace.routes");
const chatRoutes = require("../modules/chat/routes/chat.routes");
const messageRoutes = require("../modules/message/routes/message.routes");
const aiRoutes = require("../modules/ai/routes/ai.routes");

router.use("/auth", authRoutes);
router.use("/workspace", workspaceRoutes);
router.use("/chat", chatRoutes);
router.use("/message", messageRoutes);
router.use("/ai", aiRoutes);

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Workspace Platform API v1"
    });
});

module.exports = router;