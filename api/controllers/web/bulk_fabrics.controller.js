const BulkFabrics = require("../../../models/bulk_fabrics.model");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const results = await BulkFabrics.find({}, { created_by: 0 }).populate(
      "colors"
    );

    const items = [];

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        const colors = [];
        for (let j = 0; j < element.colors.length; j++) {
          colors.push(element.colors[j].color_code);
        }

        if (element) {
          items.push({
            _id: element._id,
            fabric_name: element.fabric_name,
            description: element.description,
            size: element.size,
            moq: element.moq,
            colors,
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
