const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(c)

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.5
class Player {
    constructor() {
        this.position = {x: 100, y: 100}
        this.width = 50
        this.height = 50
        this.velocity = {x: 10, y: 10}
    }

    draw() {
        c.fillStyle = 'grey'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y

        // floor detection
        if (this.position.y + this.height <= canvas.height - this.velocity.y) {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
        }
    }
}

const player = new Player()
player.draw()

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    //console.log('updating')
}

animate()

// grab keyCode parameter of event
addEventListener('keydown', ({ keyCode }) => { 
    console.log(keyCode)
    // awsd controls
    switch (keyCode) {
        case 65:
            console.log('left')
            player.position.x -= player.velocity.x
            break
        
        case 87:
            console.log('up')
            player.velocity.y -= 10
            break
        
        case 68:
            console.log('right')
            player.position.x += player.velocity.x
            break

        case 83:
            console.log('down')
            player.velocity.y += 10
            break

        // 37 - 40 is left arrow key, up, right, down
    }
})