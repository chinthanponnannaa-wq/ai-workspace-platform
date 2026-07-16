const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/routes/auth.routes");
const workspaceRoutes = require("../modules/workspace/routes/workspace.routes");

router.use("/auth", authRoutes);
router.use("/workspace", workspaceRoutes);

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Workspace Platform API v1"
    });
});

module.exports = router;