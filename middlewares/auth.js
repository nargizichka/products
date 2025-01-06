const jwt = require("jsonwebtoken");

const tokenVerify = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const userData = jwt.verify(token, "jwtPrivateKey");
    req.user = userData;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = tokenVerify;
