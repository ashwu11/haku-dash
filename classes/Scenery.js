const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Scenery {
    constructor({x, y, w, h, img}) {
        this.image = img;
        this.position = {x, y};
        this.width = w;
        this.height = h;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}

export default Scenery;