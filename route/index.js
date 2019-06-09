const express = require("express");
const router = express.Router();

const GraphqlRouter = require("./graphql");
const UserRouter = require("./users");
const { UserController } = require("../controller");

router.use("/graphql", UserController.validateMiddleware, GraphqlRouter);
router.use("/user", UserRouter);

module.exports = router;
