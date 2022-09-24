module.exports = (sequelize, Sequelize) => {
    const productCategory = sequelize.define("productCategory", {
        categoryName: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: "category name requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "category name requie"
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
            unique: false
        }
    })
    return productCategory
}