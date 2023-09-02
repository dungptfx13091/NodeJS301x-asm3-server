const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  idUser: {
    type: String,
    required: true,
    ref: "User",
  },

  productArr: [
    {
      idProduct: {
        type: String,
        required: true,
        ref: "User",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  delivery: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
