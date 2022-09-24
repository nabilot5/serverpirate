const db = require("../models/index.js")
const product = db.product
const category = db.productCategory

exports.findAllByCategory = (req, res) => {
    return product.findAll({
        raw: true,
        nest: true,
        include: {
            model: category,
            as: "category",
            required: true,
            attributes: [
                "categoryName", "description"
            ],
            where: {
                categoryName: req.body.category
            }
        },
        attributes: [
            "id",
            "product",
            "description",
            "imgUrl",
            "basicPrice",
            "preniumPrice"
        ]
    })
        .then((product) => {
            res.status(200).send(product)
        })
        .catch((err) => {
            console.log(">> error while find product by category: ", err)
            res.status(500).send({ message: err.message })
        })
}

exports.findByPk = (pk) => {
    return product.findByPk(pk)
        .then((product) => {
            console.log(product)
        })
        .catch((err) => {
            console.log(">> error while find product by Pk", err)
        })
}