const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};

  if (!data.product_name || isEmpty(data.product_name))
    error.product_name = "Product Name is required";
  if (!data.product_type || isEmpty(data.product_type))
    error.product_type = "Product Type is required";
  if (!data.fabrics || isEmpty(data.fabrics))
    error.fabrics = "Fabric is required";
  if (data.files) {
    if (!data.files.main_image || isEmpty(data.files.main_image))
      error.main_image = "Main Image is required";
    if (!data.files.shadow_image || isEmpty(data.files.shadow_image))
      error.main_image = "Shadow_ Image is required";
    if (!data.files.body_image || isEmpty(data.files.body_image))
      error.body_image = "Body Image is required";
    if (!data.files.collor_image || isEmpty(data.files.collor_image))
      error.collor_image = "Collor Image is required";
  }

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
};
