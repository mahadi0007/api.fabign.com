const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    orderDate: {
      type: String,
      required: true,
      trim: true,
    },
    orderId: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    fabric: {
      type: Schema.Types.ObjectId,
      ref: "bulkfabrics",
      required: true,
    },
    quantity: {
      xs: {
        type: Number,
      },
      s: {
        type: Number,
      },
      m: {
        type: Number,
      },
      l: {
        type: Number,
      },
      xl: {
        type: Number,
      },
      xxl: {
        type: Number,
      },
      xxxl: {
        type: Number,
      },
      xxxxl: {
        type: Number,
      },
    },
    uploadImage: {
      image: {
        type: String,
        trim: true,
      },
      length: {
        type: Number,
      },
      width: {
        type: Number,
      },
      printLocation: {
        type: String,
        trim: true,
      },
      printType: {
        type: String,
        trim: true,
      },
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "created",
      enum: [
        "created",
        "pending",
        "confirmed",
        "picked",
        "Received by warehouse",
        "packed",
        "handed over to courier",
        "delivered",
        "cancelled",
      ],
    },
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    endDate: {
      type: String,
      required: true,
      trim: true,
    },
    instruction: {
      type: String,
      trim: true,
    },
    product_color: {
      body: {
        type: String,
      },
      collor: {
        type: String,
      },
      cuff: {
        type: String,
      },
      front_placket: {
        type: String,
      },
      back_placket: {
        type: String,
      },
      button: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("BulkOrder", OrderSchema, "bulkorder");
