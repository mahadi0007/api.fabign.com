const Element = require("../../../models/element2.model");
const { HostURL } = require("../../helpers");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");

// All elements
const All = async (req, res, next) => {
  try {
    // console.log("Element All");
    const items = [];
    const { category } = req.params;
    await isMongooseId(category);

    const results = await Element.find(
      { $and: [{ category }, { is_deleted: false }] },
      {
        deleted_by: 0,
        deleted_at: 0,
        created_by: 0,
        createdAt: 0,
        updatedAt: 0,
        main_image: 0,
      }
    )
      // .populate("size", "title height width description")
      // .populate("rating")
      .populate("sub_category", "title _id")
      // .populate("company")
      .sort({ _id: -1 })
      .exec();

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        items.push({
          _id: element._id,
          title: element.title,
          price: element.price,
          is_hidden: element.is_hidden,
          stock_status: element.stock_status,
          quality: element.quality,
          priority: element.priority,
          sub_category: element.sub_category._id,
          sub_title: element.sub_category.title,
          width: element.width,
          height: element.height,
          // rating:
          // element.rating && element.rating.length > 0 ? element.rating : 0,
          title_image:
            HostURL(req) +
            "uploads/elements2/title_images/" +
            element.title_image,
          element_image:
            HostURL(req) +
            "uploads/elements2/element_image/" +
            element.element_image,
          shadow_image:
            HostURL(req) +
            "uploads/elements2/shadow_image/" +
            element.shadow_image,
        });
      }
    }

    // Set data to cache
    const key = "elements-" + category;
    RedisClient.setex(key, 3600, JSON.stringify(items));

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    console.log(error);
    if (error) next(error);
  }
};

// Elements by sub-category or leaf-category
const Index = async (req, res, next) => {
  try {
    const items = [];
    let dbQueryOption = {};
    let { page } = req.query;
    const { type, id } = req.params;

    if (!page || page <= 0) page = 1;
    await isMongooseId(id);

    if (type === "leaf") {
      dbQueryOption.leaf_category = id;
    } else if (type === "sub") {
      dbQueryOption.sub_category = id;
    } else {
      return res.status(422).json({
        status: false,
        message: `${type} isn't valid!`,
      });
    }

    const results = await Element.find(
      {
        $and: [{ is_deleted: false }, { ...dbQueryOption }],
      },
      {
        deleted_by: 0,
        deleted_at: 0,
        created_by: 0,
        createdAt: 0,
        updatedAt: 0,
        main_image: 0,
        description: 0,
        color: 0,
      }
    )
      .populate("size", "title height width description")
      // .populate("rating")
      // .populate("brand")
      // .populate("company")
      .sort({ _id: -1 })
      .skip(parseInt(page) * 10 - 10)
      .limit(10)
      .exec();

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        items.push({
          _id: element._id,
          slug: element.slug,
          title: element.title,
          sub_title: element.sub_title,
          price: element.price,
          is_hidden: element.is_hidden,
          stock_status: element.stock_status,
          quality: element.quality,
          weave: element.weave,
          weight: element.weight,
          composition: element.composition,
          size: element.size,
          // rating:
          // element.rating && element.rating.length > 0 ? element.rating : 0,
          // brand: element.brand ? element.brand.name : null,
          // company: element.company ? element.company.name : null,
          title_image:
            HostURL(req) +
            "uploads/elements/title_images/" +
            element.title_image,
        });
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
  All,
  Index,
};
