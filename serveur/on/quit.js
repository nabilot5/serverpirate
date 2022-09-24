const { getRoom, getRoomMode } = require("../room.js")

module.exports = (socket, nspPlayer) => {
    socket.on("exitGame", () => {
        const room = getRoom(nspPlayer, socket)
        socket.leave(room.game.roomId)
    })

    socket.on("rageQuit", () => {
        const room = getRoom(nspPlayer, socket)
        socket.to(room.game.roomId).emit("playerExit")
        socket.leave(room.game.roomId)
    })

    socket.on("disconnecting", (reason) => {
        const room = getRoom(nspPlayer, socket)

        if (typeof room !== "undefined" && typeof room.game !== "undefined" && reason == "transport close") {

            if (getRoomMode(room.game.roomId) === "multi") {

                if (room.game.player1.sockId === socket.id) {
                    room.game.player1.resetTotalScore()

                    if (room.game.player2.getTotalScore() <= 0) {
                        room.game.player2.scoreColumn1 += 1
                    }
                }

                else if (room.game.player2.sockId === socket.id) {
                    room.game.player2.resetTotalScore()

                    if (room.game.player1.getTotalScore() <= 0) {
                        room.game.player1.scoreColumn1 += 1
                    }
                }

                room.game.endGame()
            }
        }
    })
}