const { Schema, model } = require("mongoose")

const subCategorySchema = new Schema({
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
    is_hidden: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    main_category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    leaf_categories: [{
        type: Schema.Types.ObjectId,
        ref: "Leaf_category"
    }],
    elements: [{
        type: Schema.Types.ObjectId,
        ref: "Element"
    }]
}, {
    timestamps: true
})


const SubCategory = model("Sub_category", subCategorySchema)
module.exports = SubCategory
