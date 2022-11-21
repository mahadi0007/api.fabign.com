const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}

    if (!data.color || isEmpty(data.color)) error.color = "Color is required."
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}