
const Size = require("../../../models/size.model")
const { RedisClient } = require("../../cache")

// List of items
const Index = async (req, res, next) => {
    try {
        const results = await Size.find({}, { created_by: 0 })
            .sort({ title: 1 })
            .exec()

        // Set data to cache
        RedisClient.setex("sizes", 3600, JSON.stringify(results))

        res.status(200).json({
            status: true,
            data: results
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index
}