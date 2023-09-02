const { Router } = require("express");

const userController = require("../controllers/user");

const userRouter = Router();

const { authUser } = require("../middleware/authUser");

userRouter.get("/users/:id", userController.getDetail);
userRouter.get("/users", userController.findAll);
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

module.exports = userRouter;
