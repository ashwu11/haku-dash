const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(c)

class Player {
    constructor() {
        this.position = {x: 100, y: 100}
        this.width = 100
        this.height = 100
    }

    drawPlayer() {
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}