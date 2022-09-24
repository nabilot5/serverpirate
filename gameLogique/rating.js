class Rating {
    constructor(player) {
        this.player = player
        this.controller = require("../dataBase/controllers/rating.controller.js")
    }

    getRatingDelta(myRating, opponentRating, myGameResult) {
        if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
            return null;
        }

        const myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

        return Math.round(32 * (myGameResult - myChanceToWin));
    }

    getNewRating(myRating, opponentRating, myGameResult) {
        let newRating = myRating + this.getRatingDelta(myRating, opponentRating, myGameResult)
        if (newRating < 0) {
            newRating = 0
        }
        return newRating
    }

    async update() {
        const myRating = await this.controller.getRatingByPseudo(this.player.name)
        const opponentRating = await this.controller.getRatingByPseudo(this.player.otherPlayer.name)
        const myNewRating = this.getNewRating(myRating, opponentRating, this.player.gameResult)

        this.controller.updateRating(this.player.name, myNewRating)
    }
}

module.exports = Rating