const ODPColors = require("../../../models/odp_color.model");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const results = await ODPColors.find({}, { created_by: 0 });

    const items = [];

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            color_name: element.color_name,
            color_code: element.color_code,
          });
        }
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

module.exports = {
  Index,
};
