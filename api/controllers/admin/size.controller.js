
const Size = require("../../../models/size.model")
const Validator = require("../../validators/size.validator")
const { isMongooseId } = require("../../middleware/checkId.middleware")
const { Paginate, PaginateQueryParams } = require("../../helpers/paginate.helpers")
const { RedisClient } = require("../../cache")

// List of items
const Index = async (req, res, next) => {
    try {
        const { limit, page } = PaginateQueryParams(req.query)

        const totalItems = await Size.countDocuments().exec()
        const results = await Size.find({}, { created_by: 0 })
            .sort({ _id: -1 })
            .skip((parseInt(page) * parseInt(limit)) - parseInt(limit))
            .limit(parseInt(limit))
            .exec()

        res.status(200).json({
            status: true,
            data: results,
            pagination: Paginate({ page, limit, totalItems })
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Store an item
const Store = async (req, res, next) => {
    try {
        const created_by = req.user.id
        const {
            title,
            arm_length,
            biceps,
            chest,
            hip,
            neck,
            shirt_length,
            shoulder_width,
            sleeve_length,
            waist,
            wrist,
            description
        } = req.body

        // Validate check
        const validate = await Validator.Store(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // Check exist
        const isExist = await Size.findOne({ title })
        if (isExist) {
            return res.status(409).json({
                status: false,
                message: `${title} already exist.`
            })
        }

        const newSize = new Size({
            title,
            arm_length,
            biceps,
            chest,
            hip,
            neck,
            shirt_length,
            shoulder_width,
            sleeve_length,
            waist,
            wrist,
            description,
            created_by
        })

        await newSize.save()
        await RedisClient.flushdb()

        res.status(201).json({
            status: true,
            message: "Successfully size created."
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Show specific item
const Show = async (req, res, next) => {
    try {
        const { id } = req.params
        await isMongooseId(id)

        const result = await Size.findById(id, { created_by: 0 })

        res.status(200).json({
            status: true,
            data: result
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Update specific item
const Update = async (req, res, next) => {
    try {
        const { id } = req.params
        const {
            title,
            arm_length,
            biceps,
            chest,
            hip,
            neck,
            shirt_length,
            shoulder_width,
            sleeve_length,
            waist,
            wrist,
            description
        } = req.body

        await isMongooseId(id)

        // Validate check
        const validate = await Validator.Store(req.body)
        if (!validate.isValid) {
            return res.status(422).json({
                status: false,
                message: validate.error
            })
        }

        // check available
        const is_available = await Size.findById(id)
        if (!is_available) {
            return res.status(404).json({
                status: false,
                message: "Size not available."
            })
        }

        // check similar name available
        const is_name_available = await Size.find({
            $and: [
                { _id: { $ne: id } },
                { title: title }
            ]
        })

        if (is_name_available && is_name_available.length > 0) {
            return res.status(409).json({
                status: false,
                message: `${title} already exist.`
            })
        }

        await Size.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    arm_length,
                    biceps,
                    chest,
                    hip,
                    neck,
                    shirt_length,
                    shoulder_width,
                    sleeve_length,
                    waist,
                    wrist,
                    description
                }
            }
        ).exec()

        await RedisClient.flushdb()

        res.status(201).json({
            status: true,
            message: "Size updated."
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index,
    Store,
    Show,
    Update
}