const db = require("../models/index.js")
const User = db.user

checkDuplicateUsernameOrEmail = (req, res, next) => {
    let undefinedMsg = ""

    typeof req.body.email === "undefined" ? undefinedMsg += "Email " : null
    typeof req.body.pseudo === "undefined" ? undefinedMsg += "Pseudo " : null
    typeof req.body.password === "undefined" ? undefinedMsg += "Password " : null

    if (undefinedMsg.length > 0) {
        res.status(400).send({ message: `${undefinedMsg}requie` })
        return
    }

    if (req.body.password.length < 8 || req.body.password.length > 50) {
        res.status(400).send({ message: "password entre 8 et 20 caratères" })
        return
    }

    // username
    User.findOne({
        where: {
            pseudo: req.body.pseudo
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            })
            return
        }
        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                })
                return
            }
            next()
        })
    })
        .catch(err => {
            console.log(err)
            res.status(500).send({ message: err.message })
        })
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
}

module.exports = verifySignUp