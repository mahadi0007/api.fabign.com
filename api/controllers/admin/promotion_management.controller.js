const mongoose = require("mongoose");
const {
  success,
  failure,
  notFound,
} = require("../../../efgecommerce/common/helper/responseStatus");
const CampaignPromotion = require("../../../efgecommerce/models/UserDashBoard/campaignPromotion");

const Index = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = +page || 1;
    limit = +limit || 10;
    let total = await CampaignPromotion.countDocuments();
    const promotion = await CampaignPromotion.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "campaign",
        select: "title sellingPrice",
      })
      .lean();
    return promotion && promotion.length > 0
      ? success(res, "Promotion found", {
          page: page,
          limit: limit,
          total: total,
          promotion,
        })
      : notFound(res, "No Promotion found", {
          page: page,
          limit: limit,
          total: total,
          promotion,
        });
  } catch (error) {
    return failure(res, error.message, error);
  }
};

const Update = async (req, res, next) => {
  try {
    const { approve } = req.body;
    const { id } = req.params;

    const updatedPromotion = await CampaignPromotion.findByIdAndUpdate(id, {
      $set: {
        status: approve,
      },
    }).exec();

    return updatedPromotion
      ? success(res, "Promotion Approved", {
          approvedPromotion: updatedPromotion,
        })
      : notFound(res, "No Promotion Found");
  } catch (error) {
    console.log("error");
    console.log(error);
    return failure(res, error.message, error);
  }
};

const Delete = async (req, res) => {
  try {
    const { id } = req.params;
    /* Check promotion available or not */
    const is_available = await CampaignPromotion.findById(id);
    if (!is_available) {
      return res.status(404).json({
        status: false,
        message: "Promotion not available.",
      });
    }
    await CampaignPromotion.findByIdAndDelete(id);
    return res.status(200).json({
      status: true,
      message: "Successfully deleted.",
    });
  } catch (error) {
    return failure(res, error.message, error.stack);
  }
};

module.exports = {
  Index,
  Update,
  Delete,
};
