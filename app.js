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

const player = new Player()
const keys = {
    right: {pressed: false}, 
    left: {pressed: false}
}

player.draw()

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()

    if (keys.left.pressed) {
        player.velocity.x = -5
    } else if (keys.right.pressed) {
        player.velocity.x = 5
    } else {
        player.velocity.x = 0
    }
}

animate()
addEventListener('keydown', handleKeyDown)
addEventListener('keyup', handleKeyUp)

function handleKeyDown(event) {
    var keyPressed = event.key.toLowerCase()

    switch (keyPressed) {
        case 'a':
            console.log('left')
            keys.left.pressed = true
            break
        
        case 'w':
            console.log('up') 
            player.velocity.y -= 10
            break
        
        case 'd':
            console.log('right')
            keys.right.pressed = true
            break

        case 's':
            console.log('down')
            player.velocity.y += 10
            break

    }
    console.log(keys.right.pressed)
}

function handleKeyUp(event) {
    var keyPressed = event.key.toLowerCase()

    switch (keyPressed) {
        case 'a':
            keys.left.pressed = false
            break
        
        case 'w':
            break
        
        case 'd':
            keys.right.pressed = false
            break

        case 's':
            break

    }
    console.log(keys.right.pressed)
}
