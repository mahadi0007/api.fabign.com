const {
  success,
  failure,
  notFound,
  notModified,
} = require("../../../common/helper/responseStatus");
const Helper = require("../../../common/helper/index");
const Store = require("../../../models/UserDashBoard/Store");
const Campaign = require("../../../models/UserDashBoard/Campaign");
const mongoose = require("mongoose");
const { HostURL } = require("../../../../api/helpers");
const storeController = {
  addStore: async (req, res) => {
    try {
      const files = req.files;
      const user = req.user.id;
      let { title, description, fb, insta, website } = req.body;
      let isAvailableStore = await Store.countDocuments({ user: user });
      if (isAvailableStore) {
        return res.json({
          statusCode: 304,
          success: false,
          message: "User already created his store",
        });
      }
      let store = new Store({
        title: title,
        description: description,
        fb: fb,
        insta: insta,
        website: website,
        user: user,
      });

      const logo = files.logo
        ? await Helper.FileUpload(
            files.logo,
            "./uploads/store/logo/",
            store._id
          )
        : "";
      const cover = files.cover
        ? await Helper.FileUpload(
            files.cover,
            "./uploads/store/cover/",
            store._id
          )
        : "";

      store.logo = logo;
      store.cover = cover;

      store = await store.save();
      return success(res, "Store created", store);
    } catch (error) {
      console.log(error);
      return failure(res, error.message, {});
    }
  },
  getAllStore: async (req, res) => {
    try {
      let store = await Store.find({}).populate("user", "name _id").lean();
      return store && store.length > 0
        ? success(res, "Found stores", store)
        : notFound(res, "No data found", store);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  getSingleStore: async (req, res) => {
    try {
      let { id } = req.params;
      let store = await Store.findOne({
        _id: mongoose.Types.ObjectId(id),
      })
        .populate("user", "name email createdAt _id")
        .populate("campaign", "front directUrl sellingPrice title _id")
        .lean();
      let campaign = await Campaign.find({ store: store._id });
      const campaignItems = [];
      if (campaign && campaign.length) {
        for (let i = 0; i < campaign.length; i++) {
          const element = campaign[i];

          if (element) {
            campaignItems.push({
              _id: element._id,
              featuredImage: {
                large: element.front,
              },
              variation: {
                parents: [],
                values: [
                  {
                    sellingPrice: element.sellingPrice,
                  },
                ],
              },
              name: element.title,
              directUrl: element.directUrl,
            });
          }
        }
      }
      return store
        ? success(res, "Found stores", { store, campaignItems })
        : notFound(res, "No data found", store);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  getStoreByUser: async (req, res) => {
    try {
      let user = req.user.id;
      let store = await Store.findOne({ user: mongoose.Types.ObjectId(user) })
        .populate("user", "name _id")
        .lean();
      return store
        ? success(res, "Found stores", store)
        : notFound(res, "No data found", store);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  updateStore: async (req, res) => {
    try {
      const { ...body } = req.body;
      const { id } = req.params;
      if (req.files) {
        const files = req.files;
        if (files?.logo) {
          const logo = files.logo
            ? await Helper.FileUpload(files.logo, "./uploads/store/logo/", id)
            : "";
          logo ? (body.logo = logo) : null;
        }
        if (files?.cover) {
          const cover = files.cover
            ? await Helper.FileUpload(files.cover, "./uploads/store/cover/", id)
            : "";
          cover ? (body.cover = cover) : null;
        }
      }
      const user = req.user.id;
      let isUserStore = await Store.countDocuments({
        user: mongoose.Types.ObjectId(user),
        _id: mongoose.Types.ObjectId(id),
      });
      if (!isUserStore) {
        return res.json({
          success: false,
          statusCode: 401,
          message: "You have no access to update it",
        });
      }

      let updated = await Store.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: body }
      );
      let store = await Store.findOne({ _id: mongoose.Types.ObjectId(id) })
        .populate("user", "name _id")
        .lean();

      return updated.matchedCount
        ? updated.modifiedCount
          ? success(res, "Successfully Updated", store)
          : notModified(res, "Not modified", store)
        : notFound(res, "No content found", {});
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  followStore: async (req, res) => {
    try {
      const { ...body } = req.body;
      const { id } = req.params;
      await Store.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        {
          $set: body,
        }
      );
      let store = await Store.findOne({ _id: mongoose.Types.ObjectId(id) })
        .populate("user", "name _id")
        .lean();

      return success(res, "Follow Store", store);
    } catch (error) {
      console.log("error");
      console.log(error);
      return failure(res, error.message, {});
    }
  },
  unFollowStore: async (req, res) => {
    try {
      let user = req.user.id;
      const { id } = req.params;
      await Store.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        {
          $pull: {
            follow: user,
          },
        }
      );
      let store = await Store.findOne({ _id: mongoose.Types.ObjectId(id) })
        .populate("user", "name _id")
        .lean();

      return success(res, "Unfollowed Store", store);
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
  removeStore: async (req, res) => {
    try {
      let { id } = req.params;
      let user = req.user.id;
      let isUserStore = await Store.countDocuments({
        user: mongoose.Types.ObjectId(user),
        _id: mongoose.Types.ObjectId(id),
      });
      if (!isUserStore) {
        return res.json({
          success: false,
          statusCode: 401,
          message: "You have no access to update it",
        });
      }
      let store = await Store.remove({ _id: mongoose.Types.ObjectId(id) });
      await Campaign.remove({ store: { $in: store._id } });
      return success(res, "Removed successfully", {});
    } catch (error) {
      return failure(res, error.message, {});
    }
  },
};

module.exports = storeController;
