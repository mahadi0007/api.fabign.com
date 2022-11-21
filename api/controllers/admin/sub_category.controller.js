const ObjectId = require("mongoose").Types.ObjectId;
const Category = require("../../../models/category.model");
const SubCategory = require("../../../models/sub_category.model");
const Validator = require("../../validators/sub_category.validator");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const {
  HostURL,
  UploadFile,
  DeleteFile,
  CustomSlug,
} = require("../../helpers");
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
            description: element.description,
            is_hidden: element.is_hidden,
            is_deleteable:
              element.leaf_categories.length || element.elements.length
                ? false
                : true,
            title_image:
              HostURL(req) +
              "uploads/sub_category/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/sub_category/main_images/" +
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
    const { title, description, category } = req.body;

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
    const uploadedTitleImage = await UploadFile(
      files.title_image,
      "./uploads/sub_category/title_images/"
    );
    const uploadedMainImage = await UploadFile(
      files.main_image,
      "./uploads/sub_category/main_images/"
    );
    if (!uploadedTitleImage && !uploadedMainImage) {
      return res.status(501).json({
        status: false,
        message: "Failed to upload images",
      });
    }

    // Custom slug generate
    const slug = await CustomSlug(title);

    // New sub category object
    const newSubCategory = new SubCategory({
      title,
      slug,
      description,
      created_by,
      title_image: uploadedTitleImage,
      main_image: uploadedMainImage,
      main_category: category,
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
      .populate("main_category", "title _id")
      .lean();
    if (result) {
      result.title_image = result.title_image
        ? HostURL(req) +
          "uploads/sub_category/title_images/" +
          result.title_image
        : null;
      result.main_image = result.main_image
        ? HostURL(req) + "uploads/sub_category/main_images/" + result.main_image
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

// Destroy specific item
const Delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await isMongooseId(id);

    // Check available in Sub category
    const isAvailable = await SubCategory.findById({ _id: id });
    if (!isAvailable) {
      return res.status(404).json({
        status: false,
        message: "Category not available.",
      });
    }

    // Denied to delete if elements or leaf category avaiable
    if (isAvailable.elements.length || isAvailable.leaf_categories.length) {
      return res.status(408).json({
        status: false,
        message: "Category not deleteable.",
      });
    }

    // Delete old file
    await DeleteFile(
      "./uploads/sub_category/title_images/",
      isAvailable.title_image
    );
    await DeleteFile(
      "./uploads/sub_category/main_images/",
      isAvailable.main_image
    );

    // Remove from category
    await Category.findByIdAndUpdate(
      isAvailable.main_category,
      { $pull: { sub_categories: { $in: [new ObjectId(isAvailable._id)] } } },
      { multi: true }
    ).exec();

    // Delete from sub category
    await SubCategory.findByIdAndDelete({ _id: id });
    await RedisClient.flushdb();

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
  Delete,
};
