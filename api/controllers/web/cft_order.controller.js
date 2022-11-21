const CftOrder = require("../../../models/cft_order.model");
const mongoose = require("mongoose");
const { FileUpload } = require("../../../efgecommerce/common/helper/index")
module.exports = {
    addCftOrder: async(req,res,next)=>{
        try{
            let file = req.files;
            let { email, address, phone, name, date, startTime, totalAmount, measureMent, fabric} = req.body;
            if(!address || !phone || !name || !date || !startTime || !totalAmount){
                return res.status(406).json({
                    statusCode: 406,
                    success: false,
                    message: "title, name, address, phone, date, startTime, totalAmount are required!"
                });
            }
            let cftOrder = new CftOrder({
                email,
                address,
                phone,
                name,
                date,
                startTime,
                totalAmount,
                measureMent,
                fabric
            });
            
            let uploadedFile = file ? await FileUpload(file.image, "./uploads/cftOrder/", cftOrder._id) : null;
            uploadedFile ? cftOrder.image = uploadedFile : null;
            cftOrder = await cftOrder.save();
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: "New cft order created",
                body: cftOrder
            })
        }catch(error){
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: error.message
            });
        }
    },
    getCftOrder: async (req,res,next)=>{
        try{
            let page = req.query.page || 1;
            let limit = req.query.limit || 10;
            let total = await CftOrder.countDocuments({});
            let cftOrder = await CftOrder.find({})
            .sort({_id: -1})
                .skip((page - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .lean();
            return cftOrder
                ? res.status(201).json({
                    success: true,
                    statusCode: 200,
                    message: "Fetched all cft orders",
                    page: page,
                    limit: limit,
                    total: total,
                    body: cftOrder
                })
                : res.status(200).json({
                    success: false,
                    statusCode: 204,
                    message: "No cft order found",
                    page: page,
                    limit: limit,
                    total: total,
                    body: cftOrder
                })
        }catch(error){
            console.log(error)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: error.message
            });
        }
    },
    getSingleCftOrder: async(req,res,next)=>{
        try{
            let {id} = req.params;
            let cftOrder = await CftOrder.findOne({_id: mongoose.Types.ObjectId(id)})
            return cftOrder ? res.json({
                success: true,
                statusCode: 200,
                message: "Fetched cft order",
                body: cftOrder
            }) : res.json({
                success: false,
                statusCode: 204,
                message: "No cft order found",
                body: cftOrder
            })
        }catch(error){
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: error.message
            });
        }
    },
    updateCftOrder: async(req,res,next)=>{
        try{
            let {...updatedObj} = req.body,
                file = req.files;
            let {id} = req.params,
                cftOrder,
                uploadedFile = file ? await FileUpload(file.image, "./uploads/cftOrder/", id) : null;
                uploadedFile ? updatedObj.image = uploadedFile : null;

            let updated = await CftOrder.updateOne({
                _id: mongoose.Types.ObjectId(id)
            },{
                $set: updatedObj
            });
            updated.matchedCount ? cftOrder = await CftOrder.findOne({
                _id: mongoose.Types.ObjectId(id)
            }) : null;
            return updated.matchedCount 
                ? updated.modifiedCount
                ? res.json({
                    statusCode: 200,
                    success: true,
                    message: "Successfully updated",
                    body: cftOrder
                }) 
                : res.json({
                    statusCode: 304,
                    success: false,
                    message: "Not modified",
                    body: cftOrder
                }) 
                : res.json({
                    statusCode: 204,
                    success: false,
                    message: "No content found",
                    body: {}
                })
        }catch(error){
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: error.message
            });
        }
    },
    deleteCftOrder: async(req,res,next)=>{
        try{
            let {id} = req.params;
            let deleted = await CftOrder.deleteOne({_id: mongoose.Types.ObjectId(id)});
            return deleted.deletedCount
                ? res.json({
                    success: true,
                    statusCode: 200,
                    message: "Cft order Deleted"
                }) : res.json({
                    success: false,
                    statusCode: 204,
                    message: "No content found"
                });
        }catch(error){
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: error.message
            });
        }
    }
}