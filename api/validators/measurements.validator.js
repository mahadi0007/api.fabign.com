const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}

    if (!data.category || isEmpty(data.category)) error.category = "Category is required."
    if (!data.measurement_name || isEmpty(data.measurement_name)) error.measurement_name = "Measurement Name is required"
    if (!data.measurementVideo || isEmpty(data.measurementVideo)) error.measurementVideo = "Measurement Video is required"

    if(data.files){
        if (!data.files.measurementIcon || isEmpty(data.files.measurementIcon)) error.measurementIcon = "Measurement icon is required"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}