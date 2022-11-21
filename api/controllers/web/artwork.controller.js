const ODPArtwork = require("../../../models/odp_artwork.model")
const validator = require("../../validators/odp_artwork.validator")
const { RedisClient } = require("../../cache")
const { isMongooseId } = require("../../middleware/checkId.middleware")
const { UploadFile, HostURL } = require("../../helpers")


// Index of Measurement
const Index = async (req, res, next) => {
    try {
        const results = await ODPArtwork.find({}, { created_by: 0 })

        const items = []

        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i]

                if (element) {
                    items.push({
                        _id: element._id,
                        artwork_name: element.artwork_name,
                        artwork_description: element.artwork_description,
                        icon: HostURL(req) + "uploads/odpart/main_images/" + element.icon
                    })
                }
            }
        }


        res.status(200).json({
            status: true,
            data: items,
        })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Index,
}