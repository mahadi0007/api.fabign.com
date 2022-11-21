const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}

    if (!data.product_name || isEmpty(data.product_name)) error.product_name = "Product Name is required"
    if (!data.subtitle || isEmpty(data.subtitle)) error.subtitle = "Product Subtitle is required"
    // if (!data.size || isEmpty(data.size)) error.size = "Product Size is required"
    if (!data.price || isEmpty(data.price)) error.price = "Product Price is required"
    if (!data.fabric || isEmpty(data.fabric)) error.fabric = "Fabric is required"
    // if (!data.colors || isEmpty(data.colors)) error.colors = "Color is required"
    if (data.files) {
        if (!data.files.icon || isEmpty(data.files.icon)) error.icon = "Icon is required"
        if (!data.files.main_image || isEmpty(data.files.main_image)) error.main_image = "Main Image is required"
        if (!data.files.back_image || isEmpty(data.files.back_image)) error.back_image = "Back Image is required"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}