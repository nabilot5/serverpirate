const ratingController = require("../controllers/rating.controller.js")
const productController = require("../controllers/product.controller.js")
const inventoryController = require("../controllers/inventory.controller.js")

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    app.post("/api/rating/all", ratingController.getRating)

    app.post("/api/shop/category", productController.findAllByCategory)

    app.post("/api/shop/basicPurchase", inventoryController.purchaseWithBasicCoin)

    app.post("/api/inventory/myInventory", inventoryController.getAll)
};