const mongoose = require("mongoose")
const Float = require('mongoose-float').loadType(mongoose, 2)
const { Schema, model } = require("mongoose")


const measurements = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    measurement_name : {
        type: String,
        trim: true,
        required: true,
    },
    variable_name: {
        type: String,
        trim: true,
        required: true,
    },
    measurementIcon: {
        type: String,
        trim: true,
        required: true,
    },
    measurementVideo: {
        type:String,
        trim: true,
        required: true
    },
    size_xs: {
        type: String,
        trim: true,
        default: ""
    },
    size_s: {
        type: String,
        trim: true,
        default: ""
    },
    size_m: {
        type: String,
        trim: true,
        default: ""
    },
    size_l: {
        type: String,
        trim: true,
        default: ""
    },
    size_xl: {
        type: String,
        trim: true,
        default: ""
    },
    size_xll: {
        type: String,
        trim: true,
        default: ""
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
}, {
    timestamps: true
})


const Measurements = model("measurements", measurements)
module.exports = Measurements