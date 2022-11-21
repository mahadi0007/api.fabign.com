const mongoose = require("mongoose")
const Float = require('mongoose-float').loadType(mongoose, 2)
const { Schema, model } = require("mongoose")


const odpcolor = new Schema({
    color_name : {
        type: String,
        trim: true,
        required: true,
    },
    color_code: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type:String,
        trim: true,
    },
    
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
}, {
    timestamps: true
})


const ODPColor = model("odpcolor", odpcolor)
module.exports = ODPColor