const mongoose = require("mongoose");
const {
  success,
  failure,
  notFound,
} = require("../../../efgecommerce/common/helper/responseStatus");
const PromoTutorial = require("../../../models/promo_tutorial.model");

const Index = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = +page || 1;
    limit = +limit || 10;
    let total = await PromoTutorial.countDocuments();
    const promoTutorial = await PromoTutorial.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return promoTutorial && promoTutorial.length > 0
      ? success(res, "Promo Tutorial found", {
          page: page,
          limit: limit,
          total: total,
          promoTutorial,
        })
      : notFound(res, "No Promotion found", {
          page: page,
          limit: limit,
          total: total,
          promoTutorial,
        });
  } catch (error) {
    return failure(res, error.message, error);
  }
};

// Show specific item
const Show = async (req, res, next) => {
  try {
    const promoTutorial = await PromoTutorial.findOne({
      _id: req.params.id,
    });
    return promoTutorial
      ? success(res, "Promo Tutorial Found", promoTutorial)
      : notFound(res, "No content found", {});
  } catch (error) {
    return failure(res, error.message, {});
  }
};

const Update = async (req, res, next) => {
  try {
    const { url } = req.body;
    const { id } = req.params;

    const updatedPromoTutorial = await PromoTutorial.findByIdAndUpdate(id, {
      $set: {
        url,
      },
    }).exec();

    return updatedPromoTutorial
      ? success(res, "Promo Tutorial Updated", {
          updatedPromoTutorial,
        })
      : notFound(res, "No Promo Tutorial Found");
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
