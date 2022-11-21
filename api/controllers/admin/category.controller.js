const Category = require("../../../models/category.model");
const Validator = require("../../validators/category.validator");
const { RedisClient } = require("../../cache");
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

// List of items
const Index = async (req, res, next) => {
  try {
    const items = [];
    const { limit, page } = PaginateQueryParams(req.query);

    const totalItems = await Category.countDocuments().exec();
    const results = await Category.find({}, { slug: 0, created_by: 0 })
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
              element.sub_categories.length || element.leaf_categories.length
                ? false
                : true,
            title_image:
              HostURL(req) +
              "uploads/category/title_images/" +
              element.title_image,
            main_image:
              HostURL(req) +
              "uploads/category/main_images/" +
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
    const { title, description } = req.body;

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
      "./uploads/category/title_images/"
    );
    const uploadedMainImage = await UploadFile(
      files.main_image,
      "./uploads/category/main_images/"
    );
    if (!uploadedTitleImage && !uploadedMainImage) {
      return res.status(501).json({
        status: false,
        message: "Failed to upload images",
      });
    }

    // Custom slug generate
    const slug = await CustomSlug(title);

    // New category object
    const newCategory = new Category({
      title,
      slug,
      description,
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
        ? HostURL(req) + "uploads/category/title_images/" + result.title_image
        : null;
      result.main_image = result.main_image
        ? HostURL(req) + "uploads/category/main_images/" + result.main_image
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

    const isAvailable = await Category.findById({ _id: id });
    if (!isAvailable) {
      return res.status(404).json({
        status: false,
        message: "Category not available.",
      });
    }

    if (
      isAvailable.sub_categories.length ||
      isAvailable.leaf_categories.length
    ) {
      return res.status(408).json({
        status: false,
        message: "Category not deleteable.",
      });
    }

    // Delete old file
    await DeleteFile(
      "./uploads/category/title_images/",
      isAvailable.title_image
    );
    await DeleteFile("./uploads/category/main_images/", isAvailable.main_image);

    await Category.findByIdAndDelete({ _id: id });
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
