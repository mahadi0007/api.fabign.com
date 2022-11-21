const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose, 2);
const { Schema, model } = require("mongoose");

const bulkproducts = new Schema(
  {
    product_name: {
      type: String,
      trim: true,
      required: true,
    },
    product_type: {
      type: String,
      trim: true,
      required: true,
    },
    main_image: {
      type: String,
      trim: true,
      required: true,
    },
    shadow_image: {
      type: String,
      trim: true,
      required: true,
    },
    body_image: {
      type: String,
      trim: true,
      required: true,
    },
    collor_image: {
      type: String,
      trim: true,
      required: true,
    },
    cuff_image: {
      type: String,
      trim: true,
    },
    front_placket_image: {
      type: String,
      trim: true,
    },
    back_placket_image: {
      type: String,
      trim: true,
    },
    button_image: {
      type: String,
      trim: true,
    },
    sizeGuide: {
      type: String,
      trim: true,
      required: true,
    },
    fabrics: [
      {
        type: Schema.Types.ObjectId,
        ref: "bulkfabrics",
        required: true,
      },
    ],
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BulkProducts = model("bulkproducts", bulkproducts);
module.exports = BulkProducts;
