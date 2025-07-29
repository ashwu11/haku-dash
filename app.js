import Platform from "./classes/Platform.js";
import Player from "./classes/Player.js";
import Scenery from "./classes/Scenery.js";
import Obstacle from "./classes/Obstacle.js";

// Sounds
const audio = {
    main: document.getElementById('mainAudio'),
    walk: document.getElementById('walkingAudio'),
    jump: document.getElementById('jumpAudio'),
    wind: document.getElementById('windAudio'),
    thump: document.getElementById('thumpAudio'),
    tada: document.getElementById('tadaAudio')
};

// Images
const images = {
    background: document.getElementById('backgroundImage'),
    wood: document.getElementById('woodImage'),
    floor: document.getElementById('floorImage'),
    noFace: document.getElementById('nofaceImage'),
    player: document.getElementById('chihiroImage'),
    ending: document.getElementById('hakuImage'),
    soot: document.getElementById('sootRockImage')
}

// Game elements
const gameContainer = document.getElementById('game');
const message = document.getElementById("message");
const instruction = document.getElementById("instruction");
const overlayScreen = document.getElementById("overlayScreen");
const playAgainButton = document.getElementById("playAgain");

// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

// Constants
const winPosition = 6600;
const gravity = 0.88;
const jumpSpeed = 13;
const keys = { right: false, left: false };
const captions = [
    { threshold: 0, instruction: 'Use WAD keys to move' },
    { threshold: 50, instruction: 'Turn your volume up :)', message: 'Help Chihiro find Haku!' },
    { threshold: 800, instruction: '._.' },
    { threshold: 1000, message: 'Tip: use wooden logs to avoid pits' },
    { threshold: 2800, message: 'soot sprites are friendly...' },
    { threshold: 3200, message: 'but beware of No Face :<' },
    { threshold: 3700, message: 'phew, that was close' },
    { threshold: 4000, message: 'we are almost there :]' },
    { threshold: 5300, message: 'one more puzzle for you...' },
];

// Variables
let progress = 0;
let player = new Player(gravity, images.player, keys);
let platforms = [];
let sceneryObjects = [];
let obstacles = [];

// Game
document.addEventListener("DOMContentLoaded", () => { 
    startGame();
    animate();
})

setAudioVolume();
addEventListener('keydown', handleKeyDown);
addEventListener('keyup', handleKeyUp);

playAgainButton.addEventListener('click', () => {
    console.log('Play again button clicked');
    hideOverlayScreen();
    startGame();

    setTimeout(() => {
        gameContainer.classList.remove('fadeOut');
    }, 1000);
    
})

// *** FUNCTIONS ***

// initialize a new game
function startGame() {
    audio.main.play();
    progress = 0;
    player = new Player(gravity, images.player, keys);
    platforms = [
        new Platform({ x: -1, y: 500, w: 500, h: 100, img: images.floor }),
        new Platform({ x: images.floor.width - 2, y: 500, w: 500, h: 100, img: images.floor }),
        // death pits
        new Platform({ x: images.floor.width * 2 + 200, y: 500, w: 500, h: 100, img: images.floor }),
        new Platform({ x: images.floor.width * 3 + 325, y: 420, w: 150, h: 50, img: images.wood }),
        new Platform({ x: images.floor.width * 4 + 100, y: 500, w: 500, h: 100, img: images.floor }),
        // floating wood
        new Platform({ x: images.floor.width * 5 + 120, y: 400, w: 150, h: 50, img: images.wood }),
        new Platform({ x: images.floor.width * 5 + 310, y: 300, w: 150, h: 50, img: images.wood }),
        new Platform({ x: images.floor.width * 5 + 500, y: 400, w: 150, h: 50, img: images.wood }),
        new Platform({ x: images.floor.width * 6 + 200, y: 500, w: 500, h: 100, img: images.floor }),
        // soot sprites and No Face
        new Platform({ x: images.floor.width * 7 + 200, y: 500, w: 500, h: 100, img: images.floor }),
        new Platform({ x: images.floor.width * 7 + 300, y: 425, w: 55, h: 75, img: images.soot }),
        new Platform({ x: images.floor.width * 8 + 200, y: 500, w: 500, h: 100, img: images.floor }),
        // balance on logs
        new Platform({ x: images.floor.width * 9 + 370, y: 500, w: 150, h: 50, img: images.wood }),
        new Platform({ x: images.floor.width * 10 + 100, y: 500, w: 150, h: 50, img: images.wood }),
        new Platform({ x: images.floor.width * 10 + 400, y: 500, w: 500, h: 100, img: images.floor }),
        // final puzzle
        new Platform({ x: images.floor.width * 11 + 300, y: 500, w: 500, h: 100, img: images.floor }),
        new Platform({ x: images.floor.width * 11 + 350, y: 425, w: 55, h: 75, img: images.soot }),
        new Platform({ x: images.floor.width * 11 + 500, y: 325, w: 150, h: 50, img: images.wood }),
        new Platform({ x: images.floor.width * 12 + 100, y: 500, w: 500, h: 100, img: images.floor }),
        new Platform({ x: images.floor.width * 13 + 100, y: 500, w: 500, h: 100, img: images.floor }),
        // win platform
        new Platform({ x: images.floor.width * 14 + 150, y: 430, w: 150, h: 50, img: images.wood })
    ];
    sceneryObjects = [
        new Scenery({ x: 0, y: 0, w: canvas.width, h: canvas.height, img: images.background }),
        new Scenery({ x: 700, y: 200, w: images.noFace.width, h: images.noFace.height, img: images.noFace }),
        new Scenery({ x: 820, y: 270, w: 55, h: 75, img: images.soot }),
    ];
    obstacles = [
        new Obstacle({ x: images.floor.width * 8 - 10, y: 345, w: images.noFace.width, h: images.noFace.height, img: images.noFace }),
        new Obstacle({ x: images.floor.width * 12 + 270, y: 345, w: images.noFace.width, h: images.noFace.height, img: images.noFace }),
        new Obstacle({ x: winPosition + 700, y: 180, w: 230, h: 300, img: images.ending })
    ];
    // TODO
    // setTimeout(() => {
    //     startSpawningStars();
    // }, 10000);
}

