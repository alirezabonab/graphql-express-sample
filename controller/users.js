const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

/* 
 * our mock and in memory user collection 
 */
var users = [];


/*  
 *  This method is a simple Request Handler which accepts  
 *  { username, password, name } in body and register that user 
 *  into our in memory user collection 
 *  during this registeration it will hash the password and instead of 
 *  saving Raw password we save hashed password into collection 
 */
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
  // create hash password 
  const hashPassword = bcrypt.hashSync(password, 10);
  users.push({ username, hashPassword, name });
  return res.status(201).json({ message: "registered successfully." });
};


/*  
 *  This methos is a Request Handler which accepts 
 *  {username , password} in body and looks into our in memory user collection
 *  if it found the user it will try to compare hash password with the password 
 *  user has provided, in case username and password are correct it will generate
 *  JWT token and sends it to the client in response
 */
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


/* 
 * This method acts as middleware on routes we want to validate for user 
 * has already logged in or not, if user is logged in and the token is found in header
 * it will goes to next middleware and if user has not logged in it will return 
 * 401 with Incorect Token message
 */
exports.requireLoggin = (req, res, next) => {
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
