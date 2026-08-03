const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/ai.controller");
const auth = require("../../../shared/middlewares/auth.middleware");

router.post("/chat", auth, chat);

module.exports = router;