const express = require("express");

const {
    create,
    getAll,
    remove
} = require("../controllers/message.controller");

const authMiddleware = require("../../../shared/middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    create
);

router.get(
    "/chat/:chatId",
    authMiddleware,
    getAll
);

router.delete(
    "/:id",
    authMiddleware,
    remove
);

module.exports = router;