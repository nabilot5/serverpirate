const cors = require('cors')

const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: [
            "*",
            "https://nabilot5.github.io/thepiratedice/",
            "https://nabilot5.github.io/",
            "http://127.0.0.1:5500",
            "http://127.0.0.1:5501",
            "http://127.0.0.1:5502",
            "http://127.0.0.1:5503",
            "http://127.0.0.1:5504"
        ]
    }
})

const { instrument } = require("@socket.io/admin-ui")
instrument(io, {
    auth: false
})

// database
const db = require("./dataBase/models")
db.sequelize.sync()

const corsOption = {
    origin: [
        "*",
        "https://nabilot5.github.io/thepiratedice/",
        "https://nabilot5.github.io/",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5501",
        "http://127.0.0.1:5502",
        "http://127.0.0.1:5503",
        "http://127.0.0.1:5504"
    ]
}

app.use(cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require("./dataBase/routes/auth.routes.js")(app)
require("./dataBase/routes/user.routes.js")(app)

// game serveur
require("./serveur/index.js")(io)

const port = process.env.PORT || 8080

server.listen(port, () => {
    console.log(`listening on *: ${port}`)
})