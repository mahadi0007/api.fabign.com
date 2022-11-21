const { Schema, model } = require("mongoose")

const elementSchema = new Schema({
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
    quality: {
        type: String,
        trim: true,
        default: "All",
        enum: ["Featured", "Essentials", "Premium", "Luxury", "Non-Iron", "All"]
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
    color: {
        type: String,
        trim: true,
        require: true
    },
    weave: {
        type: String,
        trim: true,
        require: true
    },
    weight: {
        type: String,
        trim: true,
        require: true
    },
    composition: {
        type: String,
        trim: true,
        require: true
    },
    is_default: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    is_deleted: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    deleted_at: {
        type: Date,
        trim: true,
        default: null
    },
    priority: {
        type: Number,
        trim: true,
        required: true
    },
    assign_to: {
        type: String,
        required: true,
        enum: ["Sub Category", "Leaf Category"]
    },
    deleted_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        default: null
    },
    size: [{
        type: Schema.Types.ObjectId,
        ref: "Size"
    }],
    rating: [{
        type: Schema.Types.ObjectId,
        ref: "Rating",
        default: null
    }],
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        default: null
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        default: null
    },
    main_category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    sub_category: {
        type: Schema.Types.ObjectId,
        ref: "Sub_category",
        default: null
    },
    leaf_category: {
        type: Schema.Types.ObjectId,
        ref: "Leaf_category",
        default: null
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, {
    timestamps: true
})


const Element = model("Element", elementSchema)
module.exports = Element
