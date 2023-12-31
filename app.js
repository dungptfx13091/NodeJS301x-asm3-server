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
const adminRouter = require("./routes/admin");

const app = express();

app.enable("trust proxy", 1);
app.get("/", (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});
app.use(
  cors({
    origin: [
      "https://asm3-client-app.vercel.app",
      "https://asm3-admin-app.vercel.app",
      "https://asm3-client-app.netlify.app",
      "https://asm3-admin-app.netlify.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET,POST,PUT,PATH,DELETE,OPTIONS"],
    credentials: true,
  })
);
// app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);
app.use(historyRouter);
app.use(adminRouter);

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
