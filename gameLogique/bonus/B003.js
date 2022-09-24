class B003 {
    constructor(player) {
        this.player = player
        this.identify = "B003"
        this.actived = false
    }

    use(identify, pseudo, password, socket) {
        socket.emit("bonusCaseChoise", this.player.otherPlayer.id)
    }

    apply(caseId, pseudo, password, socket) {
        if (this.actived) {
            this.player.otherPlayer.grid[caseId] = null
            this.player.otherPlayer.setSortedGrid()

            this.player.bonus.used = true
            this.actived = false

            const columnAndCase = this.getCaseAndColonne(caseId + 1)
            this.player.otherPlayer.evalGrid(columnAndCase.column)

            this.sendInfosToClient(caseId, socket)

            this.player.bonus.controller.removeItem(
                this.identify, pseudo, password
            )
        }
    }

    sendInfosToClient(boxId, socket) {
        const columnAndCase = this.getCaseAndColonne(boxId + 1)

        socket.emit(
            "destroyEnemyDice",
            {
                columnId: columnAndCase.column + 1,
                nbCase: [columnAndCase.caseId]
            }
        )

        if (!this.player.otherPlayer.ai) {
            socket.to(this.player.game.roomId).emit(
                "destroyMyDice",
                {
                    columnId: columnAndCase.column + 1,
                    nbCase: [columnAndCase.caseId]
                }
            )
        }

    }

    getCaseAndColonne(boxId) {
        return {
            column: parseInt(boxId / 3),
            caseId: boxId % 3 === 0 ? 3 : boxId % 3
        }
    }
}

module.exports = B003