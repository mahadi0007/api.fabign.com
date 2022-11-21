const { Schema, model } = require("mongoose")

const fabricSchema = new Schema({
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
    original_price: {
        type: Number,
        trim: true,
        required: true
    },
    sub_category_prices: [{
        sub_category: {
            type: Schema.Types.ObjectId,
            ref: "Sub_category",
            required: true
        },
        price: {
            type: Number,
            trim: true,
            default: null
        }
    }],
    is_default: {
        type: Boolean,
        default: false,
        enum: [true, false]
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
    quality: [{
        type: String,
        trim: true,
        required: true
    }],
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
    cover_image: {
        type: String,
        trim:true,
        require: true
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: "fabriccolors",
        required: true
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: "fabrictype",
        required: true
    },
    pattern: {
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
    is_deleted: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    deleted_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    },
    deleted_at: {
        type: Date,
        trim: true,
        default: null
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand"
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    rating: [{
        type: Schema.Types.ObjectId,
        ref: "Rating"
    }],
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, {
    timestamps: true
})


const Fabric = model("Fabric", fabricSchema)
module.exports = Fabric
