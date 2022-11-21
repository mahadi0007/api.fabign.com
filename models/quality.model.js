const { Schema, model } = require("mongoose");

const fabricquality = new Schema(
  {
    quality: {
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

const FabricQuality = model("fabricquality", fabricquality);
module.exports = FabricQuality;
