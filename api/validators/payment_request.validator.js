const { isEmpty } = require("./helpers.validator");

const Store = (data) => {
  let error = {};
  if (!data.request_amount || isEmpty(data.request_amount))
    error.category = "Request Amount is required.";
  if (!data.available_balance || isEmpty(data.available_balance))
    error.profile_name = "Available Balance is required";
  return {
    error,
    isValid: Object.keys(error).length === 0,
  };
};

module.exports = {
  Store,
};
