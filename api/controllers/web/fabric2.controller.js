const Fabric = require("../../../models/fabric2.model");
const FabricQuality = require("../../../models/quality.model");
const FabricColor = require("../../../models/colors.models");
const FabricType = require("../../../models/types.model");
const { HostURL } = require("../../helpers");
const { isMongooseId } = require("../../middleware/checkId.middleware");
const { Paginate } = require("../../helpers/paginate.helpers");

// List of items for specific category
const Index = async (req, res, next) => {
  try {
    // console.log("Index Fabric");
    const items = [];
    let { page } = req.query;
    const { category } = req.params;
    if (!page || page <= 0) page = 1;

    await isMongooseId(category);
    // if (!category) {
    //   return res.status(200).json({
    //     status: true,
    //   });
    // }

    const totalItems = await Fabric.countDocuments({ category });
    const results = await Fabric.find(
      { $and: [{ category }, { stock_status: true }] },
      {
        title: 1,
        original_price: 1,
        sample_price: 1,
        sub_category_prices: 1,
        quality: 1,
        is_hidden: 1,
        main_image: 1,
        color: 1,
        type: 1,
      }
    )
      // .populate("rating")
      .populate("color")
      .populate("type")
      .populate("quality")
      .sort({ _id: -1 })
      .skip(parseInt(page) * 6 - 6)
      .limit(6)
      .exec();

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        items.push({
          _id: element._id,
          title: element.title,
          original_price: element.original_price,
          sample_price: element.sample_price,
          sub_category_prices: element.sub_category_prices,
          quality: element.quality,
          is_hidden: element.is_hidden,
          rating:
            element.rating && element.rating.length > 0 ? element.rating : 0,
          type: element.type,
          color: element.color,
          main_image:
            HostURL(req) + "uploads/fabric2/main_images/" + element.main_image,
        });
      }
    }

    res.status(200).json({
      status: true,
      data: items,
      pagination: Paginate({ page, limit: 6, totalItems }),
    });
  } catch (error) {
    console.log("error");
    console.log(error);
    if (error) next(error);
  }
};

// Search fabric
const Search = async (req, res, next) => {
  try {
    const items = [];
    const { query } = req.query;
    const { category } = req.params;

    if (!query) {
      return res.status(422).json({
        status: false,
        query: "Query is required.",
      });
    }

    await isMongooseId(category);

    const queryValue = new RegExp(query, "i");
    const results = await Fabric.find(
      {
        $and: [
          { category },
          { stock_status: true },
          {
            $or: [{ title: queryValue }, { sub_title: queryValue }],
          },
        ],
      },
      {
        slug: 1,
        title: 1,
        sub_title: 1,
        weave: 1,
        weight: 1,
        original_price: 1,
        sub_category_prices: 1,
        quality: 1,
        is_hidden: 1,
        brand: 1,
        company: 1,
        rating: 1,
        title_image: 1,
      }
    )
      .populate("brand")
      .populate("company")
      .populate("rating")
      .sort({ _id: -1 })
      .sort({ _id: -1 })
      .exec();

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        items.push({
          _id: element._id,
          slug: element.slug,
          title: element.title,
          sub_title: element.sub_title,
          weave: element.weave,
          weight: element.weight,
          original_price: element.original_price,
          sub_category_prices: element.sub_category_prices,
          quality: element.quality,
          is_hidden: element.is_hidden,
          brand: element.brand || null,
          company: element.company || null,
          rating:
            element.rating && element.rating.length > 0 ? element.rating : 0,
          title_image:
            HostURL(req) + "uploads/fabric/title_images/" + element.title_image,
        });
      }
    }

    res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    if (error) next(error);
  }
};

// get fabric quality
const Qualities = async (req, res, next) => {
  try {
    const results = await FabricQuality.find({}, { quality: 1 }).exec();

    res.status(200).json({
      status: true,
      data: results,
    });
  } catch (error) {
    if (error) console.log(error);
  }
};

// get fabric colors
const Colors = async (req, res, next) => {
  try {
    const results = await FabricColor.find({}, { color: 1 }).exec();

    res.status(200).json({
      status: true,
      data: results,
    });
  } catch (error) {
    if (error) console.log(error);
  }
};

// get types
const Types = async (req, res, next) => {
  try {
    const results = await FabricType.find({}, { type: 1 }).exec();

    res.status(200).json({
      status: true,
      data: results,
    });
  } catch (error) {
    if (error) console.log(error);
  }
};

// filter fabric
const Filter = async (req, res, next) => {
  // try {
  const { category } = req.params;
  const { color, type, quality } = req.query;

  await isMongooseId(category);
  await isMongooseId(color);
  await isMongooseId(type);

  const items = [];
  const results = await Fabric.find(
    {
      $and: [{ category }, { stock_status: true }],
      $or: [{ color: color }, { type: type }, { quality: quality }],
    },
    {
      slug: 1,
      title: 1,
      sub_title: 1,
      weave: 1,
      weight: 1,
      original_price: 1,
      sub_category_prices: 1,
      quality: 1,
      is_hidden: 1,
      brand: 1,
      company: 1,
      rating: 1,
      title_image: 1,
      color: 1,
      type: 1,
    }
  )
    .populate("brand")
    .populate("company")
    .populate("rating")
    .sort({ _id: -1 })
    .exec();

  if (results && results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      items.push({
        _id: element._id,
        slug: element.slug,
        title: element.title,
        sub_title: element.sub_title,
        weave: element.weave,
        weight: element.weight,
        original_price: element.original_price,
        sub_category_prices: element.sub_category_prices,
        quality: element.quality,
        is_hidden: element.is_hidden,
        brand: element.brand || null,
        company: element.company || null,
        color: element.color || null,
        type: element.type || null,
        rating:
          element.rating && element.rating.length > 0 ? element.rating : 0,
        title_image:
          HostURL(req) + "uploads/fabric/title_images/" + element.title_image,
      });
    }
  }

  res.status(200).json({
    status: true,
    data: items,
  });
  // } catch (error) {
  //     if (error) next(error)
  // }
};

module.exports = {
  Index,
  Search,
  Qualities,
  Colors,
  Types,
  Filter,
};
