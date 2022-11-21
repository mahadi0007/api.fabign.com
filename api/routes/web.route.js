const express = require("express");
const WebRouter = express.Router();
const Cache = require("../cache");
const CategoryController = require("../controllers/web/category.controller");
const Category2Controller = require("../controllers/web/category2.controller");
const SubCategoryController = require("../controllers/web/sub_category.controller");
const SubCategory2Controller = require("../controllers/web/sub_category2.controller");
const ButtonType2Controller = require("../controllers/web/button_type2.controller");
const FabricController = require("../controllers/web/fabric.controller");
const Fabric2Controller = require("../controllers/web/fabric2.controller");
const ElementController = require("../controllers/web/element.controller");
const Element2Controller = require("../controllers/web/element2.controller");
const StudioController = require("../controllers/web/studio.controller");
const SizeController = require("../controllers/web/size.controller");
const BackDetailsController = require("../controllers/web/back_details.controller");
const BackDetails2Controller = require("../controllers/web/back_details2.controller");
const {
  createCft,
  getCft,
  getSingleCft,
  deleteCft,
  updateCft,
  getActiveCft,
} = require("../controllers/web/cft.controller");
const CftOrderController = require("../controllers/web/cft_order.controller");
const Measurements = require("../controllers/web/measurements.controller");
const Measurements2 = require("../controllers/web/measurements2.controller");
const MeasurementProfiles = require("../controllers/web/profile.controller");
const MeasurementProfiles2 = require("../controllers/web/profile2.controller");
const { Customer } = require("../../efgecommerce/common/middleware/Permission");
const TopbarController = require("../controllers/web/topbar.controller");
const TopbarButtonController = require("../controllers/web/topbar_button.controller");
const ODPArtWrok = require("../controllers/web/artwork.controller");
const ODPProducts = require("../controllers/web/odpproduct.controller");
const ODPColors = require("../controllers/web/odpcolor.controller");
const Campaign = require("../controllers/web/campaign.controller");
const Store = require("../controllers/web/store.controller");
const BulkFabrics = require("../controllers/web/bulk_fabrics.controller");
const BulkProducts = require("../controllers/web/bulkproduct.controller");
const PromoTutorial = require("../controllers/web/promotutorial.controller");
const PayoutInfo = require("../controllers/web/payoutinfo.controller");
const Pathao = require("../controllers/web/pathao.controller");

/* Category routes */
// WebRouter.get("/category", Cache.Category, CategoryController.Index);
WebRouter.get("/category", CategoryController.Index);
WebRouter.get("/category2", Category2Controller.Index);
// WebRouter.get(
//   "/category/:id",
//   Cache.CategoryType,
//   CategoryController.CategoryType
// );

WebRouter.get("/category/:id", CategoryController.CategoryType);
WebRouter.get("/category2/:id", Category2Controller.CategoryType);

/* Sub category routes */
// WebRouter.get(
//   "/sub-category/:category",
//   Cache.SubCategory,
//   SubCategoryController.Index
// );

WebRouter.get("/sub-category/:category", SubCategoryController.Index);

WebRouter.get("/sub-category2/:category", SubCategory2Controller.Index);

/* Fabric routes */
WebRouter.get("/fabric/:category", FabricController.Index);
WebRouter.get("/fabric/search/:category", FabricController.Search);
WebRouter.get("/fabric2/:category", Fabric2Controller.Index);
WebRouter.get("/fabric2/search/:category", Fabric2Controller.Search);
WebRouter.get("/qualities", FabricController.Qualities);
WebRouter.get("/colors", FabricController.Colors);
WebRouter.get("/types", FabricController.Types);
WebRouter.get("/filter/:category", FabricController.Filter);

/* Element routes */
// WebRouter.get(
//   "/element/:main_category",
//   Cache.ElementByMainCategory,
//   ElementController.All
// );
WebRouter.get("/element/:main_category", ElementController.All);
WebRouter.get("/element/:type/:id", ElementController.Index);

WebRouter.get("/element2/:category", Element2Controller.All);
WebRouter.get("/element2/:type/:id", Element2Controller.Index);

/* Studio routes */
// WebRouter.get(
//   "/studio/default/:category_id",
//   Cache.DefaultElement,
//   StudioController.Default
// );
WebRouter.get("/studio/default/:category_id", StudioController.Default);
WebRouter.get(
  "/studio/change-fabric/:category_id/:fabric_id",
  StudioController.ChangeFabric
);
WebRouter.post(
  "/studio/change-element/:category_id",
  StudioController.ChangeElement
);

WebRouter.get("/button2/default/:category_id", ButtonType2Controller.Default);

/* Size routes */
// WebRouter.get("/size", Cache.Sizes, SizeController.Index);
WebRouter.get("/size", SizeController.Index);

/* Back details routes */
// WebRouter.get(
//   "/back-details/:category",
//   Cache.BacSideElements,
//   BackDetailsController.Index
// );
WebRouter.get("/back-details/:category", BackDetailsController.Index);
WebRouter.get(
  "/back-details/:element/:fabric",
  BackDetailsController.BackSideImage
);

WebRouter.get("/back-details2/:category", BackDetails2Controller.Index);

/* Measurement */
WebRouter.get("/measurements/:category", Measurements.Index);

WebRouter.get("/measurements2/:category", Measurements2.Index);

/* Filter Routes */

/* CFT routes */
WebRouter.post("/cft/", createCft);
WebRouter.get("/cft", getCft);
WebRouter.get("/cft/:id", getSingleCft);
WebRouter.delete("/cft/:id", deleteCft);
WebRouter.put("/cft/:id", updateCft);
WebRouter.get("/active/cft", getActiveCft);

WebRouter.post("/cft-order/", CftOrderController.addCftOrder);
WebRouter.get("/cft-order", CftOrderController.getCftOrder);
WebRouter.get("/cft-order/:id", CftOrderController.getSingleCftOrder);
WebRouter.delete("/cft-order/:id", CftOrderController.deleteCftOrder);
WebRouter.put("/cft-order/:id", CftOrderController.updateCftOrder);

// Measurement Profile ROutes
WebRouter.get("/profile", Customer, MeasurementProfiles.Index);
WebRouter.post("/profile", Customer, MeasurementProfiles.Store);

WebRouter.get("/profile2", Customer, MeasurementProfiles2.Index);
WebRouter.post("/profile2", Customer, MeasurementProfiles2.Store);

// Topbar routes
WebRouter.get("/topbar", TopbarController.Index);

// Topbar button routes
WebRouter.get("/topbar-button", TopbarButtonController.Index);

// ODP Artwork
WebRouter.get("/odpartwork", ODPArtWrok.Index);

// ODP Products
WebRouter.get("/odpproducts", ODPProducts.Index);

// ODP Colors
WebRouter.get("/odpcolors", ODPColors.Index);

// Campaign
WebRouter.get("/campaigns", Campaign.Index);
WebRouter.post("/campaigns/filter", Campaign.filterCampaign);

// Store
WebRouter.get("/stores", Store.Index);
WebRouter.post("/stores/filter", Store.filterStore);

// Bulk Fabrics
WebRouter.get("/bulk-fabrics", BulkFabrics.Index);

// Bulk Products
WebRouter.get("/bulkproducts", BulkProducts.Index);
WebRouter.get("/bulkproducts/:id", BulkProducts.getSingleProduct);

// Promo Tutorial
WebRouter.get("/promotutorial", PromoTutorial.Index);

// Payout Info
WebRouter.get("/payout-info", PayoutInfo.Index);

// Pathao
WebRouter.get("/pathao/getCities", Pathao.GetCities);
WebRouter.get("/pathao/getZones/:city", Pathao.GetZones);
WebRouter.get("/pathao/getAreas/:zone", Pathao.GetAreas);

module.exports = { WebRouter };
