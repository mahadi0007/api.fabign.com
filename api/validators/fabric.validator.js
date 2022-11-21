const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};

  if (!data.title || isEmpty(data.title)) error.title = "Title is required";
  // if (!data.sub_title || isEmpty(data.sub_title)) error.sub_title = "Sub title is required"
  if (!data.description || isEmpty(data.description))
    error.description = "Description is required";
  if (!data.original_price || isEmpty(data.original_price))
    error.original_price = "Original price is required";
  if (!data.color || isEmpty(data.color)) error.color = "Color is required";
  // if (!data.pattern || isEmpty(data.pattern)) error.pattern = "Pattern is required"
  // if (!data.weave || isEmpty(data.weave)) error.weave = "Weave is required"
  // if (!data.weight || isEmpty(data.weight)) error.weight = "Weight is required"
  // if (!data.composition || isEmpty(data.composition)) error.composition = "Composition is required"
  if (!data.category || isEmpty(data.category))
    error.category = "Category is required";
  if (!data.quality || isEmpty(data.quality))
    error.quality = "Quality is required";

  if (!data.files) {
    // error.title_image = "Title image is required";
    error.main_image = "Main image is required";
  }

  if (data.files) {
    // if (!data.files.title_image || isEmpty(data.files.title_image))
    //   error.title_image = "Title image is required";
    if (!data.files.main_image || isEmpty(data.files.main_image))
      error.main_image = "Main image is required";
  }

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
};
