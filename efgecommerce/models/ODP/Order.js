const { Schema, model } = require("mongoose");

const validateEmail = function (email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const ODPOrderSchema = new Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validateEmail, "Please provide a valid email address"],
    },
    orderId: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
      trim: true,
    },
    postCode: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: "cash",
      enum: ["cash", "bkash", "card"],
    },
    products: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Campaign",
        },
        title: {
          type: String,
          trim: true,
        },
        front: {
          type: String,
          trim: true,
        },
        back: {
          type: String,
          trim: true,
        },
        left: {
          type: String,
          trim: true,
        },
        right: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
          trim: true,
        },
        purchasePrice: {
          type: Number,
          trim: true,
          default: 0,
        },
        subTotal: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    canceledProducts: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Campaign",
        },
        title: {
          type: String,
          trim: true,
        },
        front: {
          type: String,
          trim: true,
        },
        back: {
          type: String,
          trim: true,
        },
        left: {
          type: String,
          trim: true,
        },
        right: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
          trim: true,
        },
        purchasePrice: {
          type: Number,
          trim: true,
          default: 0,
        },
        subTotal: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    subTotalPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      default: "Pending Payment",
      enum: [
        "Pending Payment",
        "On hold",
        "Paid",
        "Payment Failed",
        "Ready to Refund",
        "Refunded",
      ],
    },
    orderStatus: [
      {
        status: {
          type: String,
          default: "Order Received",
          enum: [
            "Order Received",
            "Processing Order",
            "Handed over to Courier",
            "Delivery by Pathao",
            "Delivery by RedX",
            "Delivered",
            "Cancelled",
            "Returned",
            "Exchanged",
          ],
        },
        time: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    transactionId: {
      type: String,
    },
    trackingNumber: {
      type: String,
      default: null,
    },
    shippingCompany: {
      type: String,
      default: null,
    },
    deliveryStatus: {
      type: String,
      default: "",
    },
    isCouponApplied: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("ODPOrder", ODPOrderSchema, "odporder");
