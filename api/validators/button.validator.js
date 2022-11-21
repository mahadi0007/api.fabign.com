const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};

  // if (!data.assign_to || isEmpty(data.assign_to)) error.assign_to = "Assign to is required"
  // if (data.assign_to) {
  //     const match = ["shirt", "pant", "suit", "blazer", "waist coat"].find(item => item === data.assign_to)
  //     if (!match) error.assign_to = `${data.assign_to} is not valid`
  // }

  // if (!data.category || isEmpty(data.category)) error.category = "Category is required"
  if (!data.title || isEmpty(data.title)) error.title = "Title is required";
  // if (!data.sub_title || isEmpty(data.sub_title)) error.sub_title = "Sub title is required"
  // if (!data.description || isEmpty(data.description)) error.description = "Description is required"
  if (!data.price || isEmpty(data.price)) error.price = "Price is required";
  // if (!data.color || isEmpty(data.color)) error.color = "Color is required"

  if (!data.files) error.file = "Image is required";

  if (data.files) {
    if (!data.files.file || isEmpty(data.files.file))
      error.file = "Image is required";
  }

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
};
