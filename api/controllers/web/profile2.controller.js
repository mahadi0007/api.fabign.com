const Profile = require("../../../models/profile2.model");
const validator = require("../../validators/profile.validator");
const { RedisClient } = require("../../cache");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const {
  Paginate,
  PaginateQueryParams,
} = require("../../helpers/paginate.helpers");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const created_by = req.user.id;
    const { limit, page } = PaginateQueryParams(req.query);

    const totalItems = await Profile.countDocuments().exec();
    const results = await Profile.find(
      { created_by },
      { created_by: 0, category: 0 }
    )
      .populate("category")
      .exec();

    res.status(200).json({
      status: true,
      data: results,
      pagination: Paginate({ page, limit, totalItems }),
    });
  } catch (error) {
    console.log("error");
    console.log(error);
    if (error) next(error);
  }
};

// Store an item
const Store = async (req, res, next) => {
  try {
    const created_by = req.user.id;
    const {
      category,
      size,
      profile_name,
      chest,
      waist,
      hip,
      long_sleeve,
      half_sleeve,
      front_length,
      back_length,
      collar,
      shoulder,
      cuff,
      length,
      thigh,
      bottom,
      inside_leg,
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
    const isExist = await Profile.findOne({
      $and: [{ profile_name }, { category }],
    });
    if (isExist) {
      return res.status(409).json({
        status: false,
        message: `${profile_name} already exist.`,
      });
    }

    const newProfile = new Profile({
      category: category,
      size: size,
      profile_name: profile_name,
      chest: chest,
      waist: waist,
      hip: hip,
      long_sleeve: long_sleeve,
      half_sleeve: half_sleeve,
      front_length: front_length,
      back_length: back_length,
      collar: collar,
      shoulder: shoulder,
      cuff: cuff,
      length: length,
      thigh: thigh,
      bottom: bottom,
      inside_leg: inside_leg,
      created_by: created_by,
    });

    await newProfile.save();
    await RedisClient.flushdb();

    res.status(201).json({
      status: true,
      message: "Successfully measurement created.",
    });
  } catch (error) {
    if (error) next(error);
  }
};

module.exports = {
  Index,
  Store,
};
