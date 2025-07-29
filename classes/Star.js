const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const starsImage = document.getElementById('starsImage');

const spawnArea = {
    xMin: 100, 
    xMax: 950,
    yMin: 100,
    yMax: 500
};

const intervalRange = {
    min: 2000,
    max: 8000
};

function getRandomPosition() {
    return {
        x: Math.random() * (spawnArea.xMax - spawnArea.xMin) + spawnArea.xMin,
        y: Math.random() * (spawnArea.yMax - spawnArea.yMin) + spawnArea.yMin
    };
}

class Star {
    constructor() {
        this.image = starsImage;
        this.position = getRandomPosition();
        this.colour = Math.floor(Math.random() * 4);
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    // spawns stars in game
    startSpawningStars() {
        // TODO
    }

    // spawn a single star
    spawnStar() {
        // TODO
    }       
}

export default Star;