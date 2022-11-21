const { Schema, model } = require("mongoose");

const promotTutorialSchema = new Schema(
  {
    url: {
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

module.exports = model("PromoTutorial", promotTutorialSchema, "promo_tutorial");
