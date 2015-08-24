const d = document;
const Loader = function(){};

Loader.prototype = {
    require: function(scripts, target, callback) {
        const self = this;
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
        const self = this, s = d.querySelector('script[src="' + src + '"]') || d.createElement('script');
        s.async = false;
        s.src = src;
        s.onload = self.loaded.bind(self);
        self.target.parentNode.insertBefore(s, self.target);
    }
};

export default Loader;