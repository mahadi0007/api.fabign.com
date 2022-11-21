const { Schema, model } = require("mongoose")

const backsideElementMaskSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    element: {
        type: Schema.Types.ObjectId,
        ref: "Backside_Element",
        required: true
    },
    fabric: {
        type: Schema.Types.ObjectId,
        ref: "Fabric",
        required: true
    },
    file: {
        type: String,
        trim: true,
        required: true,
    },
    priority: {
        type: Number,
        trim: true,
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
}, {
    timestamps: true
})


const BacksideElementMask = model("Backside_element_mask", backsideElementMaskSchema)
module.exports = BacksideElementMask
