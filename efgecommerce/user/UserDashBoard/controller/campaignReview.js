const { failure, success } = require("../../../common/helper/responseStatus");
const CampaignReview = require("../../../models/UserDashBoard/campaignReview");
const Campaign = require("../../../models/UserDashBoard/Campaign");
const mongoose = require("mongoose");
const Helper = require("../../../common/helper/index");
class CampaignReviewController {
  async addNewRating(req, res) {
    try {
      const files = req.files;
      const user = req.user.id;
      const { campaign, ...rating } = req.body;
      let newRating = new CampaignReview({
        campaign: mongoose.Types.ObjectId(campaign),
        user: user,
        ...rating,
      });
      let uploadFile = [];
      if (files) {
        if (files.images.length) {
          for (let i = 0; i < files.images.length; i++) {
            uploadFile.push(
              await Helper.FileUpload(
                files.images[i],
                "./uploads/store/campaign/review/",
                newRating._id + "_" + i
              )
            );
          }
        } else {
          uploadFile.push(
            await Helper.FileUpload(
              files.images,
              "./uploads/store/campaign/review/",
              newRating._id + "_" + 0
            )
          );
        }
      }
      // let uploadFile = files ? await Helper.FileUpload(files.images, "./uploads/product/review/", newRating._id) : [];
      newRating.images = uploadFile;
      newRating = await newRating.save();

      let campaignRating = await CampaignReview.find({
        campaign: mongoose.Types.ObjectId(campaign),
      })
        .populate({
          path: "user",
          select: "name _id",
        })
        .populate({
          path: "reply",
          populate: {
            path: "user",
            select: "name _id",
          },
        })
        .lean();
      let ratingCount = 0,
        totalRating = 0;
      campaignRating.map((r) => {
        ratingCount++;
        totalRating += r.rating;
      });
      let updated = await Campaign.updateOne(
        { _id: mongoose.Types.ObjectId(campaign) },
        {
          $set: {
            avgRating: +(totalRating / ratingCount).toFixed(1),
            ratingCount,
          },
          $push: {
            ratingReview: newRating._id,
          },
        }
      );
      return success(res, "Rating added ", {
        ratingReview: campaignRating,
        avgRating: +(totalRating / ratingCount).toFixed(1),
        // avgRating: 1,
      });
    } catch (error) {
      console.log(error);
      return failure(res, error.message, error);
    }
  }
  async getAllRating(req, res) {
    try {
      let { page, limit } = req.query;
      page = +page || 1;
      limit = +limit || 10;
      let total = await CampaignReview.countDocuments();
      const rating = await CampaignReview.find({})
        .populate({
          path: "user",
          select: "name _id",
        })
        .populate({
          path: "reply",
          populate: {
            path: "user",
            select: "name _id",
          },
        });
      return rating && rating.length > 0
        ? success(res, "Rating found", {
            page: page,
            limit: limit,
            total: total,
            ratingReview: rating,
          })
        : notFound(res, "No Rating found", {
            page: page,
            limit: limit,
            total: total,
            ratingReview: rating,
          });
    } catch (error) {
      return failure(res, error.message, error);
    }
  }
  async approveRating(req, res) {
    try {
      const { id, approve } = req.body;
      const find = CampaignReview.find({
        _id: mongoose.Types.ObjectId(id),
      });
      const updatedRating = await CampaignReview.findOneAndUpdate(
        { _id: id },
        { $set: { approved: approve } }
      );
      return updatedRating
        ? success(res, "Rating Approved", {
            approvedRating: updatedRating,
          })
        : notFound(res, "No Rating Found");
    } catch (error) {
      return failure(res, error.message, error);
    }
  }
  async getRating(req, res) {
    try {
      let { page, limit, campaign } = req.query;
      page = +page || 1;
      limit = +limit || 10;
      let total = await CampaignReview.countDocuments({
        campaign: mongoose.Types.ObjectId(campaign),
      });
      const rating = await CampaignReview.find({
        campaign: mongoose.Types.ObjectId(campaign),
        approved: true,
      })
        .populate({
          path: "user",
          select: "name _id",
        })
        .populate({
          path: "reply",
          populate: {
            path: "user",
            select: "name _id",
          },
        });
      return rating && rating.length > 0
        ? success(res, "Rating found", {
            page: page,
            limit: limit,
            total: total,
            ratingReview: rating,
          })
        : notFound(res, "No Rating found", {
            page: page,
            limit: limit,
            total: total,
            ratingReview: rating,
          });
    } catch (error) {
      return failure(res, error.message, error);
    }
  }
}

module.exports = new CampaignReviewController();
