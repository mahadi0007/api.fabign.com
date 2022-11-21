const _ = require("lodash");
const { RedisClient } = require("../../cache");
const Fabric = require("../../../models/fabric.model");
const Button = require("../../../models/button.model");
const SubButton = require("../../../models/sub_button.model");
const Element = require("../../../models/element.model");
const ElementMask = require("../../../models/element_mask.model");
const BacksideElement = require("../../../models/backside_element.model");
const BacksideElementMask = require("../../../models/backside_element_mask.model");
const Validator = require("../../validators/studio.validator");
const { HostURL, MergeElements } = require("../../helpers");
const { isMongooseId } = require("../../middleware/checkId.middleware");
// Backside image
const ElementBackside = async (category, fabric, isDefault, req) => {
  try {
    let mask_result;

    if (isDefault) {
      const element_result = await BacksideElement.findOne({
        $and: [{ category }, { is_default: true }],
      });
      mask_result = await BacksideElementMask.findOne(
        { element: element_result._id },
        { file: 1 }
      );
    } else {
      mask_result = await BacksideElementMask.findOne(
        { $and: [{ category }, { fabric }] },
        { file: 1 }
      );
    }

    if (!mask_result) return false;

    return HostURL(req) + "uploads/mask_files/" + mask_result.file;
  } catch (error) {
    if (error) return false;
  }
};

// Default image
const Default = async (req, res, next) => {
  try {
    let total_price = 0;
    const usages_elements = [];
    const will_merge_elements = [];
    const { category_id } = req.params;

    await isMongooseId(category_id);

    // Default fabric
    const default_fabric = await Fabric.findOne({
      $and: [{ category: category_id }, { is_default: true }],
    });
    total_price += default_fabric.original_price;

    // Default button
    const button = await Button.findOne({
      $and: [{ category: category_id }, { is_default: true }],
    });
    const default_button = await SubButton.findOne({
      $and: [
        { category: category_id },
        { button: button },
        { subcategory: "Full Sleeve" },
        { is_default: true },
      ],
    });

    // Default elements
    const default_elements = await Element.find({
      $and: [{ main_category: category_id }, { is_default: true }],
    })
      .sort({ priority: -1 })
      .exec();

    // console.log("default_elements");
    // console.log(default_elements);

    if (default_elements && default_elements.length > 0) {
      for (let i = 0; i < default_elements.length; i++) {
        const element = default_elements[i];

        const element_mask = await ElementMask.findOne(
          {
            $and: [
              { category: category_id },
              { element: element._id },
              { fabric: default_fabric._id },
            ],
          },
          { file: 1 }
        );

        if (element_mask) {
          // total_price += Math.ceil(element.price)

          usages_elements.push({
            element_id: element._id,
            element_title: element.title,
            fabric_id: default_fabric._id,
            fabric_title: default_fabric.title,
            element_type: element.sub_title,
            price: element.price,
          });

          will_merge_elements.push({
            priority: element.priority,
            file: HostURL(req) + "uploads/mask_files/" + element_mask.file,
          });
        }
      }
    }

    if (default_button) {
      total_price += Math.ceil(default_button.price);

      usages_elements.push({
        element_id: default_button._id,
        main_button: button._id,
        fabric_id: null,
        element_type: "button",
        price: default_button.price,
      });

      will_merge_elements.push({
        priority: default_button.priority,
        file: HostURL(req) + "uploads/button/" + default_button.main_image,
      });
    }
    // console.log("will_merge_elements");
    // console.log(will_merge_elements);

    const sorted_transparent_items = await _.orderBy(
      will_merge_elements,
      ["priority"],
      ["desc"]
    );
    // console.log("sorted_transparent_items");
    // console.log(sorted_transparent_items);
    const items_before_merge = sorted_transparent_items.map((x) => x.file);
    // console.log("items_before_merge");
    // console.log(items_before_merge);
    const merged_elements = await MergeElements(
      items_before_merge,
      req,
      "studio"
    );
    // console.log("merged_elements");
    // console.log(merged_elements);

    const back_side_image = await ElementBackside(category_id, null, true, req);

    const data = {
      status: true,
      total_price,
      src: merged_elements.src,
      backside: back_side_image ? back_side_image : null,
      fabric_id: default_fabric ? default_fabric._id : null,
      elements: usages_elements,
    };

    // set data to cache
    const key = "default-element-" + category_id;
    RedisClient.setex(key, 3600, JSON.stringify(data));
    return res.status(200).json(data);
  } catch (error) {
    console.log("error");
    console.log(error);

    if (error) next(error);
  }
};

