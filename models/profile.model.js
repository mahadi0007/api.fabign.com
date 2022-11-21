const mongoose = require("mongoose")
const Float = require('mongoose-float').loadType(mongoose, 2)
const { Schema, model } = require("mongoose")

const sizeSchema = new Schema({
    profile_name: {
        type: String,
        trim: true,
        required: true
    },
    size: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    chest: {
        type: Float,
        trim: true,
        default: ''
    },
    waist: {
        type: Float,
        trim: true,
        default: ''
    },
    hip: {
        type: Float,
        trim: true,
        default: ''
    },
    long_sleeve: {
        type: Float,
        trim: true,
        default: ''
    },
    half_sleeve: {
        type: Float,
        trim: true,
        default: ''
    },
    front_length: {
        type: Float,
        trim: true,
        default: ''
    },
    back_length: {
        type: Float,
        trim: true,
        default: ''
    },
    collar: {
        type: Float,
        trim: true,
        default: ''
    },
    shoulder: {
        type: Float,
        trim: true,
        default: ''
    },
    cuff: {
        type: Float,
        trim: true,
        default: ''
    },
    length: {
        type: Float,
        trim: true,
        default: ''
    },
    thigh: {
        type: Float,
        trim: true,
        default: ''
    },
    bottom: {
        type: Float,
        trim: true,
        default: ''
    },
    inside_leg: {
        type: Float,
        trim: true,
        default: ''
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, {
    timestamps: true
})


const Profile = model("profile", sizeSchema)
module.exports = Profile
