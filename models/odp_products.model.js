const mongoose = require("mongoose");
const Float = require("mongoose-float").loadType(mongoose, 2);
const { Schema, model } = require("mongoose");

const odpproducts = new Schema(
  {
    product_name: {
      type: String,
      trim: true,
      required: true,
    },
    subtitle: {
      type: String,
      trim: true,
      required: true,
    },
    size: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    price: {
      type: String,
      trim: true,
      required: true,
    },
    fabric: {
      type: String,
      trim: true,
      required: true,
    },
    colors: [
      {
        type: Schema.Types.ObjectId,
        ref: "odpcolor",
        required: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      required: true,
    },
    main_image: {
      type: String,
      trim: true,
      required: true,
    },
    right_image: {
      type: String,
      trim: true,
      required: true,
    },
    left_image: {
      type: String,
      trim: true,
      required: true,
    },
    back_image: {
      type: String,
      trim: true,
      required: true,
    },
    sizeGuide: {
      type: String,
      trim: true,
      required: true,
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

const ODPProducts = model("odpproducts", odpproducts);
module.exports = ODPProducts;
