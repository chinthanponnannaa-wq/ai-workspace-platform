const express = require("express");

const {
    create,
    getAll,
    update,
    remove
} = require("../controllers/workspace.controller");

const authMiddleware = require("../../../shared/middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    create
);

router.get(
    "/",
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