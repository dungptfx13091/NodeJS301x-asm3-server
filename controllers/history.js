const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

exports.detail = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findOne({ _id: id }).lean();
    const products = await Product.find().lean();
    const user = await User.findOne({ email: order.idUser }).lean();
    const information = {
      idUser: user._id,
      fullName: user.fullName,
      phone: user.phoneNumber,
      address: user.address,
      total: order.total,
    };
    let result = [];
    for (let i = 0; i < order.productArr.length; i++) {
      let product = products.filter(
        (value) => value._id == order.productArr[i].idProduct
      )[0];

      result.push({
        idProduct: product._id,
        imgProduct: product.img1,
        nameProduct: product.name,
        priceProduct: product.price,
        count: order.productArr[i].quantity,
      });
    }

    res.json({ information: information, cart: result });
  } catch (err) {
    console.log(err);
  }
};

exports.histories = async (req, res) => {
  try {
    const idUser = req.query.idUser;
    const users = await User.find().lean();
    const order = idUser
      ? await Order.find({ idUser: idUser }).lean()
      : await Order.find().lean();

    const result = order.map(function (x) {
      const user = users.filter((value) => value.email == x.idUser)[0];
      return {
        idOrder: x._id,
        idUser: idUser,
        name: user.fullName,
        phone: user.phoneNumber,
        address: user.address,
        total: x.total,
        delivery: x.delivery,
        status: x.status,
      };
    });

    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.find().lean();
    const order = await Order.find().lean();

    const result = order.map(function (x) {
      const user = users.filter((value) => value.email == x.idUser)[0];
      return {
        idOrder: x._id,
        idUser: x.idUser,
        name: user.fullName,
        phone: user.phoneNumber,
        address: user.address,
        total: x.total,
        delivery: x.delivery,
        status: x.status,
      };
    });

    res.json(result);
  } catch (err) {
    console.log(err);
  }
};