// handle game animation
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw all elements
    sceneryObjects.forEach((sceneryObject) => { sceneryObject.draw() });
    platforms.forEach((platform) => { platform.draw() });
    obstacles.forEach((obstacle) => { obstacle.draw() });
    player.update();
    console.log(progress);

    // player movement
    if (keys.left && player.position.x > 50) {
        player.velocity.x = -player.speed;
    } else if (keys.right && player.position.x < 450) {
        player.velocity.x = player.speed;
    } else {
        player.velocity.x = 0;

        // scroll background and obstacles
        if (keys.right) {
            progress += player.speed;
            platforms.forEach((platform) => { platform.position.x -= player.speed });
            obstacles.forEach((obstacle) => { obstacle.position.x -= player.speed });
        }
        if (keys.left && progress > 0) {
            progress -= player.speed;
            platforms.forEach((platform) => { platform.position.x += player.speed });
            obstacles.forEach((obstacle) => { obstacle.position.x += player.speed });
        }
    }

    // walking sound 
    if (keys.left || keys.right) {
        if (audio.walk.paused) audio.walk.play();
    } else {
        if (!audio.walk.paused) audio.walk.pause();
    }

    // platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y + 10 && // top
            player.position.y + player.height + player.velocity.y >= platform.position.y + 10 && // bottom
            player.position.x + player.width - 14 >= platform.position.x && // left
            player.position.x + 14 <= platform.position.x + platform.width) { // right
            player.velocity.y = 0;
        }
    })

    // caption changes
    let currentStep = captions.findLast(step => progress >= step.threshold);
    if (currentStep) {
        if (currentStep.message) message.innerHTML = currentStep.message;
        if (currentStep.instruction) instruction.innerHTML = currentStep.instruction;
    }

    // win condition
    if (progress > winPosition) {
        message.innerHTML = 'Yay, we found Haku!';
        console.log("You win!");
        audio.tada.play();
        showWinScreen();
    }

    // lose condition
    if (player.position.y > canvas.height) {
        console.log("You lose... womp womp");
        message.innerHTML = 'ahhh... try again :]';
        audio.wind.play();
        startGame();
    }

    // obstacle collision detection
    obstacles.forEach((obstacle) => {
        if (player.position.x + player.width - 35 >= obstacle.position.x &&
            player.position.x + 35 <= obstacle.position.x + obstacle.width &&
            player.position.y + player.height - 35 >= obstacle.position.y) {
            console.log("You lose... womp womp");
            message.innerHTML = 'ouch... try again :]';
            audio.thump.play();
            startGame();
        }
    })
}

// handle user key down event
function handleKeyDown(event) {
    var key = event.key.toLowerCase();
    switch (key) {
        case 'a':
            keys.left = true;
            break;

        case 'w':
            if (player.velocity.y == 0) {
                player.velocity.y -= jumpSpeed;
                audio.jump.play();
            }
            break;

        case 'd':
            keys.right = true;
            break;

    }
}

// handle user key up event
function handleKeyUp(event) {
    var key = event.key.toLowerCase();

    switch (key) {
        case 'a':
            keys.left = false;
            break;

        case 'd':
            keys.right = false;
            break;

    }
}

// helper that shows overlay screen
function showOverlayScreen() {
    console.log('showing overlay screen');
    overlayScreen.classList.add('show');
}

// helper that hides overlay screen
function hideOverlayScreen() {
    console.log('hiding overlay screen');
    overlayScreen.classList.remove('show');
}

// helper that shows win screen
function showWinScreen() {
    console.log('Showing win screen');
    gameContainer.classList.add('fadeOut');
    setTimeout(() => {
        showOverlayScreen();
    }, 2500);
}

// set up audio volume 
function setAudioVolume() {
    audio.main.volume = 0.3;
    audio.jump.volume = 0.3;
    audio.walk.volume = 0.6;
    audio.wind.volume = 0.3;
    audio.thump.volume = 0.3;
    audio.tada.volume = 0.1;
}