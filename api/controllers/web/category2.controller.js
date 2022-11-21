const Category = require("../../../models/category2.model");
const { HostURL } = require("../../helpers");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");

// List of items
const Index = async (req, res, next) => {
  try {
    const items = [];

    const results = await Category.find(
      { is_hidden: false },
      {
        sub_categories: 0,
        created_by: 0,
      }
    ).exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            title_image:
              HostURL(req) +
              "uploads/category2/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/category2/main_images/" +
              element.main_image,
          });
        }
      }
    }

    // set data to cache
    // RedisClient.setex("categories", 3600, JSON.stringify(items));

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};
// Get Type
const CategoryType = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(id);

    await isMongooseId(id);

    const result = await Category.findById(id);

    const item = {
      _id: result._id,
      title: result.title,
    };

    // set data to cache
    // RedisClient.setex("category", 3600, JSON.stringify(item));

    res.status(200).json({
      status: true,
      data: item,
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  Index,
  CategoryType,
};
