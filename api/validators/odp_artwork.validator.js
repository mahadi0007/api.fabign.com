const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}

    if (!data.artwork_name || isEmpty(data.artwork_name)) error.artwork_name = "ArtWork Name is required"

    if (data.files) {
        if (!data.files.icon || isEmpty(data.files.icon)) error.icon = "Icon is required"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}