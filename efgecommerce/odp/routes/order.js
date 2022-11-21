const route = require("express").Router();
const { Customer } = require("../../common/middleware/Permission");
const ODPOrderController = require("../controller/Order");

route.get("/", Customer, ODPOrderController.getAllOrder);
route.get("/:id", Customer, ODPOrderController.getSingleOrder);

module.exports = route;
