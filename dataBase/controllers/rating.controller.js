const db = require("../models/index.js");
const User = db.user;

exports.getRating = (req, res) => {
    User.findAll({
        attributes: ['pseudo', 'rating'],
        order: [
            ['rating', 'DESC']
        ]
    })
        .then(user => {
            let values = []
            user.forEach(element => {
                values.push(element.dataValues)
            });

            res.status(200).send(values)
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        })
}

exports.getRatingByPseudo = async (pseudo) => {
    if (typeof pseudo === "string" && pseudo.length >= 6) {
        try {
            const user = await User.findOne({
                attributes: ['rating'],
                where: {
                    pseudo: pseudo
                }
            })
            return user.dataValues.rating
        } catch (error) {
            console.log(error)
        }
    }
}

exports.updateRating = (pseudo, newRating) => {
    User.update({
        rating: newRating
    }, {
        where: {
            pseudo: pseudo
        }
    })
}