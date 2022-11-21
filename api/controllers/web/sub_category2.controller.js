const Button = require("../../../models/button2.model");
const BacksideElement = require("../../../models/backside_element2.model");
const SubCategory = require("../../../models/sub_category2.model");
const Category = require("../../../models/category2.model");
const { HostURL } = require("../../helpers");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");

// List of items
const Index = async (req, res, next) => {
  try {
    // console.log("Index subcategory");
    const items = [];
    const buttons = [];
    const backside_elements = [];
    const { category } = req.params;

    await isMongooseId(category);

    // Button results
    const button_results = await Button.find({ category });

    if (button_results && button_results.length > 0) {
      for (let i = 0; i < button_results.length; i++) {
        const element = button_results[i];

        buttons.push({
          _id: element._id,
          element_type: "button",
          title: element.title,
          price: element.price,
          is_hidden: element.is_hidden,
          stock_status: element.stock_status,
          is_default: element.is_default,
          main_image:
            HostURL(req) + "uploads/button2/main_image/" + element.main_image,
        });
      }
    }

    let backside_element_results = await BacksideElement.find({ category });

    // backside_element_results.sort((a, b) => a.priority - b.priority);

    if (backside_element_results && backside_element_results.length > 0) {
      const backside_element_priority = backside_element_results.reduce(
        (p, c) => (p.priority > c.priority ? p : c)
      ).priority;

      backside_element_results = backside_element_results.filter(
        (x) => x.priority == backside_element_priority
      );

      for (let i = 0; i < backside_element_results.length; i++) {
        const element = backside_element_results[i];

        backside_elements.push({
          _id: element._id,
          element_type: "back_details",
          title: element.title,
          is_hidden: element.is_hidden,
          stock_status: element.stock_status,
          is_default: element.is_default,
          priority: element.priority,
          main_image:
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

    // Sub category results
    const results = await SubCategory.find({ category: category })
      .populate({
        path: "elements",
        select: {
          deleted_by: 0,
          deleted_at: 0,
          created_by: 0,
          createdAt: 0,
          updatedAt: 0,
          main_image: 0,
        },
      })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        const element_items = [];

        if (element.elements && element.elements.length > 0) {
          for (let i = 0; i < element.elements.length; i++) {
            const item = element.elements[i];
            element_items.push({
              _id: item._id,
              title: item.title,
              is_hidden: item.is_hidden,
              stock_status: item.stock_status,
              is_default: item.is_default,
              priority: item.priority,
              width: item.width,
              height: item.height,
              main_image:
                HostURL(req) +
                "uploads/elements2/title_images/" +
                item.title_image,
              element_image:
                HostURL(req) +
                "uploads/elements2/element_image/" +
                item.element_image,
              shadow_image:
                HostURL(req) +
                "uploads/elements2/shadow_image/" +
                item.shadow_image,
            });
          }
        }

        items.push({
          _id: element._id,
          title: element.title,
          is_hidden: element.is_hidden,
          main_image:
            HostURL(req) +
            "uploads/sub_category2/main_images/" +
            element.main_image,
          elements: element_items.length > 0 ? element_items : null,
        });
      }
    }

    if (buttons.length > 0) {
      items.push({
        _id: null,
        title: "Button",
        is_hidden: false,
        main_image: HostURL(req) + "static/button.png",
        elements: buttons,
      });
    }

    // getting category
    const category_type = await Category.findById(category);

    // Static back details
    if (backside_element_results && backside_element_results.length > 0) {
      if (category_type.title === "Shirt") {
        items.push({
          _id: null,
          title: "Back details",
          is_hidden: false,
          main_image: HostURL(req) + "static/back-details-shirt.png",
          elements: backside_elements,
        });
      } else if (category_type.title === "Pant") {
        items.push({
          _id: null,
          title: "Back details",
          is_hidden: false,
          main_image: HostURL(req) + "static/back-details-pant.png",
          elements: null,
        });
      } else if (category_type.title === "Suit") {
        items.push({
          _id: null,
          title: "Back details",
          is_hidden: false,
          main_image: HostURL(req) + "static/back-details-suit.png",
          elements: null,
        });
      } else if (category_type.title === "Blazer") {
        items.push({
          _id: null,
          title: "Back details",
          is_hidden: false,
          main_image: HostURL(req) + "static/back-details-blazer.png",
          elements: null,
        });
      } else if (category_type.title === "Waist Coat") {
        items.push({
          _id: null,
          title: "Back details",
          is_hidden: false,
          main_image: HostURL(req) + "static/back-details-weist-coat.png",
          elements: null,
        });
      }
    }

    // Set data to cache
    // const key = "category-" + category;
    // RedisClient.setex(key, 3600, JSON.stringify(items));

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
