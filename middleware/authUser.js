const jsonwebtoken = require("jsonwebtoken");

const authUser = (req, res, next) => {
  const token = req.headers.authentication?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied", authentication: false });
  try {
    const verified = jsonwebtoken.verify(token, "mk");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ messag: "Invalid Token", authentication: false });
  }
};

module.exports = authUser;
