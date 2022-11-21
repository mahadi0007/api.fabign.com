const mongoose = require("mongoose")
const Float = require('mongoose-float').loadType(mongoose, 2)
const { Schema, model } = require("mongoose")


const odpartwork = new Schema({
    artwork_name : {
        type: String,
        trim: true,
        required: true,
    },
    icon: {
        type: String,
        trim: true,
        required: true,
    },
    artwork_description: {
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


const ODPArtWork = model("odpartwork", odpartwork)
module.exports = ODPArtWork