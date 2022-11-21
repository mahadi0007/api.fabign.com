const { Customer } = require("../../../common/middleware/Permission");
const Payout = require("../controller/payout");
const route = require("express").Router();

route.post("/add/", Customer, Payout.addNewPayout);
route.get("/get/", Customer, Payout.getPayout);
route.put("/update/:id", Customer, Payout.updatePayout);
module.exports = route;
