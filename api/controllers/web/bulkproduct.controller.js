const BulkProducts = require("../../../models/bulk_products.model");
const { HostURL } = require("../../helpers");

// Index of Measurement
const Index = async (req, res, next) => {
  try {
    const results = await BulkProducts.find({}, { created_by: 0 }).populate(
      "fabrics"
    );

    const items = [];

    if (results && results.length) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];

        if (element) {
          items.push({
            _id: element._id,
            product_name: element.product_name,
            main_image:
              HostURL(req) +
              "uploads/bulkprod/main_images/" +
              element.main_image,
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

const getSingleProduct = async (req, res, next) => {
  try {
    let { id } = req.params;

    const bulkProduct = await BulkProducts.findById(id)
      .populate({
        path: "fabrics",
        populate: { path: "colors", model: "bulkcolor" },
      })
      .exec();

    if (bulkProduct.main_image) {
      bulkProduct.main_image =
        HostURL(req) + "uploads/bulkprod/main_images/" + bulkProduct.main_image;
    }
    if (bulkProduct.shadow_image) {
      bulkProduct.shadow_image =
        HostURL(req) +
        "uploads/bulkprod/shadow_images/" +
        bulkProduct.shadow_image;
    }
    if (bulkProduct.body_image) {
      bulkProduct.body_image =
        HostURL(req) + "uploads/bulkprod/body_images/" + bulkProduct.body_image;
    }
    if (bulkProduct.collor_image) {
      bulkProduct.collor_image =
        HostURL(req) +
        "uploads/bulkprod/collor_images/" +
        bulkProduct.collor_image;
    }
    if (bulkProduct.cuff_image) {
      bulkProduct.cuff_image =
        HostURL(req) + "uploads/bulkprod/cuff_images/" + bulkProduct.cuff_image;
    }
    if (bulkProduct.front_placket_image) {
      bulkProduct.front_placket_image =
        HostURL(req) +
        "uploads/bulkprod/front_placket_images/" +
        bulkProduct.front_placket_image;
    }
    if (bulkProduct.back_placket_image) {
      bulkProduct.back_placket_image =
        HostURL(req) +
        "uploads/bulkprod/back_placket_images/" +
        bulkProduct.back_placket_image;
    }
    if (bulkProduct.button_image) {
      bulkProduct.button_image =
        HostURL(req) +
        "uploads/bulkprod/button_images/" +
        bulkProduct.button_image;
    }
    if (bulkProduct?.sizeGuide) {
      bulkProduct.sizeGuide =
        HostURL(req) +
        "uploads/bulkprod/sizeGuide_images/" +
        bulkProduct.sizeGuide;
    }
    return bulkProduct
      ? res.json({
          success: true,
          statusCode: 200,
          message: "Fetched bulk product",
          body: bulkProduct,
        })
      : res.json({
          success: false,
          statusCode: 204,
          message: "No bulk product found",
          body: bulkProduct,
        });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  Index,
  getSingleProduct,
};
