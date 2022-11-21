const { Schema, model } = require("mongoose");

const fabriccolors = new Schema(
  {
    color: {
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

const FabricColors = model("fabriccolors", fabriccolors);
module.exports = FabricColors;
