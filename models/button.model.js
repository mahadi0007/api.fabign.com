const { Schema, model } = require("mongoose")

const buttonSchema = new Schema({
    assign_to: {
        type: String,
        trim: true,
        required: true,
        enum: ["shirt", "pant", "suit", "blazer", "waist coat"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
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
    description: {
        type: String,
        trim: true,
        require: true
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

const Button = model("Button", buttonSchema)
module.exports = Button
