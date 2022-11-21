const { Schema, model, models } = require("mongoose");

const campaignPromotionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
    promo_code: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    promo_amount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      trim: true,
      required: true,
    },
    endDate: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["apporved", "pending", "cancel"],
      trim: true,
    },
    redeemed: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Validates unique promo code
 */
campaignPromotionSchema.path("promo_code").validate(async (promo_code) => {
  const promoCodeCount = await models.CampaignPromotion.countDocuments({
    promo_code,
  });
  return !promoCodeCount;
}, "This promo code already exists");

module.exports = model("CampaignPromotion", campaignPromotionSchema);
