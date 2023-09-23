const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      const token = jsonwebtoken.sign({ _id: user._id }, "mk");
      res.cookie("token", token, { httpOnly: true });

      res.setHeader("token", token).json({
        message: "Sucess!",
        user: user,
        isLogin: true,
        token: token,
      });
    } else {
      res.json({
        message: "Password Not Correct!",
        isLogin: false,
        invalidPassword: true,
      });
    }
  } catch (err) {
    res.json({
      message: "User Not Found!",
      isLogin: false,
      invalidUser: true,
    });
  }
};
