const {
  success,
  failure,
  notFound,
  notModified,
} = require("../../common/helper/responseStatus");
const Order = require("../../models/ODP/Order");
const mongoose = require("mongoose");

class OrderController {
  async getAllOrder(req, res, next) {
    try {
      let page = +req.query.page,
        limit = +req.query.limit,
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

      const total = await Order.countDocuments({ ...query, user: req.user.id });
      let order = await Order.find({ ...query, user: req.user.id })
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "user",
          select: "name email phone",
        })
        .populate({
          path: "products.id",
          model: "Campaign",
          select: "front title",
        })
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
        .populate({
          path: "products.id",
          model: "Campaign",
          select: "front title",
        })
        .lean({});
      return order
        ? success(res, "Fetched order", order)
        : notFound(res, "No content found", {});
    } catch (error) {
      console.log("error");
      console.log(error);
      return failure(res, error.message, error);
    }
  }
}

module.exports = new OrderController();
