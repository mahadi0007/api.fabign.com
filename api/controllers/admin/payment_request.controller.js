const {
  success,
  failure,
} = require("../../../efgecommerce/common/helper/responseStatus");
const PaymentRequest = require("../../../efgecommerce/models/UserDashBoard/paymentRequest");
const Payout = require("../../../efgecommerce/models/UserDashBoard/Payout");
const Store = require("../../../efgecommerce/models/UserDashBoard/Store");
const mongoose = require("mongoose");

// List of items
const Index = async (req, res, next) => {
  try {
    const results = await PaymentRequest.find({}, { created_by: 0 });
    const items = [];
    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        const store = await Store.findOne({ user: element.user });
        items.push({
          _id: element._id,
          request_amount: element.request_amount,
          request_date: element.request_date,
          available_balance: element.available_balance,
          user: element.user,
          store: store.title,
        });
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Show specific item
const Show = async (req, res, next) => {
  try {
    const paymentRequest = await PaymentRequest.findOne({
      _id: req.params.id,
    });
    const payout = await Payout.findOne({
      user: paymentRequest.user,
    })
      .populate({
        path: "payment_request",
        select: "request_date request_amount payoutStatus",
      })
      .lean();

    const result = {
      payoutStatus: paymentRequest.payoutStatus,
      _id: paymentRequest._id,
      request_amount: paymentRequest.request_amount,
      request_date: paymentRequest.request_date,
      available_balance: paymentRequest.available_balance,
      user: paymentRequest.user,
      bank: payout.bank,
      bkash: payout.bkash,
      other: payout.other,
      payment_request: payout.payment_request,
    };

    return result
      ? success(res, "Payment Request Found", result)
      : notFound(res, "No content found", {});
  } catch (error) {
    return failure(res, error.message, {});
  }
};

// Update specific item
const Update = async (req, res) => {
  try {
    let { ...updateObj } = req.body;
    let { id } = req.params;
    const status = [
      "Pending",
      "Verified",
      "Processing",
      "Successful",
      "Failed",
      "Cancelled",
    ];
    const find = await PaymentRequest.findOne({
      _id: mongoose.Types.ObjectId(id),
    });
    if (find.payoutStatus.some((el) => el.status === updateObj.status)) {
      for (
        let i = status.indexOf(updateObj.status) + 1;
        i < status.length;
        i++
      ) {
        if (find.payoutStatus.some((el) => el.status === status[i])) {
          await PaymentRequest.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            {
              $pull: {
                payoutStatus: {
                  _id: find.payoutStatus.find((el) => el.status === status[i])
                    ._id,
                },
              },
            }
          ).exec();
        }
      }
      await PaymentRequest.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
          "payoutStatus.status": updateObj.status,
        },
        {
          $set: {
            "payoutStatus.$.time": new Date(),
          },
        }
      );
    } else {
      await PaymentRequest.findByIdAndUpdate(
        { _id: id },
        {
          $push: {
            payoutStatus: {
              status: updateObj.status,
              time: new Date(),
            },
          },
        }
      );
    }
    const paymentRequest = await PaymentRequest.findOne({
      _id: mongoose.Types.ObjectId(id),
    });
    return success(res, "Successfully Updated Payment Request", paymentRequest);
  } catch (error) {
    return failure(res, error.message, error);
  }
};

module.exports = {
  Index,
  Show,
  Update,
};
