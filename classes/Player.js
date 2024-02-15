const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

class Player {
    constructor(g, img, keys) {
        this.position = {x: 100, y: 100}
        this.width = 85
        this.height = 160
        this.velocity = {x: 10, y: 10}
        this.speed = 8
        this.image = img
        this.frame = 2
        this.counter = 5
        this.gravity = g
        this.keys = keys
    }

    draw() {
        c.drawImage(this.image, 69.5 * this.frame, 0, 70, 170,
            this.position.x, this.position.y,
            this.width, this.height)
    }

    update() {
        // frames
        if (this.counter > 0){
            this.counter--
        } else if (this.keys.right) {
            this.frame++
            if (this.frame > 7) this.frame = 0
            this.counter = 5
        } else if (this.keys.left) {
            this.frame--
            if (this.frame < 1) this.frame = 7
            this.counter = 5
        }

        // speed
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity
        if (this.position.y + this.height <= canvas.height - this.velocity.y) {
            this.velocity.y += this.gravity
        }
    }
}

export default Player;