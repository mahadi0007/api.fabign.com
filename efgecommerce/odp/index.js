const router = require("express").Router();
const odpOrderRouter = require("./routes/order");
router.use("/", odpOrderRouter);
module.exports = router;
