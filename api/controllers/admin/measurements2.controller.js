const mongoose = require("mongoose");
const {
  success,
  failure,
} = require("../../../efgecommerce/common/helper/responseStatus");
const Measurements = require("../../../models/measurement2.model");
const validator = require("../../validators/measurements.validator");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const {
  Paginate,
  PaginateQueryParams,
} = require("../../helpers/paginate.helpers");
const { UploadFile, HostURL, IsValidURL } = require("../../helpers");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const { limit, page } = PaginateQueryParams(req.query);

    const totalItems = await Measurements.countDocuments().exec();
    const results = await Measurements.find({}, { created_by: 0 })
      .populate("category")
      .sort({ _id: -1 })
      .skip(parseInt(page) * parseInt(limit) - parseInt(limit))
      .limit(parseInt(limit))
      .exec();

    const items = [];

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            measurement_name: element.measurement_name,
            category: element.category,
            measurementVideo: element.measurementVideo,
            variable_name: element.variable_name,
            measurementIcon:
              HostURL(req) +
              "uploads/measurements2/main_images/" +
              element.measurementIcon,
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

// Store an item
const Store = async (req, res, next) => {
  try {
    const created_by = req.user.id;
    const files = req.files;
    const {
      category,
      measurement_name,
      measurementVideo,
      variable_name,
      size_xs,
      size_s,
      size_m,
      size_l,
      size_xl,
      size_xll,
    } = req.body;

    // checking if it's a mongoose id
    await isMongooseId(category);

    // Validate check
    const validate = await validator.Store(req.body);
    if (!validate.isValid) {
      return res.status(422).json({
        status: false,
        message: validate.error,
      });
    }

    // Check exist
    const isExist = await Measurements.findOne({
      $and: [{ measurement_name }, { category }],
    });
    if (isExist) {
      return res.status(409).json({
        status: false,
        message: `${measurement_name} already exist.`,
      });
    }
    const uploadedmeasurementIcon = await UploadFile(
      files.measurementIcon,
      "./uploads/measurements2/main_images/"
    );

    if (!uploadedmeasurementIcon) {
      return res.status(501).json({
        status: false,
        message: "Failed to upload images",
      });
    }

    const newMeasurement = new Measurements({
      category: category,
      measurement_name: measurement_name,
      measurementIcon: uploadedmeasurementIcon,
      measurementVideo: measurementVideo,
      variable_name: variable_name,
      size_xs: size_xs,
      size_s: size_s,
      size_m: size_m,
      size_l: size_l,
      size_xl: size_xl,
      size_xll: size_xll,
      created_by: created_by,
    });

    await newMeasurement.save();
    await RedisClient.flushdb();

    res.status(201).json({
      status: true,
      message: "Successfully measurement created.",
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
    let result = await Measurements.findById({ _id: id })
      .populate("category", "title _id")
      .lean();

    if (result) {
      result.measurementIcon = result.measurementIcon
        ? HostURL(req) +
          "uploads/measurements2/main_images/" +
          result.measurementIcon
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
const Update = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    let { ...updateObj } = req.body;

    const is_available = await Measurements.findById(id);
    if (!is_available) {
      return res.status(404).json({
        status: false,
        message: "Measurement is not available",
      });
    }

    updateObj["updatedBy"] = req.user.id;
    if (IsValidURL(updateObj?.measurementIcon)) {
      delete updateObj.measurementIcon;
    }
    if (files?.measurementIcon) {
      const uploadedmeasurementIcon = await UploadFile(
        files.measurementIcon,
        "./uploads/measurements2/main_images/"
      );

      if (!uploadedmeasurementIcon) {
        return res.status(501).json({
          status: false,
          message: "Failed to upload images",
        });
      }
      updateObj["measurementIcon"] = uploadedmeasurementIcon;
    }
    await Measurements.updateOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        $set: updateObj,
      }
    );

    const measurement = await Measurements.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    return success(res, "Successfully Updated Measurement", measurement);
  } catch (error) {
    return failure(res, error.message, error);
  }
};

// Delete specific item
const Delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await isMongooseId(id);

    /* Check fabric available or not */
    const is_available = await Measurements.findById(id);
    if (!is_available) {
      return res.status(404).json({
        status: false,
        message: "Measurement not available.",
      });
    }

    /* Delete measurement from database */
    await Measurements.findByIdAndDelete(id);
    await RedisClient.flushdb();

    res.status(200).json({
      status: true,
      message: "Successfully deleted.",
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
