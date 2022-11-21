const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};

  if (!data.quality || isEmpty(data.quality))
    error.type = "Fabric Quality is required.";
  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
};
