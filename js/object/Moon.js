class Moon {
    constructor(obj) {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.color = "#fff";
        this.shadowColor = "#fff";
        this.shadowBlur = 0;
        this.shadow = 0.1;
        Object.assign(this, obj);
    }

    init(x){
        this.x = x - this.r;
    }

    updata() {
        this.shadowBlur = this.shadowBlur + this.shadow;
        this.shadow = this.shadowBlur > 30 ? -0.05 : this.shadow;
        this.shadow = this.shadowBlur < 25 ? 0.05 : this.shadow;
    }

    render(ctx) {
        this.updata();
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

export default Moon;