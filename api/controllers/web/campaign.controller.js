const Campaign = require("../../../efgecommerce/models/UserDashBoard/Campaign");
const moment = require("moment");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const results = await Campaign.find({}, { created_by: 0 });
    // const results = await Campaign.find({
    //   startDate: { $gte: moment(new Date()).format("M/D/YYYY") },
    //   endDate: { $lte: moment(new Date()).format("M/D/YYYY") },
    // });

    const items = [];
    let tags = [];

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
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
          tags = tags.concat(element.tags);
        }
      }
    }

    res.status(200).json({
      status: true,
      data: items,
      tags: [...new Set(tags)],
    });
  } catch (error) {
    if (error) next(error);
  }
};

const filterCampaign = async (req, res, next) => {
  try {
    let query = {};
    const items = [];
    if (req.body.title) {
      query["title"] = new RegExp(req.body.title, "i");
    }
    if (req.body.tagList.length > 0) {
      query["tags"] = { $in: req.body.tagList };
    }
    if (req.body.colorList.length > 0) {
      query["color"] = { $in: req.body.colorList };
    }
    if (req.body.typeList.length > 0) {
      query["type"] = { $in: req.body.typeList };
    }
    const results = await Campaign.find(query);
    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
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
          });
        }
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

module.exports = {
  Index,
  filterCampaign,
};
