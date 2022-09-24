exports.generateId = (prefix) => {
    const id = [...Array(2)].map(() => (
        Math.random() * 1000000)
        .toString(36)
        .replace('.', ''))
        .join('')

    return prefix + "_" + id
}

exports.getRoomMode = (roomId) => {
    return roomId.split("_", 1).join("")
}

exports.getRoom = (nspPlayer, socket) => {
    const room = nspPlayer.adapter.rooms.get(
        [...socket.rooms].pop()
    )
    return room
}

exports.getPlayer = (nspPlayer, socket) => {
    const room = this.getRoom(nspPlayer, socket)

    if (room.game.player1.sockId === socket.id) {
        return room.game.player1
    }

    else if (room.game.player2.sockId === socket.id) {
        return room.game.player2
    }
}