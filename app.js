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
    constructor({x, y}) {
        this.position = {x, y}
        this.width = 150
        this.height = 20
    }

    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// GAME
const player = new Player()
const platforms = [new Platform({x: 200, y:270}), new Platform({x: 400, y: 180})]
const keys = {right: false, left: false}
const speed = 5
let progress = 0

animate()
addEventListener('keydown', handleKeyDown)
addEventListener('keyup', handleKeyUp)

// FUNCTIONS
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach((platform) => {
        platform.draw()
    })
    

    if (keys.left && player.position.x > 50) {
        player.velocity.x = -speed
    } else if (keys.right && player.position.x < 450) {
        player.velocity.x = speed
    } else {
        player.velocity.x = 0

        // scroll background
        if (keys.right) {
            progress += speed
            platforms.forEach((platform) => { platform.position.x -= speed })
        }
        if (keys.left) {
            progress -= speed
            platforms.forEach((platform) => { platform.position.x += speed })
        }
    }

    // platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y && // top
            player.position.y + player.height + player.velocity.y >= platform.position.y && // bottom
            player.position.x + player.width >= platform.position.x && // left
            player.position.x <= platform.position.x + platform.width) { // right
            player.velocity.y = 0
        }
    })

    if (player.position.y + player.velocity.y <= 0 ||
        player.position.y + player.height + player.velocity.y >= canvas.height) {
            player.velocity.y = 0
    }

    console.log(progress)
    if (progress > 2000) console.log("Congrats! You win!")
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
