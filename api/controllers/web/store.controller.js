const Store = require("../../../efgecommerce/models/UserDashBoard/Store");

const Index = async (req, res, next) => {
  try {
    const results = await Store.find({}, { created_by: 0 });

    const items = [];

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            logo: element.logo,
            cover: element.cover,
            title: element.title,
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

const filterStore = async (req, res, next) => {
  try {
    let query = {};
    const items = [];
    console.log(req.body.title);
    if (req.body.title) {
      query["title"] = new RegExp(req.body.title, "i");
    }
    const results = await Store.find(query);
    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            logo: element.logo,
            cover: element.cover,
            title: element.title,
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
  filterStore,
};
