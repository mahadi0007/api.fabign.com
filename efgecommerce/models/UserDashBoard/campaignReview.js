const { Schema, model } = require("mongoose");

const campaignReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: {
      type: [String],
      default: [],
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
    orderId: {
      type: String,
      trim: true,
      required: true,
    },
    rating: {
      type: Number,
      trim: true,
      default: null,
    },
    review: {
      type: String,
      trim: true,
      default: "",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    reply: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          default: "",
        },
        time: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("CampaignReview", campaignReviewSchema);
