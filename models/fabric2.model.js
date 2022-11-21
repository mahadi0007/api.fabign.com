const { Schema, model } = require("mongoose");

const fabricSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      require: true,
    },
    original_price: {
      type: Number,
      trim: true,
      required: true,
    },
    sample_price: {
      type: Number,
      trim: true,
      required: true,
    },
    sub_category_prices: [
      {
        sub_category: {
          type: Schema.Types.ObjectId,
          ref: "Sub_category2",
          required: true,
        },
        price: {
          type: Number,
          trim: true,
          default: null,
        },
      },
    ],
    is_default: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
    is_hidden: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
    stock_status: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
    quality: {
      type: Schema.Types.ObjectId,
      ref: "fabricquality",
      required: true,
    },
    main_image: {
      type: String,
      trim: true,
      require: true,
    },
    cover_image: {
      type: String,
      trim: true,
      require: true,
    },
    color: {
      type: Schema.Types.ObjectId,
      ref: "fabriccolors",
      required: true,
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: "fabrictype",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category2",
      required: true,
    },
    rating: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
    deleted_at: {
      type: Date,
      trim: true,
    },
    deleted_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
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

const Fabric = model("Fabric2", fabricSchema);
module.exports = Fabric;
