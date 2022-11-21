const {
  success,
  failure,
  notFound,
  notModified,
} = require("../../common/helper/responseStatus");
const Order = require("../../models/Bulk/Order");
const uid = require("uniqid");
const mongoose = require("mongoose");
const moment = require("moment");
const Helper = require("../../common/helper/index");

class BulkOrderController {
  async placeOrder(req, res, next) {
    try {
      const {
        name,
        email,
        phone,
        businessName,
        fabric,
        shippingAddress,
        city,
        state,
        postCode,
        country,
        startDate,
        endDate,
        instruction,
      } = req.body;
      const orderId = await uid();
      const orderDate = moment().format("YYYY-MM-DD");
      req.body.quantity = JSON.parse(req.body.quantity);
      if (req.body.uploadImage) {
        req.body.uploadImage = JSON.parse(req.body.uploadImage);
      }
      req.body.product_color = JSON.parse(req.body.product_color);

      const orderData = new Order({
        user: req.user.id,
        orderDate,
        orderId: orderId,
        name,
        email,
        phone,
        businessName,
        fabric,
        shippingAddress,
        city,
        state,
        postCode,
        country,
        startDate,
        endDate,
        instruction,
        quantity: req.body.quantity,
        uploadImage: req.body.uploadImage,
        product_color: req.body.product_color,
      });
      orderData.image = await Helper.FileUploadOfBaseData(
        req.body.image,
        `./uploads/bulkOrder/${orderData._id}`,
        "mainImage"
      );
      if (req.files) {
        if (req.files.uploadImageFile) {
          orderData.uploadImage.image = await Helper.FileUploadForBulkOrder(
            req.files.uploadImageFile,
            `./uploads/bulkOrder/${orderData._id}`,
            "uploadImage"
          );
        }
      }
      const order = await orderData.save();
      return success(res, "Bulk Order placed", order);
    } catch (error) {
      console.log(error);
      return failure(res, error.message, error);
    }
  }
  async getAllOrder(req, res, next) {
    try {
      let page = +req.query.page || 1,
        limit = +req.query.limit || 10,
        status = req.query.status,
        fromDate = req.query.fromDate,
        toDate = req.query.toDate,
        searchText = req.query.searchText;

      let query = {};
      status ? (query["status"] = status) : null;
      fromDate && toDate
        ? (query["$and"] = [
            { orderDate: { $gte: fromDate } },
            { orderDate: { $lte: toDate } },
          ])
        : null;
      searchText ? (query["orderId"] = { $regex: searchText }) : null;

      const total = await Order.countDocuments(query);
      let order = await Order.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "user",
          select: "name email phone",
        })
        .populate("fabric", "fabric_name _id")
        .lean({});
      return order
        ? success(res, "Fetched order", {
            total: total,
            page: page,
            limit: limit,
            order: order,
          })
        : notFound(res, "No content found", {
            tota: total,
            limit: limit,
            page: page,
          });
    } catch (error) {
      return failure(res, error.message, error);
    }
  }
  async getSingleOrder(req, res, next) {
    try {
      let order = await Order.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      })
        .populate({
          path: "user",
          select: "name email phone",
        })
        .populate("fabric", "fabric_name _id")
        .lean({});
      return order
        ? success(res, "Fetched order", order)
        : notFound(res, "No content found", {});
    } catch (error) {
      return failure(res, error.message, error);
    }
  }
  async updateOrder(req, res) {
    try {
      let { ...updateObj } = req.body;
      let { id } = req.params;
      const modified = await Order.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
        },
        {
          $set: updateObj,
        }
      );
      const order = modified.matchedCount
        ? await Order.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
            .populate({
              path: "user",
              select: "name email phone",
            })
            .populate("fabric", "fabric_name _id")
            .lean({})
        : {};
      return modified.matchedCount
        ? modified.modifiedCount
          ? success(res, "Successfully Updated Order", order)
          : notModified(res, "Not modified", order)
        : notFound(res, "No content found", {});
    } catch (error) {
      return failure(res, error.message, error);
    }
  }
  async deleteOrder(req, res, next) {
    try {
      let deleted = await Order.deleteOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      return deleted.deletedCount
        ? success(res, "Successfully deleted", deleted)
        : notModified(res, "Not deleted", {});
    } catch (error) {
      return failure(res, error.message, error);
    }
  }
  // async placeBkashPayment(req, res, next) {
  //   // console.log(req);
  //   try {
  //     const { paymentRequest } = req.body;
  //     const result = await bkash.createPayment(paymentRequest);
  //     return success(res, "Bkash Payment placed", result);
  //   } catch (error) {
  //     console.log(error);
  //     return failure(res, error.message, error);
  //   }
  // }
  // async executeBkashPayment(req, res, next) {
  //   try {
  //     console.log(req.body);
  //     const { paymentID } = req.body;
  //     const result = await bkash.executePayment(paymentID);
  //     console.log(result);
  //     return success(res, "Bkash Payment Executed", result);
  //   } catch (error) {
  //     console.log(error);
  //     return failure(res, error.message, error);
  //   }
  // }
  // async successSSLPayment(req, res, next) {
  //   try {
  //     const { transactionId } = req.query;
  //     // console.log("successSSLPayment");
  //     if (!transactionId) {
  //       // return res.json({ message: "transactionId must be required" });
  //       return res.redirect(`${process.env.CLIENT_URL}`);
  //     } else {
  //       const currentOrder = Order.findById(transactionId);
  //       console.log("currentOrder");
  //       console.log(currentOrder);

  //       // currentOrder.exec((err, result) => {
  //       //   if (err) console.log(err);
  //       //   res.redirect(
  //       //     `${process.env.CLIENT_URL}/checkout/success/${transactionId}`
  //       //   );
  //       // });
  //       // return res.json({ message: "else transactionId must be required" });
  //       return res.redirect(`${process.env.CLIENT_URL}`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return failure(res, error.message, error);
  //   }
  // }
  // async failSSLPayment(req, res, next) {
  //   console.log("failSSLPayment");
  //   return res.redirect(`${process.env.CLIENT_URL}/cart`);
  // }
  // async cancelSSLPayment(req, res, next) {
  //   console.log("cancelSSLPayment");
  //   return res.redirect(`${process.env.CLIENT_URL}/cart`);
  // }
}

module.exports = new BulkOrderController();
