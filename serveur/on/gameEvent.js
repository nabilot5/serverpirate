const { getPlayer } = require("../room.js")

module.exports = (socket, nspPlayer) => {
    socket.on("get dice", () => {
        getPlayer(nspPlayer, socket).launchDice(socket)
    })

    socket.on("playerColumnChoice", (columnId) => {
        getPlayer(nspPlayer, socket).play(columnId, socket)
    })

    socket.on("bonusChoice", (bonusInfos) => {
        getPlayer(nspPlayer, socket).bonus
            .useId(
                bonusInfos.bonusId,
                bonusInfos.pseudo,
                bonusInfos.password,
                socket
            )
    })

    socket.on("playerBonusCase", (bonusInfos) => {
        getPlayer(nspPlayer, socket).bonus
            .applyActived(
                parseInt(bonusInfos.caseId),
                bonusInfos.pseudo,
                bonusInfos.password,
                socket
            )
    })

    socket.on("player bet", async (betValue, pseudo, password, callback) => {
        const player = getPlayer(nspPlayer, socket)
        const betIsValid = await player.setBet(betValue, pseudo, password)
        const response = {
            status: 200,
            msg: ""
        }

        if (betIsValid !== true) {
            response.status = 500
            response.msg = betIsValid
        }

        callback(response)
    })
}