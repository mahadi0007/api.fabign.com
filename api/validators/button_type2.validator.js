const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};

  if (!data.category || isEmpty(data.category))
    error.category = "Category is required";

  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
};
