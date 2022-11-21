const route = require("express").Router();
const { Customer } = require("../../common/middleware/Permission");
const { Admin } = require("../../../api/middleware/permission.middleware");
const BulkOrderController = require("../controller/Order");

route.get("/", Admin, BulkOrderController.getAllOrder);
route.post("/", Customer, BulkOrderController.placeOrder);
route.get("/:id", Admin, BulkOrderController.getSingleOrder);
route.put("/:id", Admin, BulkOrderController.updateOrder);
route.delete("/:id", Admin, BulkOrderController.deleteOrder);
// route.post("/bkashPaymentPlace", Customer, OrderController.placeBkashPayment);
// route.post(
//   "/bkashPaymentExecute",
//   Customer,
//   OrderController.executeBkashPayment
// );
// route.post("/successSSLPayment", OrderController.successSSLPayment);
// route.post("/failSSLPayment", OrderController.failSSLPayment);
// route.post("/cancelSSLPayment", OrderController.cancelSSLPayment);

module.exports = route;
