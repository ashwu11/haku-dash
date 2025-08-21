const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Player {
    constructor(g, img, keys) {
        this.position = {x: 100, y: 100};
        this.width = 85;
        this.height = 160;
        this.velocity = {x: 10, y: 10};
        this.speed = 7;
        this.image = img;
        this.frame = 2;
        this.counter = 5;
        this.gravity = g;
        this.keys = keys;
        this.facing === "right";
    }

    draw() {
        ctx.save();

        const flipped = this.facing === "left";
        const drawX = flipped ? -this.position.x - this.width : this.position.x;

        if (flipped) {
            ctx.scale(-1, 1);
        }

        ctx.drawImage(
            this.image,
            69.5 * this.frame, 0,   
            70, 170,                
            drawX, this.position.y, 
            this.width, this.height 
        );

        ctx.restore();
    }

    update() {
        // frames
        if (this.counter > 0){
            this.counter--;
        } else if (this.keys.right) {
            this.facing = "right";
            this.frame++;
            if (this.frame > 7) this.frame = 0;
            this.counter = 5;
        } else if (this.keys.left) {
            this.facing = "left";
            this.frame--;
            if (this.frame < 1) this.frame = 7;
            this.counter = 5;
        }

        // speed
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity
        if (this.position.y + this.height <= canvas.height - this.velocity.y) {
            this.velocity.y += this.gravity;
        }
    }
}

export default Player;