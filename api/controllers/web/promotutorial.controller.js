const PromoTutorial = require("../../../models/promo_tutorial.model");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const results = await PromoTutorial.find({}, { created_by: 0 });
    res.status(200).json({
      status: true,
      data: results,
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  Index,
};
