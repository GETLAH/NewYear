class Star {
    constructor(size) {
        this.size = size;
        this.x = Math.random() * size.x;
        this.y = Math.random() * size.y;
        this.r = Math.random() * 0.2 + 1;
        this.color = 'rgba(255,255,255,'+ (Math.random() * 0.5 + 0.3) +')';
        this.shadowColor = '#fff';
        this.shadowBlur = 10;
        this.shadow = 0.1;
        this.age = Math.random() * 1000 + 1000;
    }

    update() {
        this.age--;
        this.shadowBlur = this.shadowBlur + this.shadow;
        this.shadow = this.shadowBlur > 20 ? -0.1 : this.shadow;
        this.shadow = this.shadowBlur < 0 ? 0.1 : this.shadow;
        if (this.age < 0) {
            this.age = Math.random() * 1000 + 1000;
            this.x = Math.random() * this.size.x;
            this.y = Math.random() * this.size.y;
        }
    }

    render(ctx) {
        this.update();
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}


let startList = []

const createStar = (obj, number) => {
    const list = [];
    for (let i = 0; i < number; i++) {
        const star = new Star(obj);
        list.push(star);
    }
    startList = list;
}

const render = (ctx) => {
    startList.forEach(star => {
        star.render(ctx);
    })
}

export default {createStar, render};