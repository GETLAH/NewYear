import h from './object/House.js'
import Moon from './object/Moon.js'
import Star from './object/Star.js';
import f from "./object/Firework.js"

const cvs = document.querySelector('#canvas');
const ctx = cvs.getContext('2d');
let WIDTH = cvs.width = window.innerWidth;
let HEIGHT = cvs.height = window.innerHeight;
const moon = new Moon({
    x: WIDTH - 150,
    y: 150,
    r: 100,
    color: '#e3fa14',
    shadowColor: '#e3fa14',
    shadowBlur: 30
});

function init(flag = true) {
    for(let i = 0; i < 5 && flag; i++) {
        setTimeout(() => {
            f.createFirework(WIDTH, HEIGHT)
        }, i * 1000);
    }
    h.renderHouse(WIDTH)
    h.autoSwitch()
    Star.createStar({ x: WIDTH, y: HEIGHT }, 100)
}
init()
function main() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // 填充颜色
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    moon.render(ctx)
    Star.render(ctx)
    f.renderFirework(ctx)
    requestAnimationFrame(main)
}
main()

window.addEventListener('resize', () => {
    WIDTH = cvs.width = window.innerWidth;
    HEIGHT = cvs.height = window.innerHeight;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    moon.init(WIDTH - 150)
    init(false)
})

window.addEventListener('click', (e) => {
    f.createFirework(WIDTH, HEIGHT, 'click', { x: e.clientX, y: e.clientY})
})