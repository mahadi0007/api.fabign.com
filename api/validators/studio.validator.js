
const { isEmpty } = require("./helpers.validator")

const ChangeElement = data => {
    let error = {}

    if (!data.old_elements || isEmpty(data.old_elements)) error.old_elements = "Old elements is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

// Change element fabric
const ChangeElementFabric = data => {
    let error = {}

    if (!data.old_fabric || isEmpty(data.old_fabric)) error.old_fabric = "Old fabric Id is required."
    if (!data.old_elements || isEmpty(data.old_elements)) error.old_elements = "Old elements is required."
    if (!data.new_element || isEmpty(data.new_element)) error.new_element = "New element is required."
    if (!data.new_fabric || isEmpty(data.new_fabric)) error.new_fabric = "New fabric is required."

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    ChangeElement,
    ChangeElementFabric
}