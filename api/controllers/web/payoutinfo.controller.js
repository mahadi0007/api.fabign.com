const PayoutInfo = require("../../../models/payout_info.model");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const results = await PayoutInfo.find({}, { created_by: 0 });
    res.status(200).json({
      status: true,
      data: results[0],
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  Index,
};
