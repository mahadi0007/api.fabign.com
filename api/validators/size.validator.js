const { isEmpty } = require("./helpers.validator")

const Store = data => {
    let error = {}

    if (!data.title || isEmpty(data.title)) error.title = "Title is required."
    if (!data.arm_length || isEmpty(data.arm_length)) error.arm_length = "Arm length is required."
    if (!data.biceps || isEmpty(data.biceps)) error.biceps = "Biceps is required."
    if (!data.chest || isEmpty(data.chest)) error.chest = "Chest is required."
    if (!data.hip || isEmpty(data.hip)) error.hip = "HIP is required."
    if (!data.neck || isEmpty(data.neck)) error.neck = "Neck is required."
    if (!data.shirt_length || isEmpty(data.shirt_length)) error.shirt_length = "Shirt lenght is required."
    if (!data.shoulder_width || isEmpty(data.shoulder_width)) error.shoulder_width = "Shoulder_width is required."
    if (!data.sleeve_length || isEmpty(data.sleeve_length)) error.sleeve_length = "Sleeve length is required."
    if (!data.waist || isEmpty(data.waist)) error.waist = "Waist is required."
    if (!data.wrist || isEmpty(data.wrist)) error.wrist = "Wrist is required."


    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = {
    Store
}