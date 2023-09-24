const jsonwebtoken = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
  const token = req.headers.authentication?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied", authentication: false });
  try {
    const verified = jsonwebtoken.verify(token, "admin");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ messag: "Invalid Token", authentication: false });
  }
};

module.exports = authAdmin;
