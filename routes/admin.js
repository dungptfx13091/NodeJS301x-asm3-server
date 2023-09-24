const { Router } = require("express");

const adminController = require("../controllers/admin");

const adminRouter = Router();

const authAdmin = require("../middleware/authAdmin");

adminRouter.post("/admin/login", adminController.login);
adminRouter.get("/admin/auth", authAdmin, (req, res) => {
  res.json({ authentication: true });
});
module.exports = adminRouter;
