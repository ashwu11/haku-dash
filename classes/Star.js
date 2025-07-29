const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const starsImage = document.getElementById('starsImage');

const spawnArea = {
    xMin: 100, 
    xMax: 950,
    yMin: 100,
    yMax: 500
};

function getRandomPosition() {
    return {
        x: Math.random() * (spawnArea.xMax - spawnArea.xMin) + spawnArea.xMin,
        y: Math.random() * (spawnArea.yMax - spawnArea.yMin) + spawnArea.yMin
    };
}

class Star {
    static image = null;
    static frameSize = 32;
    static frameCount = 4;

    constructor() {
        this.image = starsImage;
        this.position = getRandomPosition();
        this.size = 30;
        this.frame = Math.floor(Math.random() * Star.frameCount);
    }

    draw() {
        if (!Star.image) return;

        ctx.drawImage(Star.image, 0, this.frame * Star.frameSize, 
            this.position.x - this.size / 2, this.position.y - this.size / 2);
    }

    // spawns stars in game
    spawnStarsLoop() {
        // TODO
    }

    // spawn a single star
    spawnStar() {
        // TODO
    }       
}

export default Star;