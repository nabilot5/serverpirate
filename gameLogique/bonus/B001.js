class B001 {
    constructor(player) {
        this.player = player
        this.identify = "B001"
        this.actived = false
    }

    use(identify, pseudo, password, socket) {
        this.player.isLaunchDe = false

        this.player.launchDice(socket)

        this.player.bonus.used = true
        this.actived = false

        this.player.bonus.controller.removeItem(
            identify, pseudo, password
        )
    }
}

module.exports = B001