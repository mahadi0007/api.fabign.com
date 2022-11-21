const ButtonType = require("../../../models/button_type2.model");
const { HostURL } = require("../../helpers");

// Default image
const Default = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    let results = await ButtonType.findOne({
      $and: [{ category: category_id }],
    });
    if (results && results.element_images) {
      results.element_images.forEach((elementImage, index) => {
        results.element_images[index].image =
          HostURL(req) +
          "uploads/button_type/element_images/" +
          elementImage.image;
      });
      return res.status(200).json({
        status: true,
        data: results,
      });
    } else {
      return res.status(200).json({
        status: true,
        data: results,
      });
    }
  } catch (error) {
    console.log("error");
    console.log(error);

    if (error) next(error);
  }
};

module.exports = {
  Default,
};
