const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}

    if (!data.color_name || isEmpty(data.color_name)) error.color_name = "Color Name is required"
    if (!data.color_code || isEmpty(data.color_code)) error.color_code = "Color Code is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}