module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        pseudo: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: "pseudo requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "pseudo requie"
                },
                len: {
                    args: [4, 20],
                    msg: "pseudo entre 4 et 20 caratères"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    args: [true],
                    msg: "invalide email"
                },
                notEmpty: {
                    args: [true],
                    msg: "email requie"
                },
                notNull: {
                    args: [true],
                    msg: "email requie"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: "password requie"
                },
                notEmpty: {
                    args: [true],
                    msg: "password requie"
                }
                // len: {
                //     args: [8, 20],
                //     msg: "password entre 8 et 20 caratères"
                // }
            }
        },
        rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1000,
            validate: {
                isInt: {
                    args: [true],
                    msg: "rating is not integer"
                },
                notNull: {
                    args: [true],
                    msg: "rating requie"
                }
            }
        },
        basicCoins: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1000,
            validate: {
                isInt: {
                    args: [true],
                    msg: "basic coins is not integer"
                },
                notNull: {
                    args: [true],
                    msg: "basic coins requie"
                }
            }
        },
        preniumCoins: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1000,
            validate: {
                isInt: {
                    args: [true],
                    msg: "prenium coins is not integer"
                },
                notNull: {
                    args: [true],
                    msg: "prenium coins requie"
                }
            }
        }
    })
    return User
}