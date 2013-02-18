;(function($){
    /*MINIMAL implementation of $.Deferred*/
    /*This only implements the method required by jHERE*/
    /*So do not use it for real "promises" purpose*/
    $.Deferred = function(){
        if(!(this instanceof $.Deferred)) {
            return new $.Deferred();
        }
        this.queue = [];
        this._state = 'pending';
    };

    function callCallbacks(){
        $.each(this.queue, function(i, fn){
            if(typeof fn === 'function') {
                fn.call(null);
            }
        });
    }

    var D = $.Deferred.prototype, Data, P, d;
    D.resolve = function(){
        this._state = 'resolved';
        callCallbacks.call(this);
    };
    D.state = function(){
        return this._state;
    };
    D.done = function(callback){
        if(this._state === 'pending') {
            this.queue.push(callback);
            return;
        }
        callback.call(null);
    };

    Data = function(){
        this.store = {};
        this.counter = 0;
    };
    P = Data.prototype;
    P.data = function(element, key, object){
        if(!object) {
            //getter
            return this.store[element.__data] && this.store[element.__data][key];
        }
        if(!element.__data) {
            element.__data = 'cache' + this.counter++;
        }
        this.store[element.__data] = this.store[element.__data] || {};
        this.store[element.__data][key] = object;
    };
    P.removeData = function(element, key){
        if(key) {
            this.store[element.__data][key] = null;
            return;
        }
        this.store[element.__data] = null;
    };

    d = new Data();
    $.data = function(){
        return d.data.apply(d, arguments);
    };
    $.removeData = function(){
        return d.removeData.apply(d, arguments);
    };

    //Export Zepto as jQuery so there is no need
    //to check for it in the plugin.
    window.jQuery = $;
}(Zepto));