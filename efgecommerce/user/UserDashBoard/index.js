const router = require("express").Router();
const storeRouter = require("./routes/store");
const historyRouter = require("./routes/history");
const campaignRouter = require("./routes/campaign");
const campaignReviewRouter = require("./routes/campaignReview");
const campaignPromotionRouter = require("./routes/campaignPromotion");
const payoutRouter = require("./routes/payout");
const paymentRequestRouter = require("./routes/payment_request");

router.use("/store/", storeRouter);
router.use("/purchase/", historyRouter);
router.use("/store/campaign/", campaignRouter);
router.use("/store/campaign/ratings", campaignReviewRouter);
router.use("/store/campaign/promotion", campaignPromotionRouter);
router.use("/payout/", payoutRouter);
router.use("/payment-request/", paymentRequestRouter);
module.exports = router;
