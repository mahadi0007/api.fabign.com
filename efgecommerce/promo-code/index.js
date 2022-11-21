const router = require("express").Router();
const promoCodeRouter = require("./routes/promo-code");
router.use("/", promoCodeRouter);
module.exports = router;
