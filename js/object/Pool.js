/**
 * 对象池
 */
class ObjectPool {
    constructor(createFn) {
        this.createFn = createFn; // 用于创建新对象的函数
        this.pool = new Map();    // 存储对象池中的对象
        this.number = 1000;      // 对象池中对象初始化数量
        this._run(this.create.bind(this));              // 初始化对象池
    }

    _run(task){
        return new Promise(resolve => {
            this.init(()=>{
                for(let i = 0; i < this.number; i++) {
                    task();
                }
            }, resolve);
        })
    }

    init(tack, resolve) {
        const start = performance.now();
        requestAnimationFrame(() => {
            if (performance.now() - start < 16.66) {
                tack();
            }else {
                // 开启第二个线程
                const worker = new Worker('./js/object/worker.js');
                worker.postMessage(tack.toString());
                worker.onmessage = (e) => {
                    console.log('子线程返回数据:', e.data);
                }
            }
        })
    }
    // 创建对象
    create() {
        const obj = this.createFn();
        this.pool.set(Symbol(), { object: obj, inUse: true })
        return obj;
    }
    // 获取一个对象
    get() {
        const List = [...this.pool.keys()].filter(key => !this.pool.get(key).inUse);
        if (List.length > 0) {
            const obj = this.pool.get(List[0])
            obj.inUse = true;
            return obj.object;
        }
        return this.create();
    }
    // 释放对象
    release(obj) {
        const key = Array.from(this.pool.keys()).find((key) => this.pool.get(key).object === obj);
        if (key) {
            this.pool.get(key).inUse = false;
        }
    }
}

export default ObjectPool;