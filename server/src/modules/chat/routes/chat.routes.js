const express = require("express");

const {
    create,
    getAll,
    update,
    remove
} = require("../controllers/chat.controller");

const authMiddleware = require("../../../shared/middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    create
);

router.get(
    "/workspace/:workspaceId",
    authMiddleware,
    getAll
);

router.patch(
    "/:id",
    authMiddleware,
    update
);

router.delete(
    "/:id",
    authMiddleware,
    remove
);

module.exports = router;