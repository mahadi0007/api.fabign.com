
const Backside_Element = require("../../../models/backside_element.model")
const BacksideElementMask = require("../../../models/backside_element_mask.model")
const { isMongooseId } = require("../../middleware/checkId.middleware")
const { RedisClient } = require("../../cache")

/* List of items */
const Index = async (req, res, next) => {
    try {
        const { category } = req.params
        const BASE_URL = process.env.BASE_URL + "uploads/backside_elements/title_images/"

        await isMongooseId(category)

        const results = await Backside_Element.find(
            { category },
            {
                created_by: 0,
                createdAt: 0,
                updatedAt: 0,
                main_image: 0
            }).populate("category", {title:1})


        const data = {
            status: true,
            base_url: BASE_URL,
            data: results
        }

        const key = "backside-elements-" + category
        await RedisClient.setex(key, 3600, JSON.stringify(data))

        res.status(200).json(data)
    } catch (error) {
        if (error) next(error)
    }
}


/* Backside of element */
const BackSideImage = async (req, res, next) => {
    try {
        const { element, fabric, type } = req.params
        const BASE_URL = process.env.BASE_URL + "uploads/mask_files/"

        await isMongooseId(element)
        await isMongooseId(fabric)

        const result = await BacksideElementMask.findOne({ $and: [{ element }, { fabric }] }, { file: 1 })

        res.status(200).json({
            status: true,
            base_url: BASE_URL,
            data: result
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index,
    BackSideImage
}