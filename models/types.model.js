const { Schema, model } = require("mongoose");

const fabrictype = new Schema(
  {
    type: {
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

const FabricType = model("fabrictype", fabrictype);
module.exports = FabricType;
