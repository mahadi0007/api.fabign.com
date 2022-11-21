const { Customer } = require("../../../common/middleware/Permission");
const CampaignPromotion = require("../controller/campaignPromotion");

const route = require("express").Router();

route.post("/add/", Customer, CampaignPromotion.addNewPromotion);
route.get("/getall/", Customer, CampaignPromotion.getAllPromotion);
module.exports = route;
