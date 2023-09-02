const { Router } = require("express");
const orderRouter = Router();

const orderController = require("../controllers/order");

// orderRouter.get("/orders/:id", orderController.detail);
// orderRouter.get("/orders/", orderController.histories);
orderRouter.post("/orders/add", orderController.placeOrder);
orderRouter.post("/email", orderController.sendEmail);

module.exports = orderRouter;
