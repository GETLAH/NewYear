const house = document.querySelector('#house');
let number = 0;
const createHouse = () => {
    const ridgepole = document.createElement('div');
    // 宽
    const w = Math.ceil(Math.random() * 30) + 10 + "px";
    // 距离右边距离  css设置的gap的距离(8px)
    const r = Math.ceil(Math.random() * 20) + 28 + "px";
    // 圆角
    const radius = Math.ceil(Math.random() * 10) + 10 + "px";
    // 伪元素
    const pseudo = Math.ceil(Math.random() * 4) + 10 + "px";
    // 外边距
    const margin = Math.ceil(Math.random() * 20) + "px";
    ridgepole.style.setProperty('--w', w);
    ridgepole.style.setProperty('--r', r);
    ridgepole.style.setProperty('--radius', radius);
    ridgepole.style.setProperty('--pseudo', pseudo);
    ridgepole.style.setProperty('--margin', margin);
    
    ridgepole.classList.add('ridgepole');
    // 有多少层
    const level = Math.ceil(Math.random() * 6) + 6;
    for (let i = 0; i < level; i++) {
        number++;
        const warm = document.createElement('div');
        // 高
        const h = Math.ceil(Math.random() * 10) + 10 + "px";
        // 距离上一层的高度
        const t = Math.ceil(Math.random() * 20) + 10 + "px";
        warm.style.setProperty('--h', h);
        warm.style.setProperty('--d', number / 10 + 's');
        warm.style.setProperty('--t', t);
        // 是否在家 50% 概率
        const flag = Math.random() < 0.5;
        warm.style.opacity = flag ? 1 : 0;
        warm.classList.add('warm');
        ridgepole.appendChild(warm);
    }
    house.appendChild(ridgepole);
}

/**
 * @param WIDTH 指定宽度渲染房子
*/
const renderHouse = (WIDTH) => {
    const houseWidth = house.offsetWidth;
    createHouse();
    houseWidth < WIDTH ? renderHouse(WIDTH) : null;
}

/**
 * 不定时开关灯
 */
let autoSwitchFlag = false;
const autoSwitch = () => {
    const warm = document.querySelectorAll('.warm');
    if (autoSwitchFlag) return; // 防止重复调用
    setInterval(() => {
        autoSwitchFlag = true
        // 创建随机数数组
        const rdNumber = Math.ceil(Math.random() * 10) + 5;
        const randomArr = Array.from({ length: rdNumber }, () => Math.floor(Math.random() * warm.length));
        randomArr.forEach((item) => {
            warm[item].style.opacity = warm[item].style.opacity === '0' ? '1' : '0';
        })
    }, 1000 * 3)
}


export default { renderHouse, autoSwitch };