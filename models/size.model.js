const mongoose = require("mongoose")
const Float = require('mongoose-float').loadType(mongoose, 2)
const { Schema, model } = require("mongoose")

const sizeSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    arm_length: {
        type: Float,
        trim: true,
        required: true
    },
    biceps: {
        type: Float,
        trim: true,
        required: true
    },
    chest: {
        type: Float,
        trim: true,
        required: true
    },
    hip: {
        type: Float,
        trim: true,
        required: true
    },
    neck: {
        type: Float,
        trim: true,
        required: true
    },
    shirt_length: {
        type: Float,
        trim: true,
        required: true
    },
    shoulder_width: {
        type: Float,
        trim: true,
        required: true
    },
    sleeve_length: {
        type: Float,
        trim: true,
        required: true
    },
    waist: {
        type: Float,
        trim: true,
        required: true
    },
    wrist: {
        type: Float,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
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


const Size = model("Size", sizeSchema)
module.exports = Size
