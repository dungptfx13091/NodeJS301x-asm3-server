const { Router } = require("express");
const historyRouter = Router();

const historyController = require("../controllers/history");

historyRouter.get("/histories/all", historyController.getAll);
historyRouter.get("/histories/:id", historyController.detail);
historyRouter.get("/histories/", historyController.histories);

module.exports = historyRouter;
