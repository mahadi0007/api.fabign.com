const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}

    if (!data.type || isEmpty(data.type)) error.type = "Fabric Type is required."
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}