const { Schema, model } = require("mongoose")

const companySchema = new Schema({
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
    }
}, {
    timestamps: true
})


const Company = model("Company", companySchema)
module.exports = Company