// Change fabric
const ChangeFabric = async (req, res, next) => {
  try {
    console.log("ChangeFabric");
    let total_price = 0;
    const usages_elements = [];
    const will_merge_elements = [];
    const { category_id, fabric_id } = req.params;

    await isMongooseId(category_id);
    await isMongooseId(fabric_id);

    // Default button
    const button = await Button.findOne({
      $and: [{ category: category_id }, { is_default: true }],
    });
    const default_button = await SubButton.findOne({
      $and: [
        { category: category_id },
        { button: button },
        { subcategory: "Full Sleeve" },
        { is_default: true },
      ],
    });

    // Default elements
    const elements_of_fabrics = await Element.find({
      $and: [{ main_category: category_id }, { is_default: true }],
    })
      .sort({ priority: -1 })
      .exec();

    if (elements_of_fabrics && elements_of_fabrics.length > 0) {
      for (let i = 0; i < elements_of_fabrics.length; i++) {
        const element = elements_of_fabrics[i];

        const element_mask = await ElementMask.findOne(
          {
            $and: [
              { category: category_id },
              { element: element._id },
              { fabric: fabric_id },
            ],
          },
          { file: 1 }
        );

        const singleFabric = await Fabric.findOne({ _id: fabric_id });
        if (element_mask) {
          usages_elements.push({
            element_id: element._id,
            fabric_id: fabric_id,
            fabric_title: singleFabric.title,
            element_title: element.title,
            element_type: element.sub_title,
            price: element.price,
          });

          will_merge_elements.push({
            priority: element.priority,
            file: HostURL(req) + "uploads/mask_files/" + element_mask.file,
          });
        }
      }
    }

    // fabric price
    const fabric_price = await Fabric.findOne(
      { _id: fabric_id },
      { original_price: 1 }
    );
    total_price += fabric_price.original_price;

    if (default_button) {
      total_price += Math.ceil(default_button.price);

      usages_elements.push({
        element_id: default_button._id,
        main_button: button._id,
        fabric_id: null,
        element_type: "button",
        price: default_button.price,
      });

      will_merge_elements.push({
        priority: default_button.priority,
        file: HostURL(req) + "uploads/button/" + default_button.main_image,
      });
    }

    const sorted_transparent_items = await _.orderBy(
      will_merge_elements,
      ["priority"],
      ["desc"]
    );
    const items_before_merge = sorted_transparent_items.map((x) => x.file);
    console.log("items_before_merge");
    console.log(items_before_merge);
    const merged_elements = await MergeElements(
      items_before_merge,
      req,
      "studio"
    );

    const back_side_image = await ElementBackside(
      category_id,
      fabric_id,
      false,
      req
    );

    return res.status(200).json({
      status: true,
      total_price,
      src: merged_elements.src,
      backside: back_side_image ? back_side_image : null,
      fabric_id: fabric_id,
      elements: usages_elements,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Change element
const ChangeElement = async (req, res, next) => {
  try {
    console.log("ChangeElement");
    let old_button_id;
    let similar_as_old_element = {};
    let elements_without_similar = [];
    const old_elements_and_fabric_ids = [];

    const { category_id } = req.params;
    const { new_element, new_button, old_elements } = req.body;

    // Validate check
    const validate = await Validator.ChangeElement(req.body);
    if (!validate.isValid) {
      return res.status(422).json({
        status: false,
        message: validate.error,
      });
    }

    await isMongooseId(category_id);
    if (new_element) {
      await isMongooseId(new_element.element_id);
      await isMongooseId(new_element.fabric_id);
    }
    if (new_button) await isMongooseId(new_button);

    for (let i = 0; i < old_elements.length; i++) {
      await isMongooseId(old_elements[i].element_id);
      await isMongooseId(old_elements[i].fabric_id);
    }

    // for getting extra elements type
    let cufname;
    let sleevetype;
    /* extract default & button from old elements */
    await old_elements.map((element) => {
      if (element.element_type !== "button") {
        old_elements_and_fabric_ids.push({
          element_id: element.element_id,
          fabric_id: element.fabric_id,
          element_type: element.element_type,
        });
      }
      if (element.element_type === "button") {
        old_button_id = element.main_button;
        sleevetype = element.sleevetype;
      }
      if (element.element_type === "cuf") {
        cufname = element.element_title;
      }
    });

    if (new_button) old_button_id = new_button;

    // find matches new element
    let founded_new_element;

    if (new_element) {
      const founded_new_element = await Element.findById(
        new_element.element_id
      );
      if (founded_new_element.sub_title === "cuf") {
        cufname = founded_new_element.title;
      }
      if (founded_new_element.sub_title === "sleeve") {
        sleevetype = founded_new_element.title;
      }
      if (!founded_new_element) {
        return res.status(404).json({
          status: false,
          message: "Element not available.",
        });
      }
    }

    /* find button */
    let old_button;
    let main_button;

    if (old_button_id) {
      main_button = await Button.findById(old_button_id);
      // old_button = await SubButton.findOne({ $and: [{ button: button_get._id, is_default: true }] })
      if (cufname !== undefined) {
        old_button = await SubButton.findOne({
          $and: [
            {
              category: category_id,
              button: main_button._id,
              element: cufname,
              subcategory: "Full Sleeve",
            },
          ],
        });
      } else if (sleevetype === "Full Sleeve") {
        old_button = await SubButton.findOne({
          $and: [
            {
              category: category_id,
              button: main_button._id,
              subcategory: sleevetype,
              is_default: true,
            },
          ],
        });
      } else {
        old_button = await SubButton.findOne({
          $and: [
            {
              category: category_id,
              button: main_button._id,
              subcategory: sleevetype,
            },
          ],
        });
      }

      if (!old_button) {
        return res.status(404).json({
          status: false,
          message: "Button not available.",
        });
      }
    }

    // find old matches elements
    const founded_old_elements = [];

    if (old_elements_and_fabric_ids.length > 0) {
      for (let i = 0; i < old_elements_and_fabric_ids.length; i++) {
        const element = old_elements_and_fabric_ids[i];

        const element_result = await Element.findById(element.element_id);
        if (element_result) {
          founded_old_elements.push({
            element_id: element_result._id,
            fabric_id: element.fabric_id,
            main_category: element_result.main_category,
            sub_category: element_result.sub_category,
            assign_to: element_result.assign_to,
            element_type: element.element_type,
          });
        }
      }
    }

    /* find similar element from founded_old_elements */
    /* which is assign to sub category */
    if (
      founded_new_element &&
      founded_new_element.assign_to === "Sub Category"
    ) {
      similar_as_old_element = _.find(founded_old_elements, {
        main_category: founded_new_element.main_category,
        sub_category: founded_new_element.sub_category,
      });
    }

    /* find similar element from founded_old_elements */
    /* which is assign to leaf category */
    if (
      founded_new_element &&
      founded_new_element.assign_to === "Leaf Category"
    ) {
      similar_as_old_element = _.find(founded_old_elements, {
        main_category: founded_new_element.main_category,
        leaf_category: founded_new_element.leaf_category,
      });
    }

    /* old elements without similar element */
    if (Object.keys(similar_as_old_element).length > 0) {
      elements_without_similar = await founded_old_elements.filter(
        (x) =>
          x.element_id.toString() !==
          similar_as_old_element.element_id.toString()
      );
    } else {
      elements_without_similar = founded_old_elements;
    }

    /* extract elements ids from elements_without_similar */
    let elements_ids_from_elements_without_similar;
    if (new_element) {
      elements_ids_from_elements_without_similar = [
        ...elements_without_similar,
        new_element,
      ];
    } else {
      elements_ids_from_elements_without_similar = [
        ...elements_without_similar,
      ];
    }

    /* find all fresh elements */
    const all_matches_elements = [];

    if (
      elements_ids_from_elements_without_similar &&
      elements_ids_from_elements_without_similar.length > 0
    ) {
      for (
        let i = 0;
        i < elements_ids_from_elements_without_similar.length;
        i++
      ) {
        const element = elements_ids_from_elements_without_similar[i];

        const matches_element = await Element.findById(element.element_id);
        if (matches_element) {
          all_matches_elements.push({
            element_id: element.element_id,
            fabric_id: element.fabric_id,
            element_type: element.element_type,
            price: matches_element.price,
            priority: matches_element.priority,
          });
        }
      }
    }

    /* find matches element masks */
    let total_price = 0;
    const usages_elements = [];
    const will_merge_elements = [];

    if (all_matches_elements.length > 0) {
      for (let i = 0; i < all_matches_elements.length; i++) {
        const element = all_matches_elements[i];

        const for_type = await Element.findById(element.element_id);
        const fabric = await Fabric.findById(element.fabric_id);
        const element_mask = await ElementMask.findOne(
          {
            $and: [
              { category: category_id },
              { element: element.element_id },
              { fabric: element.fabric_id },
            ],
          },
          { file: 1 }
        );

        if (element_mask) {
          total_price += Math.ceil(element.price);

          usages_elements.push({
            element_id: element.element_id,
            fabric_id: element.fabric_id,
            fabric_title: fabric.title,
            element_type: for_type.sub_title,
            element_title: for_type.title,
            price: element.price,
          });

          will_merge_elements.push({
            priority: element.priority,
            file: HostURL(req) + "uploads/mask_files/" + element_mask.file,
          });
        }
      }
    }

    if (old_button) {
      total_price += Math.ceil(old_button.price);

      usages_elements.push({
        element_id: old_button._id,
        main_button: main_button,
        sleevetype: sleevetype,
        fabric_id: null,
        element_type: "button",
        price: old_button.price,
      });

      will_merge_elements.push({
        priority: old_button.priority,
        file: HostURL(req) + "uploads/button/" + old_button.main_image,
      });
    }

    const sorted_transparent_items = await _.orderBy(
      will_merge_elements,
      ["priority"],
      ["desc"]
    );
    const items_before_merge = sorted_transparent_items.map((x) => x.file);
    const merged_elements = await MergeElements(
      items_before_merge,
      req,
      "studio"
    );

    const back_side_image = await ElementBackside(category_id, null, true, req);

    res.status(200).json({
      status: true,
      total_price,
      src: merged_elements.src,
      backside: back_side_image ? back_side_image : null,
      fabric_id: old_elements[0].fabric_id,
      elements: usages_elements,
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  Default,
  ChangeFabric,
  ChangeElement,
};
