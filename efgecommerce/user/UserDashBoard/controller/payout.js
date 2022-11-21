const mongoose = require("mongoose");
const Payout = require("../../../models/UserDashBoard/Payout");
const Store = require("../../../models/UserDashBoard/Store");
const {
  success,
  failure,
  notFound,
} = require("../../../common/helper/responseStatus");

const PayoutController = {
  addNewPayout: async (req, res, next) => {
    try {
      const { ...body } = req.body;
      const user = req.user.id;
      const totalItems = await Store.countDocuments({
        user: mongoose.Types.ObjectId(user),
      }).exec();
      if (totalItems == 0) {
        return failure(
          res,
          "Please Create a Store for adding Payment Info",
          {}
        );
      }
      let payout = new Payout({
        user,
      });
      if (
        body.accountName &&
        body.accountNumber &&
        body.bankName &&
        body.branchDistrict &&
        body.branchName
      ) {
        payout.bank = {
          account_name: body.accountName,
          account_number: body.accountNumber,
          bank_name: body.bankName,
          branch_district: body.branchDistrict,
          brach_name: body.branchName,
        };
      }
      if (body.bkashNumber) {
        payout.bkash = {
          account_number: body.bkashNumber,
        };
      }
      if (body.paymentMethod && body.contactAddress) {
        payout.other = {
          payment_method: body.paymentMethod,
          account_number: body.contactAddress,
        };
      }
      payout = await payout.save();
      await Store.findOneAndUpdate(
        {
          user,
        },
        { $set: { status: "Pending" } }
      );
      return success(res, "Payout Information Added", payout);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  getPayout: async (req, res) => {
    try {
      let user = req.user.id;
      let payout = await Payout.findOne({
        user: mongoose.Types.ObjectId(user),
      })
        .populate("user", "name _id")
        .lean();
      return payout
        ? success(res, "Found payout", payout)
        : notFound(res, "No data found", payout);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  updatePayout: async (req, res) => {
    try {
      const { ...body } = req.body;
      const { id } = req.params;
      const user = req.user.id;
      let isUserPayout = await Payout.countDocuments({
        user: mongoose.Types.ObjectId(user),
        _id: mongoose.Types.ObjectId(id),
      });
      if (!isUserPayout) {
        return res.json({
          success: false,
          statusCode: 401,
          message: "You have no access to update it",
        });
      }
      if (
        body.accountName &&
        body.accountNumber &&
        body.bankName &&
        body.branchDistrict &&
        body.branchName
      ) {
        body.bank = {
          account_name: body.accountName,
          account_number: body.accountNumber,
          bank_name: body.bankName,
          branch_district: body.branchDistrict,
          brach_name: body.branchName,
        };
        body.bkashNumber = undefined;
        body.other = undefined;
        delete body.accountName;
        delete body.accountNumber;
        delete body.bankName;
        delete body.branchDistrict;
        delete body.branchName;
      }
      if (body.bkashNumber) {
        body.bkash = {
          account_number: body.bkashNumber,
        };
        body.bank = undefined;
        body.other = undefined;
        delete body.bkashNumber;
      }
      if (body.paymentMethod && body.contactAddress) {
        body.other = {
          payment_method: body.paymentMethod,
          account_number: body.contactAddress,
        };
        body.bank = undefined;
        body.bkashNumber = undefined;
        delete body.paymentMethod;
        delete body.contactAddress;
      }

      await Payout.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: body }
      );
      let payout = await Payout.findOne({ _id: mongoose.Types.ObjectId(id) })
        .populate("user", "name _id")
        .lean();

      return success(res, "Successfully Updated", payout);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
};

module.exports = PayoutController;
