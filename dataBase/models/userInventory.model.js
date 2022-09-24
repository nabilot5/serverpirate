module.exports = (sequelize, Sequelize) => {
    const UserInventory = sequelize.define("userInventory", {
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: false,
            defaultValue: 0,
            validate: {
                isInt: {
                    args: [true],
                    msg: "quantity is not integer"
                },
                notNull: {
                    args: [true],
                    msg: "quantity requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "quantity requie"
                }
            }
        }
    })
    return UserInventory
}