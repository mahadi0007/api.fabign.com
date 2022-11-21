const Cft = require("../../../models/cft.model");
const mongoose = require('mongoose');
const { isMongooseId } = require("../../middleware/checkId.middleware");
const createCft = async(req,res)=>{
    try{
        let {inActiveDates, existingFitCost, measureMentTakingCost, isActive} = req.body;
        if(!inActiveDates || !existingFitCost || !measureMentTakingCost ){
            return res.status(400).json({
                "success": false,
                "statusCode": 400,
                "message": "Inactive dates existingFitCost and measureMentTakingCost are required"
            });
        }

        let cft = new Cft({
            inActiveDates: inActiveDates,
            existingFitCost: existingFitCost,
            measureMentTakingCost: measureMentTakingCost,
            isActive: isActive
        });

        await Cft.updateMany({},{$set: {isActive: false}});

        cft = await cft.save();
        if(cft){
            return res.status(201).json({
                status: true,
                message: "Successfully created.",
                body: cft
            })
        }
    }catch(error){
        if (error) next(error)
    }
}

const getCft = async(req,res,next)=>{
    try{
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let total = await Cft.countDocuments({});
        let cft = await Cft.find({})
            .sort({_id: -1})
            .skip((page-1)*parseInt(limit))
            .limit(parseInt(limit))
            .lean();
        return cft ? res.status(200).json({
            statusCode: 200,
            success: true,
            page: page,
            limit: limit,
            total: total,
            data: cft
        }) : res.status(200).json({
            statusCode: 204,
            success: false,
            page: page,
            limit: limit,
            total: total,
            data: cft ? cft : []
        })
    }catch(error){
        if (error) next(error)
    }
}

const getSingleCft = async(req,res,next)=>{
    try{
        const { id } = req.params
        await isMongooseId(id)
        let cft = await Cft.findOne({_id: mongoose.Types.ObjectId(id)});
        return cft ? res.status(200).json({
            statusCode: 200,
            success: true,
            data: cft
        }) : res.status(200).json({
            statusCode: 204,
            success: false,
            message: "No content found",
            data: {}
        })
    }catch(error){
        if (error) next(error)
    }
}
const deleteCft = async(req,res,next)=>{
    try{
        const { id } = req.params
        await isMongooseId(id)
        let cft = await Cft.deleteOne({_id: mongoose.Types.ObjectId(id)});
        return cft.deletedCount
            ? res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Successfully deleted",
                data: cft
        }) : res.status(300).json({
            statusCode: 304,
            success: false,
            message: "Not deleted",
            data: cft
        })
    }catch(error){
        if (error) next(error)
    }
}
const getActiveCft = async(req,res,next)=>{
    try{
        const cft = await Cft.findOne({isActive: true}).lean();
        return cft ? res.status(200).json({
            statusCode: 200,
            success: true,
            data: cft
        }) : res.status(200).json({
            statusCode: 204,
            success: false,
            message: "No content found",
            data: {}
        });
    }catch(error){
        if (error) next(error)
    }
}
const updateCft = async(req,res,next)=>{
    try{
        const {id} = req.params;
        let {isActive, ...updateObj} = req.body;
        isActive == true
            ? await Cft.updateMany({},{$set: {isActive: false}})
            : null;
        updateObj ? null : updateObj = {};
        isActive == true
            ? updateObj["isActive"] = isActive
            : isActive == false
            ? updateObj["isActive"] = isActive : null;
        const updated = await Cft.updateOne({_id: mongoose.Types.ObjectId(id)},{$set: updateObj});
        const cftOrder = await Cft.findOne({_id: mongoose.Types.ObjectId(id)});
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
        console.log(error);
        if (error) next(error)
    }
}
module.exports = {
    createCft,
    getSingleCft,
    getCft,
    deleteCft,
    updateCft,
    getActiveCft
}