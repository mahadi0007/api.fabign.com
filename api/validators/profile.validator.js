const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}
    if (!data.category || isEmpty(data.category)) error.category = "Category is required."
    if (!data.profile_name || isEmpty(data.profile_name)) error.profile_name = "Profile Name is required"
    if (!data.size || isEmpty(data.size)) error.size = "Size is required"
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}