const SubButton = require("../../../models/sub_button.model")
const { Paginate, PaginateQueryParams } = require("../../helpers/paginate.helpers")
const { HostURL } = require("../../helpers")
const { isMongooseId } = require("../../middleware/checkId.middleware")
const { RedisClient } = require("../../cache")

// List of all sub button items 
const Index = async (req, res, next) => {
    // try {
    const items = []
    const { limit, page } = PaginateQueryParams(req.query)

    const totalItems = await SubButton.countDocuments().exec()
    const results = await SubButton.find({}, { priority: 0 })
        .populate("category", "title")
        .populate("created_by", "name")
        .sort({ _id: -1 })
        .skip((parseInt(page) * parseInt(limit)) - parseInt(limit))
        .limit(parseInt(limit))
        .exec()


    if (results && results.length) {
        for (let i = 0; i < results.length; i++) {
            const element = results[i]

            if (element) {
                items.push({
                    _id: element._id,
                    category: element.category,
                    subcategory: element.subcategory,
                    element: element.element,
                    title: element.title,
                    sub_title: element.sub_title,
                    price: element.price,
                    color: element.color,
                    description: element.description,
                    is_default: element.is_default,
                    is_deleteable: element.is_default ? false : true,
                    created_by: element.created_by.name,
                    title_image: HostURL(req) + "uploads/button/title_image/" + element.title_image
                })
            }
        }
    }

    res.status(200).json({
        status: true,
        data: items,
        pagination: Paginate({ page, limit, totalItems })
    })

    // } catch (error) {
    //     if (error) next(error)
    // }
}


// make default sub button
const MakeDefault = async (req, res, next) => {
    try {
        const { id, category, subcategory } = req.params
        await isMongooseId(id)
        await isMongooseId(category)


        const is_available = await SubButton.findOne({ $and: [{ _id: id }, { category }, { subcategory }] })

        if (!is_available) {
            return res.status(404).json({
                status: false,
                message: "Button not available."
            })
        }

        // update to undefault
        await SubButton.updateMany(
            { subcategory },
            { $set: { is_default: false } }
        )

        // update to default
        await SubButton.findOneAndUpdate(
            { $and: [{ _id: id }, { subcategory }] },
            { $set: { is_default: true } }
        )

        await RedisClient.flushall()

        res.status(201).json({
            status: true,
            message: "You made it default."
        })
    } catch (error) {
        if (error) next(error)
    }
}



module.exports = {
    Index,
    MakeDefault,
}