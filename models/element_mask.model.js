const { Schema, model } = require("mongoose")

const elementMaskSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    element: {
        type: Schema.Types.ObjectId,
        ref: "Element",
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


const ElementMask = model("Element_mask", elementMaskSchema)
module.exports = ElementMask
