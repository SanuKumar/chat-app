const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, // prevent xss attacks cross-site scrripting attack, won't be able by javascript
    secure: process.env.NODE_ENV !== "chat_app", // http or not https
    sameSite: "strict", // CSRF attacks cross-site request forrgery attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days in millisecon
  });

  return token;
};

module.exports = generateToken;
