const { Schema, model } = require("mongoose");

const cftSchema = new Schema({
    inActiveDates: {
        type: [String],
        required: true
    },
    existingFitCost: {
        type: Number,
        required: true
    },
    measureMentTakingCost: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: null
    }
});

module.exports = model("Cft", cftSchema, 'cft');