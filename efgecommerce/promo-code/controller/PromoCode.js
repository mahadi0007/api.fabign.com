const {
  success,
  failure,
  notFound,
} = require("../../common/helper/responseStatus");
const CampaignPromotion = require("../../models/UserDashBoard/campaignPromotion");

class PromoCodeController {
  async findPromoCode(req, res, next) {
    try {
      const { promo_code } = req.body;
      let promoCode = await CampaignPromotion.findOne({
        promo_code,
      }).lean({});
      return promoCode
        ? success(res, "Fetched promo code", promoCode)
        : notFound(res, "No content found", {});
    } catch (error) {
      console.log("error");
      console.log(error);
      return failure(res, error.message, error);
    }
  }
}

module.exports = new PromoCodeController();
