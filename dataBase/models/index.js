const config = require("../config/db.config.js")
const Sequelize = require("sequelize")
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
)

const db = {};
db.Sequelize = Sequelize
db.sequelize = sequelize
db.user = require("./user.model.js")(sequelize, Sequelize)
db.product = require("./product.model.js")(sequelize, Sequelize)
db.productCategory = require("./productCategory.model.js")(sequelize, Sequelize)
db.userInventory = require("./userInventory.model.js")(sequelize, Sequelize)

db.user.hasMany(db.userInventory, { as: "userInventory" })
db.userInventory.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
})

db.product.hasMany(db.userInventory, { as: "userProduct" })
db.userInventory.belongsTo(db.product, {
    foreignKey: "productId",
    as: "product"
})

db.productCategory.hasMany(db.product, { as: "product" })
db.product.belongsTo(db.productCategory, {
    foreignKey: "productCategoryId",
    as: "category"
})

module.exports = db