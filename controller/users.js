const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

var users = [];

exports.singup = (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res
      .status(400)
      .json({ message: "name, username and password are required." });
  }

  if (users.some(item => item.username === username)) {
    return res.status(400).json({ message: "username already exists." });
  }

  const hashPassword = bcrypt.hashSync(password, 10);
  users.push({ username, hashPassword, name });
  return res.status(201).json({ message: "registered successfully." });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "name, username and password are required." });
  }

  const user = users.find(
    item =>
      item.username === username &&
      bcrypt.compareSync(password, item.hashPassword)
  );

  if (user) {
    var token = jwt.sign({ username: user.username }, config.PRIVATE_KEY);
    const data = { ...user, token };
    delete data.hashPassword;
    return res.status(200).json(data);
  } else {
    return res
      .status(401)
      .json({ message: "username and password are incorrect." });
  }
};

exports.validateMiddleware = (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ").length > 1
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(token, config.PRIVATE_KEY);
      if (payload) {
        const user = users.find(user => user.username === payload.username);
        if (user) {
          req.user = user;
          return next();
        }
      }
      return res.status(401).json({
        error: true,
        message: "Incorrect token."
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Internal error."
    });
  }
};
