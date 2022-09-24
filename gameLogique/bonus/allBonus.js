const B001 = require("./B001.js")
const B002 = require("./B002.js")
const B003 = require("./B003.js")

class AllBonus {
    constructor(player) {
        this.bonus = [
            new B001(player),
            new B002(player),
            new B003(player)
        ]
    }

    getAllBonus() {
        return this.bonus
    }
}

module.exports = AllBonus