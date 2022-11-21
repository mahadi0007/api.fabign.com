const Backside_Element = require("../../../models/backside_element2.model");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const { HostURL } = require("../../helpers");
/* List of items */
const Index = async (req, res, next) => {
  try {
    const items = [];
    const { category } = req.params;

    await isMongooseId(category);

    const results = await Backside_Element.find(
      { category },
      {
        created_by: 0,
        createdAt: 0,
        updatedAt: 0,
        main_image: 0,
      }
    ).populate("category", { title: 1 });

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        items.push({
          _id: element._id,
          title: element.title,
          priority: element.priority,
          category: element.category,
          is_default: element.is_default,
          title_image:
            HostURL(req) +
            "uploads/backside_elements2/title_images/" +
            element.title_image,
          element_image:
            HostURL(req) +
            "uploads/backside_elements2/element_image/" +
            element.element_image,
          shadow_image:
            HostURL(req) +
            "uploads/backside_elements2/shadow_image/" +
            element.shadow_image,
        });
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    console.log("error");
    console.log(error);
    if (error) next(error);
  }
};

module.exports = {
  Index,
};
