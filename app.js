const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const historyRouter = require("./routes/history");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);
app.use(historyRouter);

app.use("/", (req, res) => {
  console.log("Page Not Found");
  res.status(404).send("Page Not Found");
});

//Connect to mongoBD
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started");
});
const io = require("./socket").init(server);
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});