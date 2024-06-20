import Platform from "./classes/Platform.js"
import Player from "./classes/Player.js"
import Scenery from "./classes/Scenery.js"
import Obstacle from "./classes/Obstacle.js"

// Audio
const audio = document.getElementById('mainAudio')
const walkSound = document.getElementById('walkingAudio')
const jumpSound = document.getElementById('jumpAudio')
const windSound = document.getElementById('windAudio')
const thumpSound = document.getElementById('thumpAudio')
const tadaSound = document.getElementById('tadaAudio')

// Images
const backgroundImg = document.getElementById('backgroundImage')
const woodImg = document.getElementById('woodImage')
const floorImg = document.getElementById('floorImage')
const nofaceImg = document.getElementById('nofaceImage')
const playerImg = document.getElementById('chihiroImage')
const endingImg = document.getElementById('hakuImage')
const sootRockImg = document.getElementById('sootRockImage')

// Game elements
const gameContainer = document.getElementById('game')
const message = document.getElementById("message")
const instruction = document.getElementById("instruction")
const overlayScreen = document.getElementById("overlayScreen")
const playAgainButton = document.getElementById("playAgain")

// Canvas setup
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

// Constants
const winPosition = 6600
const gravity = 0.6
const jumpSpeed = 11
const keys = { right: false, left: false }

// Variables
let progress = 0
let player = new Player(gravity, playerImg, keys)
let platforms = []
let sceneryObjects = []
let obstacles = []

// Game
setAudioVolume()
startGame()
animate()
addEventListener('keydown', handleKeyDown)
addEventListener('keyup', handleKeyUp)

playAgainButton.addEventListener('click', () => {
    console.log('Play again button clicked')
    startGame()
    gameContainer.classList.remove('fadeOut')
    hideOverlayScreen()
})

// *** FUNCTIONS ***
// initialize a new game
function startGame() {
    audio.play()
    walkSound.play()
    progress = 0
    player = new Player(gravity, playerImg, keys)
    platforms = [
        new Platform({ x: -1, y: 500, w: 500, h: 100, img: floorImg }),
        new Platform({ x: floorImg.width - 2, y: 500, w: 500, h: 100, img: floorImg }),
        // death pits
        new Platform({ x: floorImg.width * 2 + 200, y: 500, w: 500, h: 100, img: floorImg }),
        new Platform({ x: floorImg.width * 3 + 325, y: 420, w: 150, h: 50, img: woodImg }),
        new Platform({ x: floorImg.width * 4 + 100, y: 500, w: 500, h: 100, img: floorImg }),
        // floating wood
        new Platform({ x: floorImg.width * 5 + 120, y: 400, w: 150, h: 50, img: woodImg }),
        new Platform({ x: floorImg.width * 5 + 310, y: 300, w: 150, h: 50, img: woodImg }),
        new Platform({ x: floorImg.width * 5 + 500, y: 400, w: 150, h: 50, img: woodImg }),
        new Platform({ x: floorImg.width * 6 + 200, y: 500, w: 500, h: 100, img: floorImg }),
        // soots and No Face
        new Platform({ x: floorImg.width * 7 + 200, y: 500, w: 500, h: 100, img: floorImg }),
        new Platform({ x: floorImg.width * 7 + 300, y: 425, w: 55, h: 75, img: sootRockImg }),
        new Platform({ x: floorImg.width * 8 + 200, y: 500, w: 500, h: 100, img: floorImg }),
        // balance on logs
        new Platform({ x: floorImg.width * 9 + 370, y: 500, w: 150, h: 50, img: woodImg }),
        new Platform({ x: floorImg.width * 10 + 100, y: 500, w: 150, h: 50, img: woodImg }),
        new Platform({ x: floorImg.width * 10 + 400, y: 500, w: 500, h: 100, img: floorImg }),
        // final puzzle
        new Platform({ x: floorImg.width * 11 + 300, y: 500, w: 500, h: 100, img: floorImg }),
        new Platform({ x: floorImg.width * 11 + 350, y: 425, w: 55, h: 75, img: sootRockImg }),
        new Platform({ x: floorImg.width * 11 + 500, y: 325, w: 150, h: 50, img: woodImg }),
        new Platform({ x: floorImg.width * 12 + 100, y: 500, w: 500, h: 100, img: floorImg }),
        new Platform({ x: floorImg.width * 13 + 100, y: 500, w: 500, h: 100, img: floorImg }),
        // win platform
        new Platform({ x: floorImg.width * 14 + 150, y: 430, w: 150, h: 50, img: woodImg })
    ]
    sceneryObjects = [
        new Scenery({ x: 0, y: 0, w: canvas.width, h: canvas.height, img: backgroundImg }),
        new Scenery({ x: 700, y: 200, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg }),
        new Scenery({ x: 820, y: 270, w: 55, h: 75, img: sootRockImg }),
    ]
    obstacles = [
        new Obstacle({ x: floorImg.width * 8 - 10, y: 345, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg }),
        new Obstacle({ x: floorImg.width * 12 + 275, y: 345, w: nofaceImg.width, h: nofaceImg.height, img: nofaceImg }),
        new Obstacle({ x: winPosition + 700, y: 180, w: 230, h: 300, img: endingImg })
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
        if (player.position.y + player.height <= platform.position.y + 10 && // top
            player.position.y + player.height + player.velocity.y >= platform.position.y + 10 && // bottom
            player.position.x + player.width - 14 >= platform.position.x && // left
            player.position.x + 14 <= platform.position.x + platform.width) { // right
            player.velocity.y = 0
        }
    })

    console.log(progress)

    // caption changes
    if (progress < 50) instruction.innerHTML = "Use WAD keys to move"
    if (progress >= 50) {
        message.innerHTML = 'Help Chihiro find Haku!'
        instruction.innerHTML = 'Turn your volume up :)'
    }
    if (progress >= 800) instruction.innerHTML = '._.'
    if (progress >= 1000) message.innerHTML = 'Tip: use wooden logs to avoid pits'
    if (progress >= 2800) message.innerHTML = 'soot sprites are friendly...'
    if (progress >= 3200) message.innerHTML = 'but beware of No Face :<'
    if (progress >= 3700) message.innerHTML = 'phew, that was close'
    if (progress >= 4000) message.innerHTML = 'we are almost there :]'
    if (progress >= 5300) message.innerHTML = 'one more puzzle for you...'

    // win condition
    if (progress > winPosition) {
        message.innerHTML = 'Yay, we found Haku!'
        console.log("You win!")
        tadaSound.play()
        showWinScreen()
    }

    // lose condition
    if (player.position.y > canvas.height) {
        console.log("You lose... womp womp")
        message.innerHTML = 'ahhh... try again :]'
        windSound.play()
        startGame()
    }

    // obstacle collision detection
    obstacles.forEach((obstacle) => {
        if (player.position.x + player.width - 35 >= obstacle.position.x &&
            player.position.x + 35 <= obstacle.position.x + obstacle.width &&
            player.position.y + player.height - 35 >= obstacle.position.y) {
            console.log("You lose... womp womp")
            message.innerHTML = 'ouch... try again :]'
            thumpSound.play()
            startGame()
            // document.getElementById('chihiroImage').classList.add('fadeOut')
            // setTimeout(() => {
            //     startGame()
            // }, 3000)
            // I think the image doesn't actually disappear, is being overwritten so it lags
        }
    })
}

// handle user key events
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

// handle user key events
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

// helper that shows overlay screen
function showOverlayScreen() {
    console.log('showing overlay screen')
    overlayScreen.classList.add('show')
}

// helper that hides overlay screen
function hideOverlayScreen() {
    console.log('hiding overlay screen')
    overlayScreen.classList.remove('show')
}

// helper that shows win screen
function showWinScreen() {
    console.log('Showing win screen')
    gameContainer.classList.add('fadeOut')
    setTimeout(() => {
        showOverlayScreen()
    }, 2500)
}

// set up audio volume 
function setAudioVolume() {
    audio.volume = 0.3
    jumpSound.volume = 0.3
    walkSound.volume = 0.6
    windSound.volume = 0.3
    thumpSound.volume = 0.3
    tadaSound.volume = 0.1
}