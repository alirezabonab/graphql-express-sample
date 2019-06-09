const express = require("express");
const router = express.Router();
const { UserController } = require("../controller");

router.post("/signup", UserController.singup);

router.post("/login", UserController.login);


module.exports = router;
