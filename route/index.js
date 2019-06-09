const express = require("express");
const router = express.Router();

const GraphqlRouter = require("./graphql");
const UserRouter = require("./users");
const { UserController } = require("../controller");

// to force graphql route to be only accessible by logged in users
// add UserController.requireLoggin before graphql router
router.use("/graphql", UserController.requireLoggin, GraphqlRouter);
router.use("/user", UserRouter);

module.exports = router;
