const { Router } = require("express");
const productRouter = Router();

const { authRole } = require("../middleware/authRole");

const productController = require("../controllers/product");

productRouter.get("/products", productController.findAll);
productRouter.get("/products/pagination", productController.paginatedProduct);
productRouter.post("/products/add", authRole(0), productController.add);
productRouter.get("/products/:tagId", productController.detail);

module.exports = productRouter;
