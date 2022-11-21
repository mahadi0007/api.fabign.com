const { Customer } = require("../../../common/middleware/Permission");
const CampaignReview = require("../controller/campaignReview");

const route = require("express").Router();

route.post("/add/", Customer, CampaignReview.addNewRating);
route.get("/get/", CampaignReview.getRating);
module.exports = route;
