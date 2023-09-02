const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

// exports.detail = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const order = await Order.findOne({ _id: id }).lean();
//     const products = await Product.find().lean();
//     const user = await User.findOne({ email: order.idUser }).lean();
//     const information = {
//       idUser: user._id,
//       fullName: user.fullName,
//       phone: user.phoneNumber,
//       address: user.address,
//       total: order.total,
//     };
//     let result = [];
//     for (let i = 0; i < order.productArr.length; i++) {
//       let product = products.filter(
//         (value) => value._id == order.productArr[i].idProduct
//       )[0];

//       result.push({
//         idProduct: product._id,
//         imgProduct: product.img1,
//         nameProduct: product.name,
//         priceProduct: product.price,
//         count: order.productArr[i].quantity,
//       });
//     }

//     res.json({ information: information, cart: result });
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.histories = async (req, res) => {
//   const idUser = req.query.idUser;
//   const users = await User.find().lean();

//   try {
//     const order = idUser
//       ? await Order.find({ idUser: idUser }).lean()
//       : await Order.find().lean();

//     const result = order.map(function (x) {
//       const user = users.filter((value) => value.email == x.idUser)[0];
//       return {
//         idOrder: x._id,
//         idUser: idUser,
//         name: user.fullName,
//         phone: user.phoneNumber,
//         address: user.address,
//         total: x.total,
//         delivery: x.delivery,
//         status: x.status,
//       };
//     });

//     res.json(result);
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.placeOrder = async (req, res) => {
  const { idUser, productArr, delivery, status } = req.body;
  const products = await Product.find().lean();
  let total = 0;
  for (let i = 0; i < productArr.length; i++) {
    const product = products.filter((x) => x._id == productArr[i].idProduct)[0];
    total += product.price * productArr[i].quantity;
  }

  try {
    if (!idUser || !productArr || !delivery || !status) {
      res.json({
        message: "fill all",
      });
    } else {
      res.json({
        message: "Success",
        idUser: idUser,
        productArr: productArr,
        total: total,
        delivery: delivery,
        status: status,
      });
      Order.create({
        idUser,
        productArr,
        total,
        delivery,
        status,
      });
    }
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.sendEmail = async (req, res) => {
  const { idUser, productArr, phone, address, fullName, total } = req.body;

  console.log({ idUser, productArr, phone, address, fullName, total });
  function html(productArr) {
    return `
      <div className="table-responsive mb-4">
        <h2>Dear ${fullName}</h2>
        <p>Phone: ${phone}</p>
        <p>Address: ${address}</p>
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Product</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Image</strong>
              </th>

              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Price</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Quantity</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Amount</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            ${productArr.map(
              (value, index) =>
                `<tr className="text-center" key={index}>
                <td className="align-middle border-0">
                  <div className="media align-items-center justify-content-center">
                    ${value.nameProduct}
                  </div>
                </td>
                <td className="pl-0 border-0">
                  <div className="media align-items-center justify-content-center">
                    <img src=${value.img} alt="..." width="70" />
                  </div>
                </td>

                <td className="align-middle border-0">
                  <p className="mb-0 small">${value.priceProduct} VND</p>
                </td>
                <td className="align-middle border-0">
                  <div className="quantity justify-content-center">
                    <input
                      className="form-control form-control-sm border-0 shadow-0 p-0"
                      type="text"
                      value=${value.count}
                      onChange={handlerChangeText}
                    />
                  </div>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    ${parseInt(value.priceProduct) * parseInt(value.count)} VND
                  </p>
                </td>
              </tr>`
            )}
            <h2>Total ${parseInt(total)} VND</h2>
            <h2>Thank you very much!</h2>
          </tbody>
        </table>
      </div>`;
  }

  let transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key:
          "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",
      },
    })
  );

  transporter.sendMail({
    to: "tiendung2911@gmail.com",
    from: "BOUTIQUEShopDungptfx13091@gmail.com",
    subject: "Xác nhận đơn đặt hàng!",
    html: html(productArr),
  });
};
