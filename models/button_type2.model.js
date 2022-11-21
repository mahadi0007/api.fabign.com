const { Schema, model } = require("mongoose");

const buttonTypeSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category2",
      required: true,
    },
    element_images: [
      {
        element: {
          type: Schema.Types.ObjectId,
          ref: "Element2",
          required: true,
        },
        image: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],
    icon: {
      type: String,
      trim: true,
      require: true,
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

const ButtonType = model("ButtonType2", buttonTypeSchema);
module.exports = ButtonType;
