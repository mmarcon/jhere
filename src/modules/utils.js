export function isFn(f){
    return typeof f === 'function';
}

export function Runner(){
    this._queue = [];
    this._done = false;
}

Runner.prototype.run = function(task){
    if(this._done) {
        return task();
    }
    this._queue.push(task);
};

Runner.prototype.start = function(){
    var next;
    while((next = this._queue.shift())) {
        next();
    }
    this._done = true;
};
