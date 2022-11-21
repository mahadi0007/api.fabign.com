const route = require("express").Router();
const storeController = require("../controller/store");
const { Customer } = require("../../../common/middleware/Permission");
route.get("/get-all/", storeController.getAllStore);
route.get("/get-single/:id", storeController.getSingleStore);
route.get("/get-by-user/", Customer, storeController.getStoreByUser);
route.post("/add/", Customer, storeController.addStore);
route.put("/update/:id", Customer, storeController.updateStore);
route.put("/follow/:id", Customer, storeController.followStore);
route.put("/unfollow/:id", Customer, storeController.unFollowStore);
route.delete("/remove/:id", Customer, storeController.removeStore);

module.exports = route;
