const GameLogique = require("../../gameLogique/game.js")
const { getRoomMode, generateId } = require("../room.js")

module.exports = (socket, nspPlayer, io) => {
    socket.on("join room", (gameMode, playerName) => {
        let findRoom = false

        nspPlayer.adapter.rooms.forEach((room, roomId) => {
            if (getRoomMode(roomId) === "multi" && !findRoom && room.size < 2) {
                socket.join(roomId)

                room.game.player2.name = playerName
                room.game.player2.sockId = socket.id
                findRoom = true

                socket.to(roomId).emit("room info", { roomId, p2Name: room.game.player2.name })
                socket.emit("room info", { roomId, p2Name: room.game.player1.name })
            }
        })

        if (!findRoom) {
            const roomId = generateId(gameMode)

            socket.join(roomId)

            const room = nspPlayer.adapter.rooms.get(roomId)
            const multi = gameMode === "multi" ? true : false

            room.game = new GameLogique(multi, roomId, io)
            room.game.init()
            room.game.player1.name = playerName
            room.game.player1.sockId = socket.id

            if (gameMode === "solo") {
                socket.emit("room info", { roomId: room.game.roomId, p2Name: room.game.player2.name })
            }

            findRoom = true
        }
    })
}