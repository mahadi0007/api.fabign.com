const Measurement = require("../../../models/measurement2.model");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const { HostURL } = require("../../helpers");

const Index = async (req, res, next) => {
  try {
    // console.log("cateogry called")
    const { category } = req.params;

    await isMongooseId(category);

    const results = await Measurement.find(
      { category },
      { created_by: 0 }
    ).exec();

    const items = [];

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            measurement_name: element.measurement_name,
            category: element.category,
            measurementVideo: element.measurementVideo,
            variable_name: element.variable_name,
            size_xs: element.size_xs,
            size_s: element.size_s,
            size_m: element.size_m,
            size_l: element.size_l,
            size_xl: element.size_xl,
            size_xll: element.size_xll,
            measurementIcon:
              HostURL(req) +
              "uploads/measurements2/main_images/" +
              element.measurementIcon,
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
