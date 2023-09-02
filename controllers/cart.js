const mongoose = require("mongoose");

const Cart = require("../models/cart");
const Product = require("../models/product");

exports.detail = async (req, res) => {
  const idUser = req.query.idUser;
  const products = await Product.find().lean();

  try {
    const cart = await Cart.find({ idUser: idUser }).lean();
    const result = cart.map(function (value) {
      const product = products.filter((x) => {
        if (x._id.toString() == value.idProduct) return x;
      })[0];
      return {
        idUser: value.idUser,
        idProduct: value.idProduct,
        count: value.count,
        img: product.img1,
        nameProduct: product.name,
        priceProduct: product.price,
      };
    });
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

exports.add = async (req, res) => {
  const { count, idProduct, idUser } = req.body;
  try {
    if (!count || !idProduct || !idUser) {
      res.json({
        message: "fill all",
      });
    } else {
      const oldCart = await Cart.findOne({
        idUser: idUser,
        idProduct: idProduct,
      }).lean();
      console.log(oldCart);
      if (oldCart) {
        const updateCart = await Cart.findOneAndUpdate(
          {
            idUser: idUser,
            idProduct: idProduct,
          },
          { count: oldCart.count + count }
        ).lean();
        res.json({
          message: "updated",
          count: oldCart.count + count,
          idProduct: idProduct,
          idUser: idUser,
        });
      } else {
        res.json({
          message: "Success",
          count: count,
          idProduct: idProduct,
          idUser: idUser,
        });
        Cart.create({
          count,
          idProduct,
          idUser,
        });
      }
    }
  } catch (err) {
    // console.log(err);
    res.send({ status: "err" });
  }
};

exports.update = async (req, res) => {
  const { idUser, idProduct, count } = req.body;

  try {
    const updatedCart = await Cart.findOneAndReplace(
      {
        idUser: idUser,
        idProduct: idProduct,
      },
      { idUser: idUser, idProduct: idProduct, count: count }
    ).lean();
    res.json(updatedCart);
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "err" });
  }
};

exports.delete = async (req, res, next) => {
  const idUser = req.query.idUser;
  const idProduct = req.query.idProduct;

  const cart = await Cart.find({ idUser: idUser }).lean();

  try {
    Cart.findOneAndDelete({
      idUser: idUser,
      idProduct: idProduct,
    })
      .exec()
      .then((doc) => {
        if (!doc) {
          return res
            .status(400)
            .json({ canDelete: true, isDeleted: false, cart: cart });
        } else {
          console.log(doc);
          // cart.splice(
          //   cart.findIndex((x) => x.name === doc.name),
          //   1
          // );
          return res
            .status(200)
            .json({ canDelete: true, isDeleted: true, cart: cart });
        }
      });
  } catch (err) {
    res.send({ status: "err" });
  }
};
