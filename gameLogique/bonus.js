const AllBonus = require("./bonus/allBonus.js")

class Bonus {
    constructor(player) {
        this.player = player
        this.used = false
        this.controller = require("../dataBase/controllers/inventory.controller.js")
        this.allBonus = new AllBonus(player)
    }

    applyActived(caseId, pseudo, password, socket) {
        if (this.player.turn) {
            this.allBonus.getAllBonus().forEach((bonus) => {
                if (bonus.actived) {
                    bonus.apply(caseId, pseudo, password, socket)
                }
            })
        }
    }

    useId(identify, pseudo, password, socket) {
        if (this.used) {
            console.log(">> bonus deja utiliser");
            return
        }

        if (this.player.turn) {
            this.hasBonus(identify, pseudo, password).then((bonus) => {

                if (bonus === null || bonus.quantity <= 0) {
                    console.log(">> t'as pas le bonus")
                }

                else {
                    this.allBonus.getAllBonus().forEach((bonus) => {
                        if (bonus.identify === identify) {
                            bonus.actived = true
                            bonus.use(identify, pseudo, password, socket)
                        }

                        else {
                            bonus.actived = false
                        }
                    })
                }
            })
        }
    }

    async hasBonus(identify, pseudo, password) {
        const hasBonus = await this.controller.hasOneByIdentify(identify, pseudo, password)
        return hasBonus
    }
}

module.exports = Bonus