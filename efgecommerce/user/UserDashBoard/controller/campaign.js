const mongoose = require("mongoose");
const moment = require("moment");
const Campaign = require("../../../models/UserDashBoard/Campaign");
const Store = require("../../../models/UserDashBoard/Store");
const {
  success,
  failure,
  notFound,
  notModified,
} = require("../../../common/helper/responseStatus");
const Helper = require("../../../common/helper/index");

const convert = (str) => {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
};

const CampaignController = {
  addNewCampaign: async (req, res, next) => {
    try {
      const user = req.user.id;
      let body = JSON.parse(JSON.stringify(req.body));
      const totalItems = await Store.countDocuments({
        _id: mongoose.Types.ObjectId(body.store),
        status: "Approved",
      }).exec();
      if (totalItems == 0) {
        return failure(res, "Your store is not approved yet.", {});
      }
      if (body.tags) {
        body.tags = body.tags.split(",");
      }
      var startDate = moment(convert(body.startDate));
      var endDate = moment(convert(body.endDate));
      body.startDate = convert(body.startDate);
      body.endDate = convert(body.endDate);
      body.duration = endDate.diff(startDate, "days") + 1;
      body.user = user;

      delete body.uploadImage;
      delete body.front;
      delete body.back;
      delete body.left;
      delete body.right;

      let campaign = new Campaign(body);

      campaign.front = await Helper.FileUploadOfBaseData(
        req.body.front,
        `./uploads/store/campaign/${campaign._id}`,
        "front_main"
      );
      campaign.back = await Helper.FileUploadOfBaseData(
        req.body.back,
        `./uploads/store/campaign/${campaign._id}`,
        "back_main"
      );
      campaign.left = await Helper.FileUploadOfBaseData(
        req.body.left,
        `./uploads/store/campaign/${campaign._id}`,
        "left_main"
      );
      campaign.right = await Helper.FileUploadOfBaseData(
        req.body.right,
        `./uploads/store/campaign/${campaign._id}`,
        "right_main"
      );

      if (req.body.uploadImage) {
        req.body.uploadImage = JSON.parse(req.body.uploadImage);
      }
      if (req.body?.uploadImage?.front?.length > 0) {
        let frontImage = [];
        await req.body.uploadImage.front.forEach(async (element, index) => {
          const img = await Helper.FileUploadOfBaseData(
            element,
            `./uploads/store/campaign/${campaign._id}/front_cus_img`,
            `img_${index + 1}`
          );
          frontImage.push({ image: img });
        });
        campaign.uploadImage.front = frontImage;
      }
      if (req.body?.uploadImage?.left?.length > 0) {
        let leftImage = [];
        await req.body.uploadImage.left.forEach(async (element, index) => {
          const img = await Helper.FileUploadOfBaseData(
            element,
            `./uploads/store/campaign/${campaign._id}/left_cus_img`,
            `img_${index + 1}`
          );
          leftImage.push({ image: img });
        });
        campaign.uploadImage.left = leftImage;
      }
      if (req.body?.uploadImage?.right?.length > 0) {
        let rightImage = [];
        await req.body.uploadImage.right.forEach(async (element, index) => {
          const img = await Helper.FileUploadOfBaseData(
            element,
            `./uploads/store/campaign/${campaign._id}/right_cus_img`,
            `img_${index + 1}`
          );
          rightImage.push({ image: img });
        });
        campaign.uploadImage.right = rightImage;
      }
      if (req.body?.uploadImage?.back?.length > 0) {
        let backImage = [];
        await req.body.uploadImage.back.forEach(async (element, index) => {
          const img = await Helper.FileUploadOfBaseData(
            element,
            `./uploads/store/campaign/${campaign._id}/back_cus_img`,
            `img_${index + 1}`
          );
          backImage.push({ image: img });
        });
        campaign.uploadImage.back = backImage;
      }
      campaign = await campaign.save();
      return success(res, "Campaign Created", campaign);
    } catch (error) {
      console.log("error");
      console.log(error);
      return failure(res, error.message, {});
    }
  },
  getCampaignByUrl: async (req, res, next) => {
    try {
      let { url } = req.params;
      let campaign = await Campaign.findOne({
        directUrl: url,
      })
        .populate({
          path: "user",
          select: "name email phone createdAt",
        })
        .populate({
          path: "store",
          select: "title description logo fb insta website",
        })
        .populate({
          path: "product",
          populate: { path: "colors", model: "odpcolor" },
        })
        .lean();
      return success(res, "Get campaign", campaign);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  getAllCampaign: async (req, res, next) => {
    try {
      let { storeId, page, limit } = req.query;
      let query = {};
      query.user = req.user.id;
      storeId || storeId == "undefined" ? (query.store = storeId) : null;
      let total = await Campaign.countDocuments(query);
      page = page ? +page : 1;
      limit = limit ? (limit == "total" ? total : +limit) : 10;

      let campaign = await Campaign.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "user",
          select: "name email phone",
        })
        .populate({
          path: "store",
          select: "title description logo fb insta website",
        })
        .lean();
      return success(res, "Request successfull", {
        page: page,
        limit: limit,
        total: total,
        campaign: campaign,
      });
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  updateCampaign: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { ...updatedObj } = req.body;
      let updated = await Campaign.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
        },
        {
          $set: updatedObj,
        }
      );
      let campaign = await Campaign.findOne({
        _id: mongoose.Types.ObjectId(id),
      })
        .populate({
          path: "user",
          select: "name email phone",
        })
        .populate({
          path: "store",
          select: "title description logo fb insta website",
        })
        .lean();

      return updated.matchedCount
        ? updated.modifiedCount
          ? success(res, "Updated Campaign", campaign)
          : notModified(res, "Not modified", {})
        : notFound(res, "No Content found to modified", {});
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  getCampaignCounterOfUser: async (req, res, next) => {
    try {
      let totalCampaign = await Campaign.countDocuments({
        user: req.user.id,
      });
      let publishedCampaign = await Campaign.countDocuments({
        user: req.user.id,
        status: "published",
      });
      let blockedCampaign = await Campaign.countDocuments({
        user: req.user.id,
        status: "blocked",
      });
      let pendingCampaign = await Campaign.countDocuments({
        user: req.user.id,
        status: "pending",
      });
      return success(res, "Found all campaign count", {
        totalCampaign,
        publishedCampaign,
        blockedCampaign,
        blockedCampaign,
        pendingCampaign,
      });
    } catch (error) {
      failure(res, error.message, {});
    }
  },
  deleteCampaign: async (req, res, next) => {
    try {
      let { id } = req.params;
      let removed = await Campaign.deleteOne({
        _id: mongoose.Types.ObjectId(id),
      });
      return removed.deletedCount
        ? success(res, "Removed successfully", {})
        : notModified(res, "Delete failed", {});
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  uploadFile: async (req, res, next) => {
    try {
      const files = req.files;
      const file = files.file
        ? await Helper.FileUpload(
            files.file,
            "./uploads/store/campaign/",
            Date.now() + "C"
          )
        : "";
      return success(res, "file uploaded", { file });
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
};

module.exports = CampaignController;
