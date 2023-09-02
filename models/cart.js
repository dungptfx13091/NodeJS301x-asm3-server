const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  count: {
    type: Number,
    required: true,
  },
  idProduct: {
    type: String,
    required: true,
    ref: "Product",
  },
  idUser: {
    type: String,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Cart", cartSchema);
