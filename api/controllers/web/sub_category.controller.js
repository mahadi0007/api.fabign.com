const Button = require("../../../models/button.model");
const SubCategory = require("../../../models/sub_category.model");
const Category = require("../../../models/category.model");
const { HostURL } = require("../../helpers");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");

// List of items
const Index = async (req, res, next) => {
  try {
    // console.log("Index subcategory");
    const items = [];
    const buttons = [];
    const { category } = req.params;

    await isMongooseId(category);

    // Button results
    const button_results = await Button.find(
      { category },
      {
        main_image: 0,
        created_by: 0,
        description: 0,
        color: 0,
        category: 0,
        assign_to: 0,
      }
    );

    if (button_results && button_results.length > 0) {
      for (let i = 0; i < button_results.length; i++) {
        const element = button_results[i];

        buttons.push({
          _id: element._id,
          element_type: "button",
          slug: element.slug,
          title: element.title,
          sub_title: element.sub_title,
          price: element.price,
          is_hidden: element.is_hidden,
          stock_status: element.stock_status,
          is_default: element.is_default,
          title_image:
            HostURL(req) + "uploads/button/title_image/" + element.title_image,
        });
      }
    }

    // Sub category results
    const results = await SubCategory.find(
      { main_category: category },
      { slug: 1, title: 1, is_hidden: 1, title_image: 1, leaf_categories: 1 }
    )
      .populate("leaf_categories", "slug title is_hidden title_image")
      .populate({
        path: "elements",
        select: {
          deleted_by: 0,
          deleted_at: 0,
          created_by: 0,
          createdAt: 0,
          updatedAt: 0,
          main_image: 0,
          description: 0,
          color: 0,
        },
      })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length > 0) {
      // console.log("results");
      // console.log(results);
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        const leaf_items = [];
        const element_items = [];

        if (element.leaf_categories && element.leaf_categories.length > 0) {
          for (let i = 0; i < element.leaf_categories.length; i++) {
            const leaf_element = element.leaf_categories[i];

            leaf_items.push({
              _id: leaf_element._id,
              slug: leaf_element.slug,
              title: leaf_element.title,
              is_hidden: leaf_element.is_hidden,
              title_image:
                HostURL(req) +
                "uploads/leaf_category/title_images/" +
                leaf_element.title_image,
            });
          }
        }

        if (element.elements && element.elements.length > 0) {
          for (let i = 0; i < element.elements.length; i++) {
            const item = element.elements[i];

            element_items.push({
              _id: item._id,
              slug: item.slug,
              title: item.title,
              sub_title: item.sub_title,
              price: item.price,
              is_hidden: item.is_hidden,
              stock_status: item.stock_status,
              quality: item.quality,
              weave: item.weave,
              weight: item.weight,
              composition: item.composition,
              size: item.size,
              rating: item.rating && item.rating.length > 0 ? item.rating : 0,
              brand: item.brand ? item.brand.name : null,
              company: item.company ? item.company.name : null,
              title_image:
                HostURL(req) +
                "uploads/elements/title_images/" +
                item.title_image,
            });
          }
        }

        items.push({
          _id: element._id,
          title: element.title,
          is_hidden: element.is_hidden,
          title_image:
            HostURL(req) +
            "uploads/sub_category/title_images/" +
            element.title_image,
          leaf_categories: leaf_items.length > 0 ? leaf_items : null,
          elements: element_items.length > 0 ? element_items : null,
        });
      }
    }

    if (buttons.length > 0) {
      items.push({
        _id: null,
        title: "Button",
        is_hidden: false,
        title_image: HostURL(req) + "static/button.png",
        leaf_categories: null,
        elements: buttons,
      });
    }

    // getting category
    const category_type = await Category.findById(category);

    // console.log("category_type");
    // console.log(category_type);

    // Static back details

    if (category_type.title === "Shirt") {
      items.push({
        _id: null,
        title: "Back details",
        is_hidden: false,
        title_image: HostURL(req) + "static/back-details-shirt.png",
        leaf_categories: null,
        elements: [],
      });
    } else if (category_type.title === "Pant") {
      items.push({
        _id: null,
        title: "Back details",
        is_hidden: false,
        title_image: HostURL(req) + "static/back-details-pant.png",
        leaf_categories: null,
        elements: null,
      });
    } else if (category_type.title === "Suit") {
      items.push({
        _id: null,
        title: "Back details",
        is_hidden: false,
        title_image: HostURL(req) + "static/back-details-suit.png",
        leaf_categories: null,
        elements: null,
      });
    } else if (category_type.title === "Blazer") {
      items.push({
        _id: null,
        title: "Back details",
        is_hidden: false,
        title_image: HostURL(req) + "static/back-details-blazer.png",
        leaf_categories: null,
        elements: null,
      });
    } else if (category_type.title === "Waist Coat") {
      items.push({
        _id: null,
        title: "Back details",
        is_hidden: false,
        title_image: HostURL(req) + "static/back-details-weist-coat.png",
        leaf_categories: null,
        elements: null,
      });
    }

    // Set data to cache
    const key = "category-" + category;
    RedisClient.setex(key, 3600, JSON.stringify(items));

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
