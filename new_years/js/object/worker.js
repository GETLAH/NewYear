console.log("开始执行任务");
// worker.js文件中的代码
self.onmessage = function(event) {
    const data = event.data;
    const tack = new Function(data.tack);
    tack(data.tack);
    self.postMessage("任务完成");
};