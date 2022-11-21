const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};

  if (!data.title || isEmpty(data.title)) error.title = "Title is required";
  // if (!data.sub_title || isEmpty(data.sub_title)) error.sub_title = "Sub title is required"
  // if (!data.description || isEmpty(data.description)) error.description = "Description is required"
  // if (!data.price || isEmpty(data.price)) error.price = "Price is required";
  // if (!data.quality || isEmpty(data.quality)) error.quality = "Quality is required"
  // if (!data.color || isEmpty(data.color)) error.color = "Color is required"
  // if (!data.weave || isEmpty(data.weave)) error.weave = "Weave is required"
  // if (!data.weight || isEmpty(data.weight)) error.weight = "Weight is required"
  // if (!data.composition || isEmpty(data.composition)) error.composition = "Composition is required"

  // if (data.quality) {
  //     const match = ["Featured", "Essentials", "Premium", "Luxury", "Non-Iron", "All"].find(item => item === data.quality)
  //     if (!match) error.quality = `${data.quality} is not valid`
  // }

  // if (!data.size || isEmpty(data.size)) error.size = "Size Id is required"
  if (!data.files) {
    error.title_image = "Title image is required";
    error.element_image = "Element image is required";
    error.shadow_image = "Shadow image is required";
  }

  if (data.files) {
    if (!data.files.title_image || isEmpty(data.files.title_image))
      error.title_image = "Title image is required";
    if (!data.files.element_image || isEmpty(data.files.element_image))
      error.element_image = "Element image is required";
    if (!data.files.shadow_image || isEmpty(data.files.shadow_image))
      error.shadow_image = "Shadow image is required";
  }

  if (!data.category || isEmpty(data.category))
    error.category = "Category is required";
  if (!data.sub_category || isEmpty(data.sub_category))
    error.sub_category = "Sub Category is required";
  if (!data.priority || isEmpty(data.priority))
    error.priority = "Priority is required";

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
};
