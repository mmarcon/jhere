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
    apiLoader
        .require(modules, d.querySelector('script[src*="jhere"]'), () => self._runner.start())
        .requireCss([config.uiCss]);
};

JH._makemap = function(){
    const self = this;
    const Behavior = H.mapevents.Behavior;
    self.platform = new H.service.Platform({
        app_id: self.options.credentials.appId,
        app_code: self.options.credentials.authToken,
        useHTTPS: true
    });
    self.layers = self.platform.createDefaultLayers();
    self.map = new H.Map(self.el, self.layers.normal.map, self.options);
    self.ui = new H.ui.UI(self.map);
    //TODO: look at the options Behavior.DRAGGING, Behavior.WHEELZOOM, Behavior.DBLTAPZOOM
    new Behavior(new H.mapevents.MapEvents(self.map));
    self.mc = new H.map.Group();
    self.map.addObject(self.mc);
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
    self._runner.run(() => self.layers[type] && self.layers[type][layer] && self.map.setBaseLayer(self.layers[type][layer]));
    return self;
};

//options.icon is the URL
//options.size is the size in px
//options.anchor is the anchor point
JH.marker = function(coords, options){
    options = options || {};
    const self = this;
    const _marker = function(){
        if (options.icon) {
            options.crossOrigin = true;
            options.icon = new H.map.Icon(options.icon, options);
        }
        const marker = new H.map.Marker(coords, options);
        config.supportedEvents.forEach(function(e){
            if(options[e]) {
                marker.addEventListener(e, options[e], true, marker);
            }
        });
        self.mc.addObject(marker);
    };
    self._runner.run(_marker);
    return self;
};

JH.nomarkers = function(){
    const self = this;
    self._runner.run(() => self.mc.removeAll());
    return self;
};

JH.bubble = function(coords, options){
    options = options || {};
    const self = this;
    const _bubble = function(){
        if(options.only) {
            self.nobubbles();
        }
        self.ui.addBubble(new H.ui.InfoBubble(coords, options));
    };
    self._runner.run(_bubble);
    return self;
};

JH.nobubbles = function(){
    const self = this;
    const _nobubbles = function(){
        self.ui.getBubbles().forEach((bubble) => (bubble.close() && bubble.dipose()));
    };
    self._runner.run(_nobubbles);
    return self;
};

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