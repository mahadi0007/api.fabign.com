const { Schema, model } = require("mongoose");

const paymentRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    request_date: { type: String, trim: true },
    request_amount: { type: Number, trim: true },
    available_balance: { type: Number, trim: true },
    payoutStatus: [
      {
        status: {
          type: String,
          default: "Pending",
          enum: [
            "Pending",
            "Verified",
            "Processing",
            "Successful",
            "Failed",
            "Cancelled",
          ],
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

module.exports = model("PaymentRequest", paymentRequestSchema);
