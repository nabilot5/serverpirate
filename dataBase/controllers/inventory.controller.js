const db = require("../models/index.js")
const product = db.product
const user = db.user
const inventory = db.userInventory

const addAndUpdate = async (req, res) => {
    try {
        const dbUser = await user.findOne({
            raw: true,
            where: {
                pseudo: req.body.pseudo,
                password: req.body.password
            },
            attributes: [
                "id",
                "basicCoins"
            ]
        })

        const dbProduct = await product.findOne({
            raw: true,
            where: {
                id: req.body.productId
            },
            attributes: [
                "id",
                "basicPrice"
            ]
        })

        if (dbUser.basicCoins >= dbProduct.basicPrice && dbUser !== null && dbProduct !== null) {
            inventory.create({
                quantity: 1,
                userId: dbUser.id,
                productId: dbProduct.id
            })

            user.update({
                basicCoins: dbUser.basicCoins - dbProduct.basicPrice
            }, {
                where: {
                    pseudo: req.body.pseudo,
                    password: req.body.password
                }
            })

            res.status(200).send({ message: "Achat validé" })

        } else {
            console.log(">> you don't have coins amount")
            res.status(500).send({ message: "Pas assez d'argent" })
        }

    } catch (err) {
        console.log(">> error while add item to inventory", err)
    }
}

exports.purchaseWithBasicCoin = (req, res) => {
    inventory.findOne({
        raw: true,
        nest: true,
        include: [{
            model: user,
            as: "user",
            attributes: [
                "basicCoins",
                "id"
            ],
            where: {
                pseudo: req.body.pseudo,
                password: req.body.password
            }
        }, {
            model: product,
            as: "product",
            attributes: [
                "basicPrice",
                "id"
            ],
            where: {
                id: req.body.productId
            }
        }],
        attributes: [
            "quantity"
        ]
    })
        .then((userInventory) => {
            if (userInventory === null) {
                addAndUpdate(req, res)
                return
            }

            if (userInventory.user.basicCoins >= userInventory.product.basicPrice) {
                inventory.update({
                    quantity: db.sequelize.literal("quantity + 1")
                }, {
                    where: {
                        userId: userInventory.user.id,
                        productId: userInventory.product.id
                    }
                })

                user.update({
                    basicCoins: userInventory.user.basicCoins - userInventory.product.basicPrice
                }, {
                    where: {
                        pseudo: req.body.pseudo,
                        password: req.body.password
                    }
                })

                res.status(200).send({ message: "Achat validé" })

            } else {
                console.log(">> you don't have coins amount")
                res.status(500).send({ message: "Pas assez d'argent" })
            }

        })
        .catch((err) => {
            console.log(err)
        })
}

exports.getAll = (req, res) => {
    inventory.findAll({
        raw: true,
        nest: true,
        include: [{
            model: user,
            as: "user",
            where: {
                pseudo: req.body.pseudo,
                password: req.body.password
            }
        }, {
            model: product,
            as: "product",
            attributes: [
                "identify",
                "product",
                "description",
                "imgUrl"
            ]
        }],
        attributes: [
            "quantity"
        ]
    })
        .then((items) => {
            if (items !== null) {
                let itemsInfos = []

                items.forEach(item => {
                    itemsInfos.push(
                        {
                            productId: item.product.identify,
                            quantity: item.quantity,
                            product: item.product.product,
                            description: item.product.description,
                            imgUrl: item.product.imgUrl
                        }
                    )
                })

                res.status(200).send(itemsInfos)
                return
            }

            res.status(204).send("Aucun item")
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err.message })
        })
}

exports.hasOneByIdentify = async (identify, pseudo, password) => {
    try {
        const item = await inventory.findOne({
            raw: true,
            nest: true,
            include: [{
                model: user,
                as: "user",
                attributes: [],
                where: {
                    pseudo: pseudo,
                    password: password
                }
            }, {
                model: product,
                as: "product",
                attributes: [],
                where: {
                    identify: identify
                }
            }],
            attributes: [
                "quantity"
            ]
        })

        return item
    } catch (err) {
        console.log(err);
    }
}

exports.removeItem = (identify, pseudo, password) => {
    inventory.findOne({
        raw: true,
        nest: true,
        include: [{
            model: user,
            as: "user",
            attributes: [],
            where: {
                pseudo: pseudo,
                password: password
            }
        }, {
            model: product,
            as: "product",
            attributes: [],
            where: {
                identify: identify
            }
        }],
        attributes: [
            "quantity",
            "userId",
            "productId"
        ]
    })
        .then((item) => {
            inventory.update({
                quantity: item.quantity - 1
            }, {
                where: {
                    userId: item.userId,
                    productId: item.productId
                }
            })
        })
        .catch((err) => {
            console.log(">> error while remove item quantity", err)
        })
}