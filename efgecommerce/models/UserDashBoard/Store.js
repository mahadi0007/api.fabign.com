const { Schema, model } = require("mongoose");

const StoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    logo: {
      type: String,
      trim: true,
      required: true,
    },
    cover: {
      type: String,
      trim: true,
      required: true,
    },
    fb: {
      type: String,
      trim: true,
    },
    insta: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "Unverified",
      enum: [
        "Unverified",
        "Approved",
        "Pending",
        "Temporary Suspended",
        "Permanently Suspended",
      ],
      trim: true,
    },
    follow: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    temporarySuspended: {
      type: Number,
      required: true,
      default: 0,
    },
    suspendedDate: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("UserStore", StoreSchema, "user_store");
