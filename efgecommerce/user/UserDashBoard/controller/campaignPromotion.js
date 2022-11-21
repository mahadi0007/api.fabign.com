const mongoose = require("mongoose");
const CampaignPromotion = require("../../../models/UserDashBoard/campaignPromotion");
const { success, failure } = require("../../../common/helper/responseStatus");

const CampaignPromotionController = {
  addNewPromotion: async (req, res, next) => {
    try {
      const user = req.user.id;
      const existPromotion = await CampaignPromotion.countDocuments({
        campaign: mongoose.Types.ObjectId(req.body.campaign),
      });
      if (existPromotion) {
        return failure(res, "Promotion already used for this campaign.", {});
      }
      let newPromotion = new CampaignPromotion({
        user,
        ...req.body,
      });
      newPromotion = await newPromotion.save();
      return success(res, "Promotion Created", newPromotion);
    } catch (error) {
      console.log(error);
      return failure(res, error.message, {});
    }
  },
  getAllPromotion: async (req, res, next) => {
    try {
      let { page, limit } = req.query;
      let query = {};
      query.user = req.user.id;
      let total = await CampaignPromotion.countDocuments(query);
      page = page ? +page : 1;
      limit = limit ? (limit == "total" ? total : +limit) : 10;

      let promotion = await CampaignPromotion.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "user",
          select: "name email phone",
        })
        .populate({
          path: "campaign",
          select: "title sellingPrice",
        })
        .lean();
      return success(res, "Request successfull", {
        page: page,
        limit: limit,
        total: total,
        promotion: promotion,
      });
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
};

module.exports = CampaignPromotionController;
