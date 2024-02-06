const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gravity = 0.5

// CLASSES
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
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // floor detection
        if (this.position.y + this.height <= canvas.height - this.velocity.y) {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
        }
    }
}

class Platform {
    constructor() {
        this.position = {x: 200, y: 100}
        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// GAME
const player = new Player()
const platform = new Platform()
const keys = {right: false, left: false}

animate()
addEventListener('keydown', handleKeyDown)
addEventListener('keyup', handleKeyUp)

// FUNCTIONS
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platform.draw()

    if (keys.left) {
        player.velocity.x = -5
    } else if (keys.right) {
        player.velocity.x = 5
    } else {
        player.velocity.x = 0
    }

    // platform collision detection
    if (player.position.y + player.height <= platform.position.y && // top
        player.position.y + player.height + player.velocity.y >= platform.position.y && // bottom
        player.position.x + player.width >= platform.position.x && // left
        player.position.x <= platform.position.x + platform.width) { // right
        player.velocity.y = 0
    }
}

function handleKeyDown(event) {
    var key = event.key.toLowerCase()

    switch (key) {
        case 'a':
            console.log('left')
            keys.left = true
            break
        
        case 'w':
            console.log('up') 
            player.velocity.y -= 10
            break
        
        case 'd':
            console.log('right')
            keys.right = true
            break

        case 's':
            console.log('down')
            player.velocity.y += 10
            break

    }
    console.log(keys.right)
}

function handleKeyUp(event) {
    var key = event.key.toLowerCase()

    switch (key) {
        case 'a':
            keys.left = false
            break
        
        case 'w':
            break
        
        case 'd':
            keys.right = false
            break

        case 's':
            break

    }
    console.log(keys.right)
}
