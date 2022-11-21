const { Customer } = require("../../../common/middleware/Permission");
const PaymentRequest = require("../controller/payment_request.controller");
const route = require("express").Router();

route.post("/", Customer, PaymentRequest.Store);
module.exports = route;
