const Loader = function(){};

Loader.prototype = {
    require: function(scripts, target, callback) {
        var self = this;
        self.loadCount = 0;
        self.totalRequired = scripts.length;
        self.target = target;
        self.callback = callback;
        scripts.forEach(function(s){
            self.writeScript(s);
        });
    },
    loaded: function() {
        this.loadCount++;
        if(this.loadCount === this.totalRequired && typeof this.callback === 'function') {
            this.callback.call();
        }
    },
    writeScript: function (src) {
        var self = this;
        var s = document.createElement('script');
        s.async = false;
        s.src = src;
        s.onload = self.loaded.bind(self);
        self.target.parentNode.insertBefore(s, self.target);
    }
};

export default Loader;