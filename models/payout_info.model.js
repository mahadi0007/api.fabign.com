const { Schema, model } = require("mongoose");

const payoutInfoSchema = new Schema(
  {
    payoutDate: {
      type: String,
      trim: true,
      required: true,
    },
    minimumBalance: {
      type: Number,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("PayoutInfo", payoutInfoSchema, "payout_info");
