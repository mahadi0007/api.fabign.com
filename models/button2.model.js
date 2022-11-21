const { Schema, model } = require("mongoose");

const buttonSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    main_image: {
      type: String,
      trim: true,
      require: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category2",
      required: true,
    },
    stock_status: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
    is_hidden: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
    is_default: {
      type: Boolean,
      default: false,
      enum: [true, false],
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

const Button = model("Button2", buttonSchema);
module.exports = Button;
