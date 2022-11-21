const ObjectId = require("mongoose").Types.ObjectId;
const Category = require("../../../models/category2.model");
const SubCategory = require("../../../models/sub_category2.model");
const Validator = require("../../validators/sub_category.validator");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const { HostURL, UploadFile } = require("../../helpers");
const {
  Paginate,
  PaginateQueryParams,
} = require("../../helpers/paginate.helpers");
const { RedisClient } = require("../../cache");

// List of items
const Index = async (req, res, next) => {
  try {
    const items = [];
    const { limit, page } = PaginateQueryParams(req.query);

    const totalItems = await SubCategory.countDocuments().exec();
    const results = await SubCategory.find({}, { slug: 0, created_by: 0 })
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
            main_image:
              HostURL(req) +
              "uploads/sub_category2/main_images/" +
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
    const { title, category } = req.body;

    await isMongooseId(category);

    // Validate check
    const validate = await Validator.Store({ ...req.body, files });
    if (!validate.isValid) {
      return res.status(422).json({
        status: false,
        message: validate.error,
      });
    }

    // Upload files
    const uploadedMainImage = await UploadFile(
      files.main_image,
      "./uploads/sub_category2/main_images/"
    );
    if (!uploadedMainImage) {
      return res.status(501).json({
        status: false,
        message: "Failed to upload images",
      });
    }
    // New sub category object
    const newSubCategory = new SubCategory({
      title,
      created_by,
      main_image: uploadedMainImage,
      category,
    });

    // Save to DB
    const createdSubCategory = await newSubCategory.save();
    if (!createdSubCategory) {
      return res.status(500).json({
        status: false,
        message: "Failed to create sub category.",
      });
    }

    // update to category
    await Category.findByIdAndUpdate(
      { _id: category },
      { $push: { sub_categories: createdSubCategory._id } }
    );
    await RedisClient.flushdb();

    return res.status(201).json({
      status: true,
      message: "Successfully sub category created.",
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
    let result = await SubCategory.findById({ _id: id })
      .populate("category", "title _id")
      .lean();
    if (result) {
      result.main_image = result.main_image
        ? HostURL(req) +
          "uploads/sub_category2/main_images/" +
          result.main_image
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

    const is_available = await SubCategory.findById(id);
    if (!is_available) {
      return res.status(404).json({
        status: false,
        message: "SubCategory is not available",
      });
    }
    updateObj["updatedBy"] = req.user.id;
    // check similar title available
    if (updateObj.title) {
      const is_title_available = await SubCategory.find({
        $and: [{ _id: { $ne: id } }, { title: updateObj.title }],
      });

      if (is_title_available && is_title_available.length > 0) {
        return res.status(409).json({
          status: false,
          message: `${title} already exist.`,
        });
      }
    }
    if (IsValidURL(updateObj.main_image)) {
      delete updateObj.main_image;
    }
    if (files) {
      if (files.main_image) {
        const uploadedMainImage = await UploadFile(
          files.main_image,
          "./uploads/sub_category2/main_images/"
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

    await SubCategory.findByIdAndUpdate(id, {
      $set: updateObj,
    }).exec();

    if (is_available.category !== updateObj.category) {
      await Category.findByIdAndUpdate(
        is_available.category,
        { $pull: { sub_categories: { $in: [new ObjectId(id)] } } },
        { multi: true }
      ).exec();
      await Category.findByIdAndUpdate(
        { _id: updateObj.category },
        { $push: { sub_categories: id } }
      ).exec();
    }
    await RedisClient.flushdb();

    res.status(201).json({
      status: true,
      message: "Sub Category updated",
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

    // Check available in Sub category
    const isAvailable = await SubCategory.findById({ _id: id });
    if (!isAvailable) {
      return res.status(404).json({
        status: false,
        message: "Sub Category not available.",
      });
    }

    // Denied to delete if elements or leaf category avaiable
    if (isAvailable.elements.length) {
      return res.status(408).json({
        status: false,
        message: "Sub Category not deleteable.",
      });
    }

    // Remove from category
    await Category.findByIdAndUpdate(
      isAvailable.category,
      { $pull: { sub_categories: { $in: [new ObjectId(isAvailable._id)] } } },
      { multi: true }
    ).exec();

    // Delete from sub category
    // await SubCategory.findByIdAndDelete({ _id: id });
    await SubCategory.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          is_deleted: true,
          deleted_at: new Date(),
          deleted_by,
        },
      }
    );
    await RedisClient.flushdb();

    res.status(200).json({
      status: true,
      message: "Successfully sub category deleted.",
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
