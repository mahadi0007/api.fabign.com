const { Schema, model, models } = require("mongoose");
const CampaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    color: {
      type: String,
      trim: true,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    front: {
      type: String,
      default: null,
      trim: true,
    },
    back: {
      type: String,
      default: null,
      trim: true,
    },
    left: {
      type: String,
      default: null,
      trim: true,
    },
    right: {
      type: String,
      default: null,
      trim: true,
    },
    uploadImage: {
      front: [
        {
          image: { type: String, trim: true },
        },
      ],
      back: [
        {
          image: { type: String, trim: true },
        },
      ],
      left: [
        {
          image: { type: String, trim: true },
        },
      ],
      right: [
        {
          image: { type: String, trim: true },
        },
      ],
    },
    tags: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    salesGoal: {
      type: Number,
      default: null,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    estimatedProfit: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: null,
    },
    directUrl: {
      type: String,
      default: null,
      trim: true,
    },
    backView: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Disable", "Reject", "Pause", "Blocked"],
      trim: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "UserStore",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "odpproducts",
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: null,
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    avgRating: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4, 5],
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    ratingReview: [
      {
        type: Schema.Types.ObjectId,
        ref: "CampaignReview",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Validates unique title
 */
CampaignSchema.path("title").validate(async (title) => {
  const titleCount = await models.Campaign.countDocuments({ title });
  return !titleCount;
}, "Title already exists");

module.exports = model("Campaign", CampaignSchema, "campaign");
