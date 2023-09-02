const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

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
  .connect(
    "mongodb+srv://dungptfx13091:eNrQbIF1jMq8td8m@cluster0.5obi4ll.mongodb.net/asm_3?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(5000, () => {
  console.log("Server Started");
});
const io = require("./socket").init(server);
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});
