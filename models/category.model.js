const { Schema, model } = require("mongoose")

const categorySchema = new Schema({
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
    description: {
        type: String,
        trim: true,
        require: true
    },
    title_image: {
        type: String,
        trim: true,
        require: true
    },
    main_image: {
        type: String,
        trim: true,
        require: true
    },
    sub_categories: [{
        type: Schema.Types.ObjectId,
        ref: "Sub_category"
    }],
    leaf_categories: [{
        type: Schema.Types.ObjectId,
        ref: "Leaf_category"
    }],
    is_hidden: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, {
    timestamps: true
})


const Category = model("Category", categorySchema)
module.exports = Category
