/* globals H: true */
import Loader from './loader';
import * as config from './config';
import {extend, isFn, Runner} from './utils';

const d = document;

/**
 * Creates an instance of jHERE. The "new" is not required.
 *
 * @example
 * var map = jHERE(document.querySelector('#map'), {zoom: 14, center: {lat: 52.5, lng: 13.3}});
 *
 * @constructor
 * @param      {Element} element DOM element where the map will be shown
 * @param      {Object}  options options for the map
 * @return     {Object} the instance of jHERE
 */
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
    /*! Using classList because dataset is not supported in IE10 */
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

/**
 * Sets the center of the map
 * 
 * @example
 * //Sets the new center with animation
 * map.center({lat: 52.1, lng: 13.23}, true)
 *
 * //Sets the new center without animation
 * map.center({lat: 52.1, lng: 13.23}, false)
 *
 * @param      {Object} newCenter the new center of the map (lat, lng)
 * @param      {boolean} animate an optional flag to enable and disable animations when recentering
 * @return     {Object} the instance of jHERE for chainability
 */
JH.center = function(newCenter, animate){
    const self = this;
    runner.run(() => self.map.setCenter(newCenter, animate));
    return self;
};

/**
 * Sets the zoom level of the map
 *
 * @example
 * //Sets the zoom to 13 with animation
 * map.zoom(13, true)
 *
 * //Sets the zoom to 3 with animation
 * map.zoom(3, false)
 *
 * @param      {Number} newZoomLevel the zoom level
 * @param      {boolean} animate an optional flag to enable and disable animations when chaging zoom level
 * @return     {Object} the instance of jHERE for chainability
 */
JH.zoom = function(newZoomLevel, animate){
    const self = this;
    runner.run(() => self.map.setZoom(newZoomLevel, animate));
    return self;
};

/**
 * @param  {string}
 * @param  {string}
 * @return {Object} the instance of jHERE for chainability
 */
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
            /*!
            returns if there is an object at this pointer position: this means that the pointer
            event happened on an object (e.g. marker) and not on the map itself. For some reason the
            event seems to buuble up to the map, so thie prevents it.
            */
            return;
        }
        if(currentPointer) {
            /*! Add the geo-coordinate of the pointer */
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
/**
 * Adds a new marker to the map
 *
 * @example
 * //Creates a new simple marker
 * map.marker({lat: 52.1, lng: 13.23})
 *
 * @param  {Object} coord the coordinates where the marker will be added
 * @param  {Object} options options for the marker
 * @return {Object} the instance of jHERE for chainability
 */
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

/**
 * Removes all the markers from the map
 *
 * @example
 * map.nomarkers();
 *
 * @return {Object} the instance of jHERE for chainability
 */
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

/**
 * @ignore
 */
export default jHERE;
