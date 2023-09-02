const { Router } = require("express");
const cartRouter = Router();

const cartController = require("../controllers/cart");

cartRouter.get("/carts", cartController.detail);
cartRouter.post("/carts/add", cartController.add);
cartRouter.put("/carts/update", cartController.update);
cartRouter.delete("/carts/delete", cartController.delete);

module.exports = cartRouter;
