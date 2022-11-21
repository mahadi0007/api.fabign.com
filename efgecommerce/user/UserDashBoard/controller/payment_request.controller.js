const PaymentRequest = require("../../../models/UserDashBoard/paymentRequest");
const Payout = require("../../../models/UserDashBoard/Payout");
const validator = require("../../../../api/validators/payment_request.validator");
const { RedisClient } = require("../../../../api/cache");
const mongoose = require("mongoose");

// Store an item
const Store = async (req, res, next) => {
  try {
    const user = req.user.id;
    const { request_amount, request_date, available_balance } = req.body;

    const payoutStatus = JSON.parse(req.body.payoutStatus);

    // Validate check
    const validate = await validator.Store(req.body);
    if (!validate.isValid) {
      return res.status(422).json({
        status: false,
        message: validate.error,
      });
    }

    const newPaymentRequest = new PaymentRequest({
      request_amount,
      request_date,
      available_balance,
      payoutStatus,
      user,
    });

    await Payout.updateOne(
      { user: mongoose.Types.ObjectId(user) },
      {
        $push: {
          payment_request: newPaymentRequest._id,
        },
      }
    );

    await newPaymentRequest.save();
    await RedisClient.flushdb();

    res.status(201).json({
      status: true,
      message: "Successfully payment request created.",
    });
  } catch (error) {
    console.log(error);
    if (error) next(error);
  }
};

module.exports = {
  Store,
};
