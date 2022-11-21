const { Customer } = require("../../../common/middleware/Permission");
const Campaign = require("../controller/campaign");

const route = require("express").Router();

route.post("/create/", Customer, Campaign.addNewCampaign);
route.get("/single/:url", Campaign.getCampaignByUrl);
route.get("/get/all/", Customer, Campaign.getAllCampaign);
route.put("/update/:id", Customer, Campaign.updateCampaign);
route.delete("/delete/:id", Customer, Campaign.deleteCampaign);
route.get(
  "/stat/count-user-all-status-campaign",
  Customer,
  Campaign.getCampaignCounterOfUser
);
route.post("/file-upload", Campaign.uploadFile);
module.exports = route;
