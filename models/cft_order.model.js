const {Schema, model} = require("mongoose");

const cftOrderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        trim: true,
        default: ""
    },
    date:{
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true,
        trim: true
    },
    fabric:{
        type: Boolean,
        default: true
    },
    measureMent: {
        type: Boolean,
        default: true
    },
    totalAmount:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        default: "created",
        enum:["created","accepted","completed"]
    },
    image: {
        type: String,
        default: ""
    }
});

module.exports = model("CftOrder", cftOrderSchema, "cft_order");