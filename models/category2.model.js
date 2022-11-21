const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
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
    main_image: {
      type: String,
      trim: true,
      require: true,
    },
    sub_categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sub_category2",
      },
    ],
    is_hidden: {
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

const Category = model("Category2", categorySchema);
module.exports = Category;
