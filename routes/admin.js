const { Router } = require("express");

const adminController = require("../controllers/admin");

const adminRouter = Router();

const { authUser } = require("../middleware/authUser");

adminRouter.post("/login", adminController.login);

module.exports = adminRouter;