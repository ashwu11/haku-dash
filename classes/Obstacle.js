const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

class Obstacle {
    constructor({x, y, w, h, img}) {
        this.image = img
        this.position = {x, y}
        this.width = w
        this.height = h
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}

export default Obstacle;