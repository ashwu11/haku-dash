const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

const backgroundImg = document.getElementById('backgroundImage')
const woodImg = document.getElementById('woodImage')
const floorImg = document.getElementById('floorImage')
const nofaceImg = document.getElementById('nofaceImage')
const playerImg = document.getElementById('chihiroImage')
const endingImg = document.getElementById('hakuImage')
const sootRockImg = document.getElementById('sootRockImage')
const gravity = 0.6
const keys = {right: false, left: false}
const jumpSpeed = 11
const winPosition = 5000

// CLASSES
class Player {
    constructor() {
        this.position = {x: 100, y: 100}
        this.width = 85
        this.height = 160
        this.velocity = {x: 10, y: 10}
        this.speed = 10
        this.image = playerImg
        this.frame = 0;
        this.counter = 20
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
        } else {
            this.frame++
            if (this.frame > 7) this.frame = 0
            this.counter = 3
        }

        // speed
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity
        if (this.position.y + this.height <= canvas.height - this.velocity.y) {
            this.velocity.y += gravity
        }
    }
}

class Platform {
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

class Scenery {
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

// GAME
let progress = 0
let player = new Player()
let platforms = []
let sceneryObjects = []
let obstacles = []

init()
animate()
addEventListener('keydown', handleKeyDown)
addEventListener('keyup', handleKeyUp)

// FUNCTIONS
function init() {
    progress = 0 
    player = new Player()
    platforms = [ 
        new Platform({x: -1, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: 300, y: 425, w: 75, h: 75, img: sootRockImg}),
        new Platform({x: floorImg.width - 2, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*2 + 200, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*3 + 350, y: 400, w: 150, h: 50, img: woodImg}),
        new Platform({x: floorImg.width*3 + 600, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*4 + 500, y: 400, w: 150, h: 50, img: woodImg}),
        new Platform({x: floorImg.width*4 + 700, y: 300, w: 150, h: 50, img: woodImg}),
        new Platform({x: floorImg.width*5 + 500, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*6 + 500, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*6 + 500, y: 425, w: 75, h: 75, img: sootRockImg}),
        new Platform({x: floorImg.width*7 + 500, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*8 + 400, y: 425, w: 75, h: 75, img: sootRockImg}),
        new Platform({x: floorImg.width*8 + 900, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*9 + 900, y: 500, w: 500, h: 100, img: floorImg})
    ]
    sceneryObjects = [
        new Scenery({x: 0, y: 0, w: canvas.width, h: canvas.height, img: backgroundImg}),
        new Scenery({x: 700, y: 200, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg})
    ]
    obstacles = [
        new Obstacle({x: 500, y: 345, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg}),
        new Obstacle({x: floorImg.width*6 + 700, y: 345, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg}),
        new Obstacle({x: winPosition + 500, y: 200, w: 225, h: 300, img: endingImg})
    ]   
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    sceneryObjects.forEach((sceneryObject) => {
        sceneryObject.draw()
    })
    
    platforms.forEach((platform) => {
        platform.draw()
    })

    obstacles.forEach((obstacle) => {
        obstacle.draw()
    })

    player.update()
    
    // player movement
    if (keys.left && player.position.x > 50) {
        player.velocity.x = -player.speed
    } else if (keys.right && player.position.x < 450) {
        player.velocity.x = player.speed
    } else {
        player.velocity.x = 0

        // scroll background and obstacles
        if (keys.right) {
            progress += player.speed
            platforms.forEach((platform) => { platform.position.x -= player.speed })
            obstacles.forEach((obstacle) => { obstacle.position.x -= player.speed })
        }
        if (keys.left && progress > 0) {
            progress -= player.speed
            platforms.forEach((platform) => { platform.position.x += player.speed })
            obstacles.forEach((obstacle) => { obstacle.position.x += player.speed })
        }
    }

    // platform collision detection
    platforms.forEach((platform) => {
        let positionY = platform.position.y + 8;
        let positionX = platform.position.x - 2;
        if (player.position.y + player.height <= positionY && // top
            player.position.y + player.height + player.velocity.y >= positionY && // bottom
            player.position.x + player.width >= positionX && // left
            player.position.x <= positionX + platform.width) { // right
            player.velocity.y = 0
        }
    })

    console.log(progress)
    // win condition
    if (progress >= winPosition) {
        console.log("Congrats! You win!")
    }

    // lose condition
    if (player.position.y > canvas.height) {
        console.log("You lose... womp womp")
        init()
    }

    // obstacle collision detection
    obstacles.forEach((obstacle) => {
        if (player.position.x + player.width/2 >= obstacle.position.x &&
            player.position.x + player.width <= obstacle.position.x + obstacle.width &&
            player.position.y + player.height >= obstacle.position.y) {
            console.log("You lose... womp womp")
            init()
        }
    })
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
            player.velocity.y -= jumpSpeed
            break
        
        case 'd':
            console.log('right')
            keys.right = true
            break

        case 's':
            console.log('down')
            player.velocity.y += jumpSpeed
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
             
        case 'd':
            keys.right = false
            break

    }
    console.log(keys.right)
}