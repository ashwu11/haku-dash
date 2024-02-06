const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(c)

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
    constructor() {
        this.position = {x: 100, y: 100}
        this.width = 50
        this.height = 50
        this.velocity = {x: 0, y: 1}
    }

    draw() {
        c.fillStyle = 'grey'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
    }
}

const player = new Player()
player.draw()

function animate() {
    requestAnimationFrame(animate)
    player.update()
    //console.log('updating')
}

animate()