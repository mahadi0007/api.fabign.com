const Category = require("../../../models/category2.model");
const Validator = require("../../validators/category.validator");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const { HostURL, UploadFile, IsValidURL } = require("../../helpers");
const {
  Paginate,
  PaginateQueryParams,
} = require("../../helpers/paginate.helpers");
const mongoose = require("mongoose");

// List of items
const Index = async (req, res, next) => {
  try {
    const items = [];
    const { limit, page } = PaginateQueryParams(req.query);

    const totalItems = await Category.countDocuments().exec();
    const results = await Category.find(
      {},
      { is_deleted: false, created_by: 0 }
    )
      .sort({ _id: -1 })
      .skip(parseInt(page) * parseInt(limit) - parseInt(limit))
      .limit(parseInt(limit))
      .exec();

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            title: element.title,
            is_hidden: element.is_hidden,
            is_deleteable: element.sub_categories.length ? false : true,
            title_image:
              HostURL(req) +
              "uploads/category2/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/category2/main_images/" +
              element.main_image,
          });
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
      pagination: Paginate({ page, limit, totalItems }),
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Store item
const Store = async (req, res, next) => {
  try {
    const created_by = req.user.id;
    const files = req.files;
    const { title } = req.body;

    // Validate check
    const validate = await Validator.Store({ ...req.body, files });
    if (!validate.isValid) {
      return res.status(422).json({
        status: false,
        message: validate.error,
      });
    }

    // Upload files
    const uploadedTitleImage = await UploadFile(
      files.title_image,
      "./uploads/category2/title_images/"
    );
    const uploadedMainImage = await UploadFile(
      files.main_image,
      "./uploads/category2/main_images/"
    );
    if (!uploadedTitleImage && !uploadedMainImage) {
      return res.status(501).json({
        status: false,
        message: "Failed to upload images",
      });
    }

    // New category object
    const newCategory = new Category({
      title,
      title_image: uploadedTitleImage,
      main_image: uploadedMainImage,
      created_by,
    });

    // Save to DB
    await newCategory.save();
    await RedisClient.flushdb();

    return res.status(201).json({
      status: true,
      message: "Successfully category created.",
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Show specific item
const Show = async (req, res, next) => {
  try {
    const { id } = req.params;
    await isMongooseId(id);

    let result = await Category.findById({ _id: id });
    if (result) {
      result.title_image = result.title_image
        ? HostURL(req) + "uploads/category2/title_images/" + result.title_image
        : null;
      result.main_image = result.main_image
        ? HostURL(req) + "uploads/category2/main_images/" + result.main_image
        : null;
    }

    res.status(200).json({
      status: true,
      body: result,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Update specific item
const Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files;
    let { ...updateObj } = req.body;
    await isMongooseId(id);

    const is_available = await Category.findById(id);
    if (!is_available) {
      return res.status(404).json({
        status: false,
        message: "Category is not available",
      });
    }
    updateObj["updatedBy"] = req.user.id;
    // check similar title available
    if (updateObj.title) {
      const is_title_available = await Category.find({
        $and: [{ _id: { $ne: id } }, { title: updateObj.title }],
      });

      if (is_title_available && is_title_available.length > 0) {
        return res.status(409).json({
          status: false,
          message: `${title} already exist.`,
        });
      }
    }
    if (IsValidURL(updateObj.title_image)) {
      delete updateObj.title_image;
    }
    if (IsValidURL(updateObj.main_image)) {
      delete updateObj.main_image;
    }
    if (files) {
      if (files.title_image) {
        const uploadedTitleImage = await UploadFile(
          files.title_image,
          "./uploads/category2/title_images/"
        );
        if (!uploadedTitleImage) {
          return res.status(501).json({
            status: false,
            message: "Failed to upload image",
          });
        }
        updateObj["title_image"] = uploadedTitleImage;
      }
      if (files.main_image) {
        const uploadedMainImage = await UploadFile(
          files.main_image,
          "./uploads/category2/main_images/"
        );
        if (!uploadedMainImage) {
          return res.status(501).json({
            status: false,
            message: "Failed to upload image",
          });
        }
        updateObj["main_image"] = uploadedMainImage;
      }
    }

    await Category.findByIdAndUpdate(id, {
      $set: updateObj,
    }).exec();

    await RedisClient.flushdb();

    res.status(201).json({
      status: true,
      message: "Category updated",
    });
  } catch (error) {
    console.log(error);
    if (error) {
      next(error);
    }
  }
};

// Delete specific item
const Delete = async (req, res, next) => {
  try {
    const deleted_by = req.user.id;
    const { id } = req.params;
    await isMongooseId(id);

    const isAvailable = await Category.findById({ _id: id });
    if (!isAvailable) {
      return res.status(404).json({
        status: false,
        message: "Category not available.",
      });
    }

    if (isAvailable.sub_categories.length) {
      return res.status(408).json({
        status: false,
        message: "Category not deleteable.",
      });
    }

    await Category.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      {
        $set: {
          is_deleted: true,
          deleted_at: new Date(),
          deleted_by,
        },
      }
    );

    res.status(200).json({
      status: true,
      message: "Successfully category deleted.",
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  Index,
  Store,
  Show,
  Update,
  Delete,
};
