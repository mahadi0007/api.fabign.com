const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const bulkcolor = new Schema(
  {
    color_name: {
      type: String,
      trim: true,
      required: true,
    },
    color_code: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
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

const BulkColor = model("bulkcolor", bulkcolor);
module.exports = BulkColor;
