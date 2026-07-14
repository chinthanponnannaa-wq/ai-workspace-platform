const express = require("express");

const router = express.Router();

const authRoutes = require("../modules/auth/routes/auth.routes");

router.use("/auth", authRoutes);

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Workspace Platform API v1"
    });
});

module.exports = router;