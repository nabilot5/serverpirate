module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        product: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: "product name requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "product name requie"
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: "description requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "description requie"
                }
            }
        },
        imgUrl: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: "image url requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "image url requie"
                }
            }
        },
        basicPrice: {
            type: Sequelize.INTEGER,
            allowNull: true,
            unique: false,
            validate: {
                isInt: {
                    args: [true],
                    msg: "basic price is not integer"
                }
            }
        },
        preniumPrice: {
            type: Sequelize.INTEGER,
            allowNull: true,
            unique: false,
            validate: {
                isInt: {
                    args: [true],
                    msg: "prenium price is not integer"
                }
            }
        },
        identify: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            defaultValue: "B001",
            validate: {
                notNull: {
                    args: [true],
                    msg: "identify requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "identify requie"
                }
            }
        }
    })
    return Product
}