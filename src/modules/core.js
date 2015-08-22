/* globals H: true */
import Loader from './loader';
import * as config from './config';
import {extend, isFn, Runner} from './utils';


const w = window;
const d = document;

const constructor = w.jHERE = function jHERE(element, options){
    this.el = element;
    this.options = extend(config.defaults, options);
    this._runner = new Runner();
    this._init();
};

const JH = constructor.prototype;

JH._init = function(){
    const self = this;
    const classList = self.el.classList;
    const apiLoader = new Loader();
    const modules = config.modules.map(module => config.url.replace('M', module));
    //Using classList because dataset is not supported in IE10
    if(classList.contains(config.lib)) {
        return;
    }
    self.el.classList.add(config.lib);
    self._runner.run(() => self._makemap());
    apiLoader.require(modules, d.querySelector('script[src*="jhere"]'), () => self._runner.start());
};

JH._makemap = function(){
    const self = this;
    self.platform = new H.service.Platform({
        app_id: self.options.credentials.appId,
        app_code: self.options.credentials.authToken
    });
    self.layers = self.platform.createDefaultLayers();
    self.map = new H.Map(self.el, self.layers.normal.map, self.options);
};

JH.center = function(newCenter, animate){
    const self = this;
    self._runner.run(() => self.map.setCenter(newCenter, animate));
    return self;
};

JH.zoom = function(newZoomLevel, animate){
    const self = this;
    self._runner.run(() => self.map.setZoom(newZoomLevel, animate));
    return self;
};

JH.type = function(type, layer){
    const self = this;
    type = type || 'normal';
    layer = layer || 'map';
    self._runner.run(() => self.map.setBaseLayer(self.layers[type][layer]));
    return self;
};

JH.marker = function(){};
JH.nomarkers = function(){};
JH.bubble = function(){};
JH.nobubbles = function(){};

JH.originalMap = function(closure){
    const self = this;
    self._runner.run(() => closure.call(self, self.map, H));
    return self;
};

constructor.extend = function(name, fn) {
    if (typeof name === 'string' && isFn(fn)) {
        JH[name] = fn;
    }
};