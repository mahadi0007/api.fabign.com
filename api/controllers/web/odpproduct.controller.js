const ODPProducts = require("../../../models/odp_products.model")
const { HostURL } = require("../../helpers")

// Index of Measurement
const Index = async (req, res, next) => {
    try {
        const results = await ODPProducts.find({}, { created_by: 0 })
            .populate("colors")

        const items = []

        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i]

                if (element) {
                    items.push({
                        _id: element._id,
                        product_name: element.product_name,
                        subtitle: element.subtitle,
                        size: element.size,
                        price: element.price,
                        fabric: element.fabric,
                        colors: element.colors,
                        description: element.description,
                        icon: HostURL(req) + "uploads/odpprod/icons/" + element.icon,
                        main_image: HostURL(req) + "uploads/odpprod/main_images/" + element.main_image,
                        right_image: HostURL(req) + "uploads/odpprod/right_images/" + element.right_image,
                        left_image: HostURL(req) + "uploads/odpprod/left_images/" + element.left_image,
                        back_image: HostURL(req) + "uploads/odpprod/back_images/" + element.back_image
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