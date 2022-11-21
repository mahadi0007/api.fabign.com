const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};

  if (!data.title || isEmpty(data.title)) error.title = "Title is required";
  // if (!data.sub_title || isEmpty(data.sub_title)) error.sub_title = "Sub title is required"
  // if (!data.price || isEmpty(data.price)) error.price = "Price is required";
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

  if (!data.priority || isEmpty(data.priority))
    error.priority = "Priority is required";
  if (!data.category || isEmpty(data.category))
    error.category = "Category is required";

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

const makeDefault = (data) => {
  let error = {};

  if (!data.element_id || isEmpty(data.element_id))
    error.element_id = "Element Id is required";
  if (!data.category_id || isEmpty(data.category_id))
    error.category_id = "Category Id is required";

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
  makeDefault,
};
