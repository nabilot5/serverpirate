const Player = require("./player.js")

class GameLogique {
    constructor(multi, roomId, io) {
        this.player1
        this.player2
        this.nbPlayer = 1
        this.run = true
        this.multi = multi
        this.roomId = roomId
        this.io = io
    }

    init() {
        if (this.multi) {
            this.player1 = new Player(this, true, 2)
            this.player2 = new Player(this, false, 1)
        } else {
            this.player1 = new Player(this, true, 2)
            this.player2 = new Player(this, false, 1, true)
            this.player2.generateName()
        }

        this.player1.otherPlayer = this.player2
        this.player2.otherPlayer = this.player1
    }

    destroyEnemieDices(gamePLayer, otherPlayer) {
        let gridPlayer1 = gamePLayer.getFormatGrid()
        let gridPlayer2 = otherPlayer.getFormatGrid()
        let newGrid = []

        for (let nbCol = 0; nbCol < gridPlayer1.length; nbCol++) {
            gridPlayer2[nbCol].forEach((element, index) => {

                if (gridPlayer1[nbCol].includes(element) && element !== null) {
                    this.io.to(otherPlayer.sockId).emit("destroyDice", {
                        columId: nbCol + 1,
                        nbCase: index + 1
                    })
                    newGrid.push(null)
                }
                else {
                    newGrid.push(element)
                }
            });
        }

        otherPlayer.grid = newGrid
        otherPlayer.setSortedGrid()
    }

    switchTurn() {
        this.player1.turn = !this.player1.turn
        this.player2.turn = !this.player2.turn

        if (this.player1.gridIsFull() || this.player2.gridIsFull()) {
            this.endGame()
        }

        if (this.player2.turn && this.player2.ai && this.run && !this.multi) {
            this.player2.aiTurn()
        }
    }

    endGame() {
        this.run = false

        const scorePlayer1 = this.player1.getTotalScore()
        const scorePlayer2 = this.player2.getTotalScore()
        let winner = "Draw"

        if (scorePlayer1 > scorePlayer2) {
            winner = `${this.player1.name} win`
            this.player1.gameResult = 1
            this.player2.gameResult = 0
        }

        else if (scorePlayer2 > scorePlayer1) {
            winner = `${this.player2.name} win`
            this.player2.gameResult = 1
            this.player1.gameResult = 0
        }

        this.updateAllPlayersCoins()
        this.updateRatings()
        this.io.of("/players").to(this.roomId).emit("endGame", winner)
    }

    updateRatings() {
        if (this.multi) {
            this.player1.rating.update()
            this.player2.rating.update()
        }
    }

    updateAllPlayersCoins() {
        this.player1.updateBasicCoins()

        if (!this.player2.ai) {
            this.player2.updateBasicCoins()
        }
    }
}

module.exports = GameLogique