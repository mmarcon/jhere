/* globals H: true */
import Loader from './loader';
import * as config from './config';
import {extend, isFn, Runner} from './utils';

const d = document;

const jHERE = function jHERE(element, options){
    if(!(this instanceof jHERE)) {
        return new jHERE(element, options);
    }
    this.el = element;
    this.options = extend(config.defaults, options);
    this._init();
};

const JH = jHERE.prototype;

const apiLoader = new Loader();
const modules = config.modules.map(module => config.url.replace('M', module));
const runner = new Runner();

JH._init = function(){
    const self = this;
    const classList = self.el.classList;
    //Using classList because dataset is not supported in IE10
    if(classList.contains(config.lib)) {
        return;
    }
    self.el.classList.add(config.lib);
    runner.run(() => self._makemap());
    if(!apiLoader.started) {
        apiLoader
            .require(modules, d.querySelector('script[src*="jhere"]'), () => runner.start())
            .requireCss([config.uiCss]);
    }
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
    //TODO: look at the options {enabled: Behavior.DRAGGING, Behavior.WHEELZOOM, Behavior.DBLTAPZOOM}
    new Behavior(new H.mapevents.MapEvents(self.map));
    self.mc = new H.map.Group();
    self.map.addObject(self.mc);
};

JH.center = function(newCenter, animate){
    const self = this;
    runner.run(() => self.map.setCenter(newCenter, animate));
    return self;
};

JH.zoom = function(newZoomLevel, animate){
    const self = this;
    runner.run(() => self.map.setZoom(newZoomLevel, animate));
    return self;
};

JH.type = function(type, layer){
    const self = this;
    type = type || 'normal';
    layer = layer || 'map';
    runner.run(() => self.layers[type] && self.layers[type][layer] && self.map.setBaseLayer(self.layers[type][layer]));
    return self;
};

JH.on = function(event, callback) {
    const self = this;
    const _callback = function(e){
        const currentPointer = e.currentPointer;
        if(!!self.map.getObjectAt(currentPointer.viewportX, currentPointer.viewportY)) {
            /*
            returns if there is an object at this pointer position: this means that the pointer
            event happened on an object (e.g. marker) and not on the map itself. For some reason the
            event seems to buuble up to the map, so thie prevents it.
            */
            return;
        }
        if(currentPointer) {
            /*Add the geo-coordinate of the pointer*/
            e.geo = self.map.screenToGeo(currentPointer.viewportX, currentPointer.viewportY);
        }
        callback.call(self, e);
    };
    runner.run(() => self.map.addEventListener(event, _callback));
    return self;
};

JH.off = function(event, callback) {
    const self = this;
    runner.run(() => self.map.removeEventListener(event, callback, true, self));
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
        config.supportedEvents.forEach(function(eventName){
            if(options[eventName]) {
                marker.addEventListener(eventName, options[eventName], true, marker);
            }
        });
        self.mc.addObject(marker);
    };
    runner.run(_marker);
    return self;
};

JH.nomarkers = function(){
    const self = this;
    runner.run(() => self.mc.removeAll());
    return self;
};

JH.bubble = function(coords, options){
    options = options || {};
    const self = this;
    const _bubble = function(){
        if(options.only) {
            self.nobubbles();
        }
        const infoBubble = new H.ui.InfoBubble(coords, options);
        if(isFn(options.onclose)) {
            infoBubble.addEventListener('statechange', function(){
                return (this.getState() === 'closed' && options.onclose.call(this));
            });
        }
        self.ui.addBubble(infoBubble);
    };
    runner.run(_bubble);
    return self;
};

JH.nobubbles = function(){
    const self = this;
    const _nobubbles = function(){
        self.ui.getBubbles().forEach((bubble) => (bubble.close() && bubble.dipose()));
    };
    runner.run(_nobubbles);
    return self;
};

JH.originalMap = function(closure){
    const self = this;
    runner.run(() => closure.call(self, self.map, H));
    return self;
};

jHERE.extend = function(name, fn) {
    if (typeof name === 'string' && isFn(fn)) {
        JH[name] = fn;
    }
};

export default jHERE;