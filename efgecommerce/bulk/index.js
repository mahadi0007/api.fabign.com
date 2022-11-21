const router = require("express").Router();
const bulkOrderRouter = require("./routes/order");
const orderStatRoute = require("./routes/orderstat");
router.use("/", bulkOrderRouter);
router.use("/stat/", orderStatRoute);
module.exports = router;
