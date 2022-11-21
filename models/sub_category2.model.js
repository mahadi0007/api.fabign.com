const { Schema, model } = require("mongoose");

const subCategorySchema = new Schema(
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category2",
    },
    elements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Element2",
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

const SubCategory = model("Sub_category2", subCategorySchema);
module.exports = SubCategory;
