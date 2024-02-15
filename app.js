import Platform from "./classes/Platform.js"
import Player from "./classes/Player.js"
import Scenery from "./classes/Scenery.js"
import Obstacle from "./classes/Obstacle.js"

const audio = document.getElementById('mainAudio')
const walkSound = document.getElementById('walkingAudio')
const jumpSound = document.getElementById('jumpAudio')
const windSound = document.getElementById('windAudio')
const thumpSound = document.getElementById('thumpAudio')
const tadaSound = document.getElementById('tadaAudio')

const backgroundImg = document.getElementById('backgroundImage')
const woodImg = document.getElementById('woodImage')
const floorImg = document.getElementById('floorImage')
const nofaceImg = document.getElementById('nofaceImage')
const playerImg = document.getElementById('chihiroImage')
const endingImg = document.getElementById('hakuImage')
const sootRockImg = document.getElementById('sootRockImage')
const message = document.getElementById("message")

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
const winPosition = 5000
const gravity = 0.6
const jumpSpeed = 11
const keys = {right: false, left: false}

let progress = 0
let player = new Player(gravity, playerImg, keys)
let platforms = []
let sceneryObjects = []
let obstacles = []

jumpSound.volume = 0.3
walkSound.volume = 0.6
windSound.volume = 0.3
thumpSound.volume = 0.3
tadaSound.volume = 0.1

init()
animate()
addEventListener('keydown', handleKeyDown)
addEventListener('keyup', handleKeyUp)

// FUNCTIONS
// initialize a new game
function init() {
    audio.play()
    walkSound.play()
    progress = 0 
    player = new Player(gravity, playerImg, keys)
    platforms = [ 
        new Platform({x: -1, y: 500, w: 500, h: 100, img: floorImg}),
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
        new Platform({x: floorImg.width*8 + 800, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*9 + 800, y: 500, w: 500, h: 100, img: floorImg}),
        new Platform({x: floorImg.width*10 + 500, y: 500, w: 500, h: 100, img: floorImg})
    ]
    sceneryObjects = [
        new Scenery({x: 0, y: 0, w: canvas.width, h: canvas.height, img: backgroundImg}),
        new Scenery({x: 700, y: 200, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg}),
        new Scenery({x: 820, y: 270, w: 75, h: 75, img: sootRockImg}),
    ]
    obstacles = [
        new Obstacle({x: floorImg.width*6 + 700, y: 345, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg}),
        new Obstacle({x: winPosition + 600, y: 210, w: 230, h: 300, img: endingImg})
    ]
}

// handle game animation
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // draw all elements
    sceneryObjects.forEach((sceneryObject) => { sceneryObject.draw() })
    platforms.forEach((platform) => { platform.draw() })
    obstacles.forEach((obstacle) => { obstacle.draw() })
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
        if (player.position.y + player.height <= platform.position.y + 8 && // top
            player.position.y + player.height + player.velocity.y >= platform.position.y + 8 && // bottom
            player.position.x + player.width - 14 >= platform.position.x && // left
            player.position.x + 14 <= platform.position.x + platform.width) { // right
            player.velocity.y = 0
        }
    })

    console.log(progress)

    // message changes
    if (progress >= 1000) message.innerHTML = 'Tip: use wooden logs to avoid pits!'
    if (progress >= 2500) message.innerHTML = 'Soot sprites are friendly...'
    if (progress >= 3000) message.innerHTML = 'but beware of No Face!'
    if (progress >= 3500) message.innerHTML = 'Nice, we are almost there :]'

    // win condition
    if (progress >= winPosition) {
        message.innerHTML = 'Yay, we found Haku!'
        console.log("You win!")
        tadaSound.play()
    } 

    // lose condition
    if (player.position.y > canvas.height) {
        console.log("You lose... womp womp")
        windSound.play()
        init()
    }

    // obstacle collision detection
    obstacles.forEach((obstacle) => {
        if (player.position.x + player.width/2 >= obstacle.position.x &&
            player.position.x + player.width <= obstacle.position.x + obstacle.width &&
            player.position.y + player.height >= obstacle.position.y) {
            console.log("You lose... womp womp")
            thumpSound.play()
            init()
        }
    })
}

// handle key events
function handleKeyDown(event) {
    var key = event.key.toLowerCase()
    switch (key) {
        case 'a':
            console.log('left')
            keys.left = true
            break
        
        case 'w':
            console.log('up')
            if (player.velocity.y == 0) {
                player.velocity.y -= jumpSpeed
                jumpSound.play()
            }
            break
        
        case 'd':
            console.log('right')
            keys.right = true
            break

        case 's':
            console.log('down')
            break
    }
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