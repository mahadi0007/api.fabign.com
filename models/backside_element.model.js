const { Schema, model } = require("mongoose")

const backSideElementSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    sub_title: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    title_image: {
        type: String,
        trim: true,
        require: true
    },
    type: {
        type: String,
        trim: true,
        required: false
    },
    main_image: {
        type: String,
        trim: true,
        require: true
    },
    is_default: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    priority: {
        type: Number,
        trim: true,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, {
    timestamps: true
})


const Backside_Element = model("Backside_Element", backSideElementSchema)
module.exports = Backside_Element
