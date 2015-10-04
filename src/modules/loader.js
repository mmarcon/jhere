/*
Copyright (c) 2015 Massimiliano Marcon, http://marcon.me

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

const d = document;
const Loader = function(){};

Loader.prototype = {
    require: function(scripts, target, callback) {
        const self = this;
        self.started = true;
        self.loadCount = 0;
        self.totalRequired = scripts.length;
        self.target = target;
        self.callback = callback;
        scripts.forEach(s => self.writeScript(s));
        return self;
    },
    requireCss: function(css){
        const head = d.querySelector('head');
        css.forEach(function(href){
            const link = d.createElement('link');
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            head.appendChild(link);
        });
        return this;
    },
    loaded: function() {
        this.loadCount++;
        if(this.loadCount === this.totalRequired && typeof this.callback === 'function') {
            this.callback.call();
        }
    },
    writeScript: function (src) {
        const self = this, s = d.createElement('script');
        s.async = false;
        s.src = src;
        s.onload = self.loaded.bind(self);
        self.target.parentNode.insertBefore(s, self.target);
    }
};

export default Loader;
