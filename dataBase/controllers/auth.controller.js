const db = require("../models")
const User = db.user
let bcrypt = require("bcryptjs")

exports.autoconnect = (req, res) => {
    User.findOne({
        where: {
            pseudo: req.body.pseudo,
            password: req.body.password
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." })
            }

            res.status(200).send({
                pseudo: user.pseudo,
                rating: user.rating,
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({ message: err.message })
        });
}

exports.signup = (req, res) => {
    User.create({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "Impossible to create user." })
            }
            res.status(201).send({
                pseudo: user.pseudo,
                password: user.password,
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({ message: err.message })
        })
}

exports.signin = (req, res) => {
    User.findOne({
        where: {
            pseudo: req.body.pseudo
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." })
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            )

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password!"
                })
            }

            res.status(200).send({
                pseudo: user.pseudo,
                password: user.password,
                rating: user.rating,
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({ message: err.message })
        });
};
