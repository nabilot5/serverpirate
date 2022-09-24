class B002 {
    constructor(player) {
        this.player = player
        this.identify = "B002"
        this.actived = false
    }

    use(identify, pseudo, password, socket) {
        socket.emit("bonusCaseChoise", this.player.id)
    }

    apply(caseId, pseudo, password, socket) {
        if (this.actived) {
            this.player.grid[caseId] = null
            this.player.setSortedGrid()

            this.player.bonus.used = true
            this.actived = false

            const columnAndCase = this.getCaseAndColonne(caseId + 1)
            this.player.evalGrid(columnAndCase.column)

            this.sendInfosToClient(caseId, socket)

            this.player.bonus.controller.removeItem(
                this.identify, pseudo, password
            )
        }
    }

    sendInfosToClient(boxId, socket) {
        const columnAndCase = this.getCaseAndColonne(boxId + 1)

        socket.emit(
            "destroyMyDice",
            {
                columnId: columnAndCase.column + 1,
                nbCase: [columnAndCase.caseId]
            }
        )

        if (!this.player.otherPlayer.ai) {
            socket.to(this.player.game.roomId).emit(
                "destroyEnemyDice",
                {
                    columnId: columnAndCase.column + 1,
                    nbCase: [columnAndCase.caseId]
                }
            )
        }

    }

    getCaseAndColonne(boxid) {
        return {
            column: parseInt(boxid / 3),
            caseId: boxid % 3 === 0 ? 3 : boxid % 3
        }
    }
}

module.exports = B002