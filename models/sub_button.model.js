const { Schema, model } = require("mongoose")

const subbuttonSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    button: {
        type: Schema.Types.ObjectId,
        ref: "Button",
        required: true
    },
    subcategory: {
        type: String,
        trim: true,
        require: true,
    },
    element: {
        type: String,
        trim: true,
        require: true,
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true
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
    is_hidden: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    stock_status: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    priority: {
        type: Number,
        default: 1
    },
    is_default: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    main_image: {
        type: String,
        trim: true,
        require: true
    },
    title_image: {
        type: String,
        trim: true,
        require: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
}, {
    timestamps: true
})

const SubButton = model("SubButton", subbuttonSchema)
module.exports = SubButton
