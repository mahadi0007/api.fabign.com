const route = require("express").Router();
const { Customer } = require("../../common/middleware/Permission");
const PromoCodeController = require("../controller/PromoCode");
route.post("/findPromoCode", Customer, PromoCodeController.findPromoCode);
module.exports = route;
