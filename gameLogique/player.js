const Ai = require("./ai.js")
const Rating = require("./rating.js")
const Bonus = require("./bonus.js")


class Player extends Ai {
    constructor(game, turn, id, ai = false) {
        super()
        this.game = game
        this.otherPlayer = null
        this.scoreColumn1 = 0;
        this.scoreColumn2 = 0;
        this.scoreColumn3 = 0;
        this.name
        this.ai = ai
        this.nbCol = 3
        this.grid = [null, null, null, null, null, null, null, null, null]
        this.de = null
        this.isLaunchDe = false
        this.turn = turn
        this.gameResult = 0.5
        this.bet = 0
        this.isBet = false
        this.winReward = 10
        this.id = id
        this.sockId
        this.rating = new Rating(this)
        this.bonus = new Bonus(this)
        this.controller = require("../dataBase/controllers/user.controller.js")
    }

    launchDice(socket) {
        if (!this.isLaunchDe && this.turn && this.game.run) {
            this.de = Math.round(Math.random() * 5) + 1
            this.isLaunchDe = true

            if (this.ai) {
                this.game.io.of("/players").to(this.game.roomId).emit("dice other player", this.de)
            }

            else {
                socket.emit("my dice", this.de)
                socket.to(this.game.roomId).emit("dice other player", this.de)
            }
        }
    }

    play(columnId, socket) {
        if (this.turn && this.isLaunchDe && !this.columnIsFull(columnId) && this.game.run) {
            this.checkColumn(columnId)

            if (!this.gridIsFull()) {
                this.destroyEnemieDices(socket)
            }

            const lastDiceInfo = this.getLastDiceInfosOfColumn(columnId)
            const gridInfo = {
                columnId: columnId + 1,
                nbCase: lastDiceInfo.nbCase,
                caseValue: lastDiceInfo.caseValue
            }

            if (this.ai) {
                this.game.io.of("/players").to(this.game.roomId).emit("update other grid", gridInfo)
            }

            else {
                socket.emit("update my grid", gridInfo)
                socket.to(this.game.roomId).emit("update other grid", gridInfo)
            }

            this.finishTurn()
        }
    }

    getLastDiceInfosOfColumn(columnId) {
        const column = this.getFormatGrid()[columnId]

        for (let caseId = column.length - 1; caseId >= 0; caseId--) {
            if (column[caseId] !== null) {
                return { nbCase: caseId + 1, caseValue: column[caseId] }
            }
        }
    }

    checkColumn(columnId) {
        const column = this.getFormatGrid()[columnId]
        let firstCaseIdOfColumn = 0

        switch (columnId) {
            case 1: firstCaseIdOfColumn = 3; break;
            case 2: firstCaseIdOfColumn = 6; break;
        }

        if ((column[0] == null) && (column[1] == null) && (column[2] == null)) {
            this.grid[firstCaseIdOfColumn] = this.de;
            this.de = null;
        }

        if ((column[0] != null) && (column[1] == null) && (column[2] == null)) {
            this.grid[firstCaseIdOfColumn + 1] = this.de;
            this.de = null;
        }

        if ((column[0] != null) && (column[1] != null) && (column[2] == null)) {
            this.grid[firstCaseIdOfColumn + 2] = this.de;
            this.de = null;
        }

        this.evalGrid(columnId)
    }

    evalGrid(columnId) {
        const countDices = this.getFormatGrid()[columnId].reduce((acc, value) => ({
            ...acc,
            [value]: (acc[value] || 0) + 1
        }), {})

        let totalScoreOfColumn = 0

        for (let dice in countDices) {
            if (dice !== "null") {
                const nbOfDice = countDices[dice]
                totalScoreOfColumn += parseInt(dice) * nbOfDice * nbOfDice
            }
        }

        switch (columnId) {
            case 0: this.scoreColumn1 = totalScoreOfColumn; break;
            case 1: this.scoreColumn2 = totalScoreOfColumn; break;
            case 2: this.scoreColumn3 = totalScoreOfColumn; break;
        }
    }

    getTotalScore() {
        return this.scoreColumn1 + this.scoreColumn2 + this.scoreColumn3
    }

    resetTotalScore() {
        this.scoreColumn1 = 0;
        this.scoreColumn2 = 0;
        this.scoreColumn3 = 0;
    }

    finishTurn() {
        this.isLaunchDe = false
        this.de = null
        this.game.switchTurn()
    }

    getFormatGrid() {
        let formatGrid = []
        let cmpt = 0
        for (let index = 0; index < this.nbCol; index++) {
            formatGrid.push(this.grid.slice(
                cmpt,
                cmpt + this.nbCol
            ))
            cmpt += this.nbCol
        }
        return formatGrid
    }

    destroyEnemieDices(socket) {
        let playerGrid = this.getFormatGrid()
        let otherPlayerGrid = this.otherPlayer.getFormatGrid()
        let newGrid = []
        let nbCaseToDestroy = []
        let columnId = null

        for (let nbCol = 0; nbCol < playerGrid.length; nbCol++) {
            otherPlayerGrid[nbCol].forEach((element, index) => {
                if (playerGrid[nbCol].includes(element) && element !== null) {
                    columnId = nbCol + 1
                    nbCaseToDestroy.push(index + 1)
                    newGrid.push(null)
                } else {
                    newGrid.push(element)
                }
            });
        }

        if (columnId !== null) {
            if (this.ai) {
                this.game.io.of("/players").to(this.game.roomId).emit(
                    "destroyMyDice",
                    {
                        columnId,
                        nbCase: nbCaseToDestroy
                    }
                )
            }

            else {
                socket.emit("destroyEnemyDice", { columnId, nbCase: nbCaseToDestroy })
                socket.to(this.game.roomId).emit("destroyMyDice", { columnId, nbCase: nbCaseToDestroy })
            }
        }

        this.otherPlayer.grid = newGrid
        this.otherPlayer.setSortedGrid()
    }

    setSortedGrid() {
        let newGrid = []
        this.getFormatGrid().forEach(col => {
            let nbNullBox = 0

            col.forEach(box => {
                if (typeof box === "number") {
                    newGrid.push(box)
                } else {
                    nbNullBox++
                }
            })

            for (let nullBox = 0; nullBox < nbNullBox; nullBox++) {
                newGrid.push(null)
            }
        })
        this.grid = newGrid
    }

    gridIsFull() {
        return !this.grid.includes(null)
    }

    columnIsFull(nbCol) {
        return !this.getFormatGrid()[nbCol].includes(null)
    }

    async setBet(betValue, pseudo, password) {
        let coins = 0

        if (this.isBet) {
            return "Parie déjà pris"
        }

        if (typeof betValue === "number" && betValue >= 0) {
            coins = await this.controller.getBasicCoin(pseudo, password)
        } else {
            return "Veuillez saisir un nombre"
        }

        if (betValue <= coins) {
            this.bet = betValue
        } else {
            return "Pas assez de points"
        }

        this.isBet = true
        return true
    }

    async updateBasicCoins() {
        if (this.gameResult === 1) {
            await this.controller.addBasicCoins(
                this.bet + this.winReward,
                this.name
            )
        }

        if (this.gameResult === 0) {
            await this.controller.removeBasicCoins(this.bet, this.name)
        }
    }
}

module.exports = Player