const express = require("express");
const AdminRouter = express.Router();
const DashboardController = require("../controllers/admin/dashboard.controller");
const AdminController = require("../controllers/admin/admin.controller");
const UserController = require("../controllers/admin/user.controller");
const CategoryController = require("../controllers/admin/category.controller");
const Category2Controller = require("../controllers/admin/category2.controller");
const SubCategoryController = require("../controllers/admin/sub_category.controller");
const SubCategory2Controller = require("../controllers/admin/sub_category2.controller");
const SizeController = require("../controllers/admin/size.controller");
const SubButtonController = require("../controllers/admin/subbutton.controller");
const SearchController = require("../controllers/admin/search.controller");
const MeasurementsController = require("../controllers/admin/measurements.controller");
const Measurements2Controller = require("../controllers/admin/measurements2.controller");
const MeasurementProfiles = require("../controllers/admin/profile.controller");
const TopbarController = require("../controllers/admin/topbar.controller");
const TopbarButtonController = require("../controllers/admin/topbar_button.controller");
const ECatergoryController = require("../controllers/admin/e_category.controller");
const ESubCatergoryController = require("../controllers/admin/e_sub_category.controller");
const EBrandController = require("../controllers/admin/e_brand.controller");
const EProductController = require("../controllers/admin/e_product.controller");
const ESliderController = require("../controllers/admin/e_slider.controller");
const EBannerController = require("../controllers/admin/e_banner.controller");
const EOrders = require("../controllers/admin/e_orders.controller");
const ERatingController = require("../controllers/admin/e_rating.controller");
const EFaqController = require("../controllers/admin/e_faq.controller");
const EAdditionalInfoController = require("../controllers/admin/e_additional_info.controller");
const VariationController = require("../controllers/admin/variation.controller");
const ShippingChargeController = require("../controllers/admin/shipping_charge.controller");
const ReportController = require("../controllers/admin/report.controller");
const StockManagementController = require("../controllers/admin/stock_management.controller");
const PromotionManagementController = require("../controllers/admin/promotion_management.controller");
const PromoTutorialManageController = require("../controllers/admin/promo_tutorial_manage.controller");
const CouponManageController = require("../controllers/admin/coupon_management.controller");
const PayoutInfoController = require("../controllers/admin/payout_info.controller");
const PathaoController = require("../controllers/web/pathao.controller");
const SMSTemplateController = require("../controllers/admin/sms-template.controller");
const PaymentRequestController = require("../controllers/admin/payment_request.controller");
const StockHistoryController = require("../controllers/admin/stock_history.controller");
const StockReasonController = require("../controllers/admin/stock_reason.controller");

// Dashborad routes
AdminRouter.get("/dashboard", DashboardController.Index);

// Admin routes
AdminRouter.get("/admin", AdminController.Index);
AdminRouter.post("/admin", AdminController.Store);
AdminRouter.get("/admin/:id", AdminController.Show);
AdminRouter.put("/admin/:id", AdminController.Update);
AdminRouter.delete("/admin/:id", AdminController.Delete);

// User routes
AdminRouter.get("/user", UserController.Index);
AdminRouter.post("/user", UserController.Store);
AdminRouter.get("/user/:id", UserController.Show);
AdminRouter.put("/user/:id", UserController.Update);
AdminRouter.delete("/user/:id", UserController.Delete);

// Category routes
AdminRouter.get("/category", CategoryController.Index);
AdminRouter.post("/category", CategoryController.Store);
AdminRouter.get("/category/:id", CategoryController.Show);
AdminRouter.delete("/category/:id", CategoryController.Delete);

// Category2 routes
AdminRouter.get("/category2", Category2Controller.Index);
AdminRouter.post("/category2", Category2Controller.Store);
AdminRouter.get("/category2/:id", Category2Controller.Show);
AdminRouter.put("/category2/:id", Category2Controller.Update);
AdminRouter.delete("/category2/:id", Category2Controller.Delete);

// Sub-category routes
AdminRouter.get("/sub-category", SubCategoryController.Index);
AdminRouter.post("/sub-category", SubCategoryController.Store);
AdminRouter.get("/sub-category/:id", SubCategoryController.Show);
AdminRouter.delete("/sub-category/:id", SubCategoryController.Delete);

AdminRouter.get("/sub-category2", SubCategory2Controller.Index);
AdminRouter.post("/sub-category2", SubCategory2Controller.Store);
AdminRouter.get("/sub-category2/:id", SubCategory2Controller.Show);
AdminRouter.put("/sub-category2/:id", SubCategory2Controller.Update);
AdminRouter.delete("/sub-category2/:id", SubCategory2Controller.Delete);

// Size routes
AdminRouter.get("/size", SizeController.Index);
AdminRouter.post("/size", SizeController.Store);
AdminRouter.get("/size/:id", SizeController.Show);
AdminRouter.put("/size/:id", SizeController.Update);

// Measurements route
AdminRouter.get("/measurement", MeasurementsController.Index);
AdminRouter.post("/measurement", MeasurementsController.Store);
AdminRouter.get("/measurement/:id", MeasurementsController.Show);
AdminRouter.delete("/measurement/:id", MeasurementsController.Delete);

AdminRouter.get("/measurement2", Measurements2Controller.Index);
AdminRouter.post("/measurement2", Measurements2Controller.Store);
AdminRouter.get("/measurement2/:id", Measurements2Controller.Show);
AdminRouter.put("/measurement2/:id", Measurements2Controller.Update);
AdminRouter.delete("/measurement2/:id", Measurements2Controller.Delete);

// Measurement Profile Route
AdminRouter.get("/profile", MeasurementProfiles.Index);
AdminRouter.get("/profile/:id", MeasurementProfiles.Show);
AdminRouter.delete("/profile/:id", MeasurementProfiles.Delete);

// Sub Button route
AdminRouter.get("/sub-button", SubButtonController.Index);
AdminRouter.get(
  "/sub-button/make-default/:id/:category/:subcategory",
  SubButtonController.MakeDefault
);

// Search routes
AdminRouter.get("/search/admin", SearchController.AdminSearch);
AdminRouter.get("/search/user", SearchController.UserSearch);
AdminRouter.get("/search/category", SearchController.CategorySearch);
AdminRouter.get("/search/category2", SearchController.Category2Search);
AdminRouter.get("/search/sub-category", SearchController.SubCategorySearch);
AdminRouter.get("/search/sub-category2", SearchController.SubCategory2Search);
AdminRouter.get("/search/leaf-category", SearchController.LeafCategorySearch);
AdminRouter.get("/search/element", SearchController.ElementSearch);
AdminRouter.get("/search/element2", SearchController.Element2Search);
AdminRouter.get("/search/size", SearchController.SizeSearch);
AdminRouter.get("/search/fabric", SearchController.FabricSearch);
AdminRouter.get("/search/fabric2", SearchController.Fabric2Search);
AdminRouter.get("/search/color", SearchController.ColorSearch);
AdminRouter.get("/search/type", SearchController.TypeSearch);
AdminRouter.get("/search/quality", SearchController.QualitySearch);

// Topbar router
AdminRouter.get("/topbar", TopbarController.Index);
AdminRouter.post("/topbar", TopbarController.Store);
AdminRouter.get("/topbar/:id", TopbarController.Show);
AdminRouter.put("/topbar/:id", TopbarController.Update);
AdminRouter.put("/topbar/makedefault/:id", TopbarController.MakeDefault);
AdminRouter.delete("/topbar/delete/:id", TopbarController.Delete);

// Topbar button router
AdminRouter.get("/topbar-button", TopbarButtonController.Index);
AdminRouter.put("/topbar-button/:id", TopbarButtonController.Update);

// E Category
AdminRouter.get("/e-category", ECatergoryController.Index);
AdminRouter.post("/e-category", ECatergoryController.Store);
AdminRouter.get("/e-category/:id", ECatergoryController.Show);
AdminRouter.put("/e-category/:id", ECatergoryController.Update);
AdminRouter.delete("/e-category/delete/:id", ECatergoryController.Delete);

// E Sub Category
AdminRouter.get("/e-sub-category", ESubCatergoryController.Index);
AdminRouter.post("/e-sub-category", ESubCatergoryController.Store);
AdminRouter.get("/e-sub-category/:id", ESubCatergoryController.Show);
AdminRouter.put("/e-sub-category/:id", ESubCatergoryController.Update);
AdminRouter.delete(
  "/e-sub-category/delete/:id",
  ESubCatergoryController.Delete
);

// E Brand
AdminRouter.get("/e-brand", EBrandController.Index);
AdminRouter.post("/e-brand", EBrandController.Store);
AdminRouter.get("/e-brand/:id", EBrandController.Show);
AdminRouter.put("/e-brand/:id", EBrandController.Update);
AdminRouter.delete("/e-brand/delete/:id", EBrandController.Delete);

// E Product
AdminRouter.get("/e-product", EProductController.Index);
AdminRouter.post("/e-product", EProductController.Store);
AdminRouter.get("/e-product/:id", EProductController.Show);
AdminRouter.put("/e-product/:id", EProductController.Update);
AdminRouter.delete("/e-product/delete/:id", EProductController.Delete);

// E Slider
AdminRouter.get("/e-slider", ESliderController.Index);
AdminRouter.post("/e-slider", ESliderController.Store);
AdminRouter.get("/e-slider/:id", ESliderController.Show);
AdminRouter.put("/e-slider/:id", ESliderController.Update);
AdminRouter.delete("/e-slider/delete/:id", ESliderController.Delete);

// E Banner
AdminRouter.get("/e-banner", EBannerController.Index);
AdminRouter.post("/e-banner", EBannerController.Store);
AdminRouter.get("/e-banner/:id", EBannerController.Show);
AdminRouter.put("/e-banner/:id", EBannerController.Update);
AdminRouter.delete("/e-banner/delete/:id", EBannerController.Delete);

// E Orders
AdminRouter.get("/e-orders", EOrders.Index);
AdminRouter.post("/e-orders", EOrders.Store);
AdminRouter.get("/e-orders/:id", EOrders.Show);
AdminRouter.put("/e-orders/:id", EOrders.Update);
AdminRouter.put("/e-orders/cancel-item/:id", EOrders.CancelItem);
AdminRouter.delete("/e-orders/delete/:id", EOrders.Delete);

// E Rating
AdminRouter.get("/e-rating", ERatingController.Index);
AdminRouter.get("/e-rating/:id", ERatingController.Show);
AdminRouter.put("/e-rating/:id", ERatingController.Update);
AdminRouter.delete("/e-rating/delete/:id/:productId", ERatingController.Delete);

// E FAQ Info
AdminRouter.get("/e-faq", EFaqController.Index);
AdminRouter.get("/e-faq/products", EFaqController.ProductWithFaq);
AdminRouter.post("/e-faq", EFaqController.Store);
AdminRouter.get("/e-faq/:id", EFaqController.Show);
AdminRouter.put("/e-faq/:id", EFaqController.Update);
AdminRouter.delete("/e-faq/delete/:id", EFaqController.Delete);

// E Additional Info
AdminRouter.get("/e-additional-info", EAdditionalInfoController.Index);
AdminRouter.get(
  "/e-additional-info/products",
  EAdditionalInfoController.ProductWithAdditionalInfo
);
AdminRouter.post("/e-additional-info", EAdditionalInfoController.Store);
AdminRouter.get("/e-additional-info/:id", EAdditionalInfoController.Show);
AdminRouter.put("/e-additional-info/:id", EAdditionalInfoController.Update);
AdminRouter.delete(
  "/e-additional-info/delete/:id",
  EAdditionalInfoController.Delete
);

// Variation
AdminRouter.get("/variation", VariationController.Index);
AdminRouter.post("/variation", VariationController.Store);
AdminRouter.get("/variation/:id", VariationController.Show);
AdminRouter.put("/variation/:id", VariationController.Update);
AdminRouter.delete("/variation/delete/:id", VariationController.Delete);

// Shipping Charge
AdminRouter.get("/shipping-charge", ShippingChargeController.Index);
AdminRouter.put("/shipping-charge", ShippingChargeController.Update);

// Report routes
AdminRouter.get("/report", ReportController.Index);

// Stock Management routes
AdminRouter.put("/stock-management", StockManagementController.Update);

// Promotion Management routes
AdminRouter.get("/promotion-management", PromotionManagementController.Index);
AdminRouter.put(
  "/promotion-management/:id",
  PromotionManagementController.Update
);
AdminRouter.delete(
  "/promotion-management/delete/:id",
  PromotionManagementController.Delete
);

// Promotion Tutorial Manage routes
AdminRouter.get("/promo-tutorial-manage", PromoTutorialManageController.Index);
AdminRouter.get(
  "/promo-tutorial-manage/:id",
  PromoTutorialManageController.Show
);
AdminRouter.put(
  "/promo-tutorial-manage/:id",
  PromoTutorialManageController.Update
);

// Promotion Tutorial Manage routes
AdminRouter.get("/payout-info", PayoutInfoController.Index);
AdminRouter.get("/payout-info/:id", PayoutInfoController.Show);
AdminRouter.put("/payout-info/:id", PayoutInfoController.Update);

// Coupon Management routes
AdminRouter.get("/coupon-management", CouponManageController.Index);
AdminRouter.post("/coupon-management", CouponManageController.Store);
AdminRouter.get("/coupon-management/:id", CouponManageController.Show);
AdminRouter.put("/coupon-management/:id", CouponManageController.Update);
AdminRouter.delete(
  "/coupon-management/delete/:id",
  CouponManageController.Delete
);

// Pathao routes
AdminRouter.post("/pathao-create-order", PathaoController.CreateOrder);

// SMS Template routes
AdminRouter.get(
  "/sms-template/get-template",
  SMSTemplateController.GetTemplate
);
AdminRouter.get("/sms-template", SMSTemplateController.Index);
AdminRouter.post("/sms-template", SMSTemplateController.Store);
AdminRouter.get("/sms-template/:id", SMSTemplateController.Show);
AdminRouter.put("/sms-template/:id", SMSTemplateController.Update);

// Payment Request routes
AdminRouter.get("/payment-request", PaymentRequestController.Index);
AdminRouter.get("/payment-request/:id", PaymentRequestController.Show);
AdminRouter.put("/payment-request/:id", PaymentRequestController.Update);

// Stock History routes
AdminRouter.get("/stock-history/role", StockHistoryController.RoleIndex);
AdminRouter.get("/stock-history/:id", StockHistoryController.Index);

// Stock History routes
AdminRouter.get("/stock-reason", StockReasonController.Index);
AdminRouter.post("/stock-reason", StockReasonController.Store);

module.exports = { AdminRouter };
