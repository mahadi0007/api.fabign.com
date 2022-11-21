const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const bulkfabrics = new Schema(
  {
    fabric_name: {
      type: String,
      trim: true,
      required: true,
    },
    size: {
      type: String,
      trim: true,
      required: true,
    },
    moq: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    colors: [
      {
        type: Schema.Types.ObjectId,
        ref: "bulkcolor",
        required: true,
      },
    ],
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

const BulkFabrics = model("bulkfabrics", bulkfabrics);
module.exports = BulkFabrics;
