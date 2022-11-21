const Profile = require("../../../models/profile.model");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const {
  Paginate,
  PaginateQueryParams,
} = require("../../helpers/paginate.helpers");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const { limit, page } = PaginateQueryParams(req.query);

    const totalItems = await Profile.countDocuments().exec();
    const results = await Profile.find({}, { created_by: 0 })
      .populate("category")
      .sort({ _id: -1 })
      .skip(parseInt(page) * parseInt(limit) - parseInt(limit))
      .limit(parseInt(limit))
      .exec();

    res.status(200).json({
      status: true,
      data: results,
      pagination: Paginate({ page, limit, totalItems }),
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
    let result = await Profile.findById({ _id: id });

    res.status(200).json({
      status: true,
      body: result,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// Delete specific item
const Delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await isMongooseId(id);

    /* Check profile available or not */
    const is_available = await Profile.findById(id);
    if (!is_available) {
      return res.status(404).json({
        status: false,
        message: "Measurement Profile not available.",
      });
    }

    /* Delete measurement from database */
    await Profile.findByIdAndDelete(id);
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
  Show,
  Delete,
};
