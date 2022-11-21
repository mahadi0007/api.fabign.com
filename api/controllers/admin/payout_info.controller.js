const {
  success,
  failure,
  notFound,
} = require("../../../efgecommerce/common/helper/responseStatus");
const PayoutInfo = require("../../../models/payout_info.model");

const Index = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = +page || 1;
    limit = +limit || 10;
    let total = await PayoutInfo.countDocuments();
    const payoutInfo = await PayoutInfo.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return payoutInfo && payoutInfo.length > 0
      ? success(res, "Payout Info found", {
          page: page,
          limit: limit,
          total: total,
          payoutInfo,
        })
      : notFound(res, "No Payout Info found", {
          page: page,
          limit: limit,
          total: total,
          payoutInfo,
        });
  } catch (error) {
    return failure(res, error.message, error);
  }
};

// Show specific item
const Show = async (req, res, next) => {
  try {
    const payoutInfo = await PayoutInfo.findOne({
      _id: req.params.id,
    });
    return payoutInfo
      ? success(res, "Payout Info Found", payoutInfo)
      : notFound(res, "No content found", {});
  } catch (error) {
    return failure(res, error.message, {});
  }
};

const Update = async (req, res, next) => {
  try {
    let { ...updateObj } = req.body;
    const { id } = req.params;

    const updatedPayoutInfo = await PayoutInfo.findByIdAndUpdate(id, {
      $set: updateObj,
    }).exec();

    return updatedPayoutInfo
      ? success(res, "Payout Info Updated", {
          updatedPayoutInfo,
        })
      : notFound(res, "No Payout Info Found");
  } catch (error) {
    console.log("error");
    console.log(error);
    return failure(res, error.message, error);
  }
};

module.exports = {
  Index,
  Show,
  Update,
};
