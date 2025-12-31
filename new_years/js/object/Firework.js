import Pool from './Pool.js';

/**@type HtmlCanvasElement */
const pool = new Pool(() => {
    return new Particle();
});

const blessingTexts = [
    "元旦快乐",
    "2026 快乐",
    "新年大吉",
    "万事顺遂",
    "元旦安康",
    "岁岁欢愉",
    "年年胜意",
    "新岁安康",
    "2026 如意",
    "元旦吉祥",
    "喜乐年年",
    "万事胜意",
    "新岁大吉",
    "2026 顺遂",
    "岁岁平安"
];

// 存储祝福文字的数组
const blessingList = [];

class Particle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.color = 0;
        this.vx = 0;
        this.vy = 0;
        this.age = 0;
        this.init();
    }

    // 初始化粒子（极坐标生成径向速度，保证圆形分布）
    init(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        // 极坐标生成360°均匀径向速度（圆形核心）
        const angle = Math.random() * Math.PI * 2; // 0~360°随机角度
        const speed = Math.random() * 8 + 2; // 2~10随机速度（平衡扩散范围）
        this.vx = Math.cos(angle) * speed; // 角度转X方向速度
        this.vy = Math.sin(angle) * speed; // 角度转Y方向速度
        this.age = 100; // 粒子生命周期
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // 重力（降低数值，减少向下偏移）
        this.vx *= 0.98; // X轴空气阻力（速度衰减，避免无限扩散）
        this.vy *= 0.98; // Y轴空气阻力（模拟真实物理）
        this.age--; // 生命周期递减（关键：粒子会随时间消失）
    }

    render(ctx) {
        this.update();
        // 保存当前透明度，避免干扰其他渲染
        const prevAlpha = ctx.globalAlpha;
        // 透明度随生命周期衰减
        ctx.globalAlpha = Math.max(0, this.age / 100);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        // 恢复透明度
        ctx.globalAlpha = prevAlpha;
    }
}

const particleList = new Array();

class Firework {
    constructor(W, H) {
        this.W = W;
        this.H = H;
        this.x = 0;
        this.y = 0;
        this.r = 2;
        this.maxY = 0;
        this.vel = 0;
        this.color = ``;
        this.disposable = false; // 是否一次性烟花
        this.exploded = false; // 新增：标记是否已爆炸（核心修复点）
    }

    init(x, maxY, disposable = false) {
        this.maxY = maxY;
        this.x = x || Math.random() * this.W;
        this.y = this.H;
        this.vel = -(Math.random() * Math.sqrt(this.H) / 3 + Math.sqrt(4 * this.H) / 2) / 5;
        this.color = `hsl(${Math.random() * 360 | 0}, 100%, 50%)`;
        this.disposable = disposable;
        this.exploded = false; // 初始化时重置爆炸标记
    }

    update() {
        this.y += this.vel;
        this.vel += 0.04;

        // 修复：仅当未爆炸 + （到达目标高度 或 上升到顶点）时，执行一次爆炸
        const reachTarget = this.y <= this.maxY && this.maxY > 0;
        const reachPeak = this.vel > 0; // 上升到顶点（vel从负变正）
        if ((reachTarget || reachPeak) && !this.exploded) {
            this.exploded = true; // 标记为已爆炸，阻止重复执行
            
            // 1. 创建粒子30-80个
            const rd = Math.ceil(Math.random() * 50) + 30;
            for (let i = 0; i < rd; i++) {
                const p = pool.get();
                p.init(this.x, this.y, this.color);
                particleList.push(p);
            }
            
            // 2. 添加祝福文字（仅执行一次）
            blessingList.push({
                x: this.x + (Math.random() - 0.5) * 10, // ±5px 随机偏移，减少视觉重叠
                y: this.y + (Math.random() - 0.5) * 10,
                color: this.color,
                text: blessingTexts[Math.floor(Math.random() * blessingTexts.length)],
                age: 80,
                fontSize: 24
            });

            // 非一次性烟花则重新初始化
            if (!this.disposable) {
                this.init();
            }
        }
    }

    render(ctx) {
        this.update();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 改为let，因为需要过滤重新赋值
let FireworkList = [];
const SIZE = { w: 0, h: 0 };

// 创建烟花
const createFirework = (w, h, type = 'auto', option = { x: 0, y: 0 }) => {
    if (SIZE.w != w && SIZE.h != h) {
        SIZE.w = w;
        SIZE.h = h;
    }
    // 分批创建烟花
    const firework = new Firework(w, h);
    switch (type) {
        case 'click':
            firework.init(option.x, option.y, true);
            break;
        case 'auto':
        default:
            firework.init();
            break;
    }
    FireworkList.push(firework);
};

const renderFirework = (ctx) => {
    // ctx.fillStyle = 'black';
    // ctx.fillRect(0, 0, SIZE.w, SIZE.h);

    // 优化：过滤掉已爆炸的一次性烟花，避免无效渲染
    FireworkList = FireworkList.filter(firework => {
        // 一次性烟花且已爆炸 → 移除
        if (firework.disposable && firework.exploded) {
            return false;
        }
        return true;
    });

    // 渲染烟花上升轨迹
    FireworkList.forEach(firework => {
        firework.render(ctx);
    });

    // 渲染粒子
    const validParticles = [];
    particleList.forEach(p => {
        p.render(ctx);
        if (p.age > 0) {
            validParticles.push(p);
        } else {
            pool.release(p);
        }
    });
    particleList.length = 0;
    particleList.push(...validParticles);

    // 渲染元旦祝福文字
    const validBlessings = [];
    blessingList.forEach(blessing => {
        blessing.age--;
        const baseFontSize = 12;
        const maxFontSize = 36;
        blessing.fontSize = baseFontSize + (maxFontSize - baseFontSize) * (1 - blessing.age / 80);

        if (blessing.age > 0) {
            const prevAlpha = ctx.globalAlpha;
            ctx.globalAlpha = Math.max(0, blessing.age / 80);
            ctx.font = `bold ${blessing.fontSize}px Microsoft YaHei, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = blessing.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeText(blessing.text, blessing.x, blessing.y);
            ctx.fillText(blessing.text, blessing.x, blessing.y);
            ctx.globalAlpha = prevAlpha;
            validBlessings.push(blessing);
        }
    });
    blessingList.length = 0;
    blessingList.push(...validBlessings);

    ctx.globalAlpha = 1;
};

export default { createFirework, renderFirework };