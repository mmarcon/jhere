/*
Copyright (c) 2012 Massimiliano Marcon, http://marcon.me

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function($){
    $.error = function(msg){
        throw new Error(msg);
    };
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