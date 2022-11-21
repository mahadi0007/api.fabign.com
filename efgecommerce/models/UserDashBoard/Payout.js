const { Schema, model } = require("mongoose");

const payoutSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bank: {
      account_name: { type: String, trim: true },
      account_number: { type: String, trim: true },
      bank_name: { type: String, trim: true },
      branch_district: { type: String, trim: true },
      brach_name: { type: String, trim: true },
    },
    bkash: {
      account_number: { type: String, trim: true },
    },
    other: {
      payment_method: { type: String, trim: true },
      account_number: { type: String, trim: true },
    },
    pendingBalance: { type: Number, trim: true, default: 0 },
    totalPayout: { type: Number, trim: true, default: 0 },
    totalProfit: { type: Number, trim: true, default: 0 },
    payment_request: [
      {
        type: Schema.Types.ObjectId,
        ref: "PaymentRequest",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Payout", payoutSchema);
