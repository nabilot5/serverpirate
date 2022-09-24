const db = require("../models/index.js")
const User = db.user

exports.getBasicCoin = async (pseudo, password) => {
    try {
        const user = await User.findOne({
            row: true,
            where: {
                pseudo,
                password
            },
            attributes: [
                "basicCoins"
            ]
        })

        return user.dataValues.basicCoins
    } catch (err) {
        console.log(err);
    }
}

exports.addBasicCoins = async (coins, pseudo) => {
    try {
        User.update({
            basicCoins: db.sequelize.literal(`basicCoins + ${coins}`)
        }, {
            where: {
                pseudo
            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.removeBasicCoins = async (coins, pseudo) => {
    try {
        await User.update({
            basicCoins: db.sequelize.literal(`basicCoins - ${coins}`)
        }, {
            where: {
                pseudo
            }
        })
    } catch (err) {
        console.log(err);
    }
}