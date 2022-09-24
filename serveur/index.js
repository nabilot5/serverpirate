module.exports = (io) => {
    const nspPlayer = io.of("/players")

    nspPlayer.on('connection', (socket) => {
        console.log(`>>>> A user connected with socket : ${socket.id}`)

        require("./on/joinRoom.js")(socket, nspPlayer, io)
        require("./on/gameEvent.js")(socket, nspPlayer)
        require("./on/quit")(socket, nspPlayer)
    })
}