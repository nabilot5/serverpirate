class Ai {
    constructor() { }

    aiTurn() {
        this.launchDice()

        setTimeout(() => {
            this.play(
                this.choiceColumn()
            )
        }, 2000)
    }

    choiceColumn() {
        let sameDiceEnemy = this.checkSameDiceEnemyGrid()
        let sameDice = this.checkSameDiceGrid()
        let choice = null

        if (sameDiceEnemy !== null && sameDice !== null && choice === null) {
            let choiceStrat = Math.round(Math.random() * 1) + 1

            switch (choiceStrat) {
                case 1: choice = sameDiceEnemy; break;
                case 2: choice = sameDice; break;
                default: break;
            }
        }

        if (sameDice !== null && choice === null) {
            choice = sameDice
        }

        if (sameDiceEnemy !== null && choice === null) {
            choice = sameDiceEnemy
        }

        if (sameDiceEnemy === null && sameDice === null && choice === null) {
            choice = this.randomChoice()
        }

        return choice - 1
    }

    randomChoice() {
        let columnChoice = Math.round(Math.random() * (this.nbCol - 1)) + 1

        while (this.columnIsFull(columnChoice - 1)) {
            columnChoice = Math.round(Math.random() * (this.nbCol - 1)) + 1
        }

        return columnChoice
    }

    checkSameDiceEnemyGrid() {
        let choice = null

        this.otherPlayer.getFormatGrid().forEach((col, colId) => {
            if (col.includes(this.de) && this.columnIsFull(colId) === false && choice === null) {
                choice = colId + 1
            }
        });

        return choice
    }

    checkSameDiceGrid() {
        let choice = null

        this.getFormatGrid().forEach((col, colId) => {
            if (col.includes(this.de) && this.columnIsFull(colId) === false && choice === null) {
                choice = colId + 1
            }
        })

        return choice
    }

    generateName() {
        const name = ["Jackson", "Bobby", "Molly", "Rascass", "Mortane", "Barbasse", "Edward", "Morgane", "Shanks"]
        this.name = name[Math.round(Math.random() * 10)]
    }
}

module.exports = Ai