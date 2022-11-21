const { Schema, model } = require("mongoose");

const backSideElementSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    title_image: {
      type: String,
      trim: true,
      require: true,
    },
    element_image: {
      type: String,
      trim: true,
      require: true,
    },
    shadow_image: {
      type: String,
      trim: true,
      require: true,
    },
    stock_status: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category2",
      required: true,
    },
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "Sub_category2",
      default: null,
    },
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
    priority: {
      type: Number,
      trim: true,
      required: true,
    },
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

const Backside_Element = model("Backside_Element2", backSideElementSchema);
module.exports = Backside_Element;
