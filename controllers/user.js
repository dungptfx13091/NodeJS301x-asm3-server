const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

exports.findAll = async (req, res) => {
  const user = await User.find().lean();
  res.json(user);
};

exports.register = async (req, res) => {
  const { fullName, password, phoneNumber, email, role } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    if (!password || !fullName || !email) {
      res.json({
        message: "fill all",
      });
    } else {
      const oldUser = await User.findOne({ email: email });
      if (oldUser) {
        res.json({
          message: "already exists",
          oldUser: true,
        });
      } else {
        res.json({
          isRegister: true,
          password: password,
          fullName: fullName,
          address: "Apartment",
          phoneNumber: phoneNumber,
          email: email,
          role: role,
        });
        User.create({
          password: encryptedPassword,
          fullName: fullName,
          address: "Apartment",
          phoneNumber: phoneNumber,
          email: email,
          role: role,
        });
      }
    }
  } catch (err) {
    res.send({ status: "err" });
  }
};

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

exports.getDetail = async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findOne({ email: req.params.id }).lean();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.json({ status: "err" });
  }
};
