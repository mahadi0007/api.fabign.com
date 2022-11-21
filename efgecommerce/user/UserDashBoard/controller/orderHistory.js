const mongoose = require("mongoose");
const { success, failure, notFound, notModified } = require("../../../common/helper/responseStatus");

const Order = require("../../../models/Order/Order");
const Campaign = require("../../../models/UserDashBoard/Campaign");

const orderHistory = {
    getOrderHistoryForUser: async(req,res)=>{
        try{
            const user = req.user.id;
            let{page, limit} = req.query;
            page = +page || 1;
            limit = +limit || 10;
            let history = await Order
                .find({user: mongoose.Types.ObjectId(user)})
                .select("products")
                .sort({_id: -1})
                .populate({
                    path: "products.brand",
                    select: "title"
                });
            let orderHistory = [];
            history.map(h=>{
                orderHistory = orderHistory.concat(h.products);
            });
            let total = orderHistory.length;
            orderHistory = orderHistory.slice(0, limit);
            return success(res, "fetched", {page: page, limit: limit, total: total, history: orderHistory});
        }catch(error){
            return failure(res, error.message, error.stack);
        }
    },

    dashBoardSummary: async(req,res)=>{
        try{
            let user = req.user.id;
            let campaign = await Campaign.find({user: mongoose.Types.ObjectId(user)}).lean();
            let data = {
                cancelled: 0,
                created: 0,
                pending: 0,
                sold: 0,
                published: 0,
                blocked: 0,
                total: 0,
                profit: 0,
                currentlyOrder: 0
            }
            campaign.map(c=>{
                data.total ++;
                data.profit += (c.estimatedProfit * c.salesCount);
                data.sold += c.salesCount
                switch(c.status){
                    case "created": 
                        data.created++;
                        break; 
                    case "pending": 
                        data.pending++;
                        break;
                    case "sold":
                        data.sold++;
                        break;
                    case "published":
                        data.published++;
                        break; 
                    case "blocked":
                        data.blocked;
                        break; 
                    case "cancelled":
                        data.cancelled++;
                        break; 
                    case "published":
                        data.published++;
                        break;
                    default:
                        break;
                }
            });
            data.profit = data.profit ? +data.profit.toFixed(0) : 0;

            return success(res, "dashboard ", data);

        }catch(error){
            return failure(res, "failed", {});
        }
    }
}

module.exports = orderHistory;