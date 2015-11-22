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

import Loader from './loader';
import * as config from './config';
import {isFn, Runner} from './utils';

const d = document;

/**
 * Creates an instance of jHERE. The "new" is not required.
 *
 * @example
 * //Create an app at https://developer.here.com/myapps
 * //to get your app_id and app_code
 * var map = jHERE(document.querySelector('#map'), {
 *                                                     app_id: 'your_app_id',
 *                                                     app_code: 'your_app_code'
 *                                                     zoom: 14,
 *                                                     center: {lat: 52.5, lng: 13.3,
 *                                                     enable: ['zoombar', 'scalebar', 'settings', 'behavior']
 *                                                 }});
 *
 * @link https://developer.here.com/myapps
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
    this.options = Object.assign({}, config.defaults, options);
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
    const enabled = self.options.enable;

    self.platform = new H.service.Platform({
        app_id: self.options.credentials.appId,
        app_code: self.options.credentials.authToken,
        useHTTPS: true
    });
    self.layers = self.platform.createDefaultLayers();
    self.map = new H.Map(self.el, self.layers.normal.map, self.options);
    self.ui = H.ui.UI.createDefault(self.map, self.layers);

    if(!~enabled.indexOf('zoombar')) {
        self.ui.getControl('zoom').setVisibility(false);
    }
    if(!~enabled.indexOf('scalebar')) {
        self.ui.getControl('scalebar').setVisibility(false);
    }
    if(!~enabled.indexOf('settings')) {
        self.ui.getControl('mapsettings').setVisibility(false);
    }
    if(~enabled.indexOf('behavior')) {
        //TODO: consider more granulr control over behavior
        //{enabled: Behavior.DRAGGING | Behavior.WHEELZOOM | Behavior.DBLTAPZOOM}
        new Behavior(new H.mapevents.MapEvents(self.map));
    }

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
 * Sets the type for the map. Determines what type of map
 * tiles are used.
 *
 * @link https://developer.here.com/javascript-apis/documentation/v3/maps/topics/map-types.html
 *
 * @example
 * //Sets the map type to terrain
 * //uses the default map layer (roads, labels, etc.)
 * map.type('terrain')
 *
 * //Sets the map type to normal map
 * //uses a very basic layer with no roads an no labels
 * map.type('normal', 'xbase')
 *
 * @param  {string} type the map type (normal, satellite, terrain)
 * @param  {string} layer (map, traffic, transit, xbase, base, labels)
 * @return {Object} the instance of jHERE for chainability
 */
JH.type = function(type, layer){
    const self = this;
    type = type || 'normal';
    layer = layer || 'map';
    runner.run(() => self.layers[type] && self.layers[type][layer] && self.map.setBaseLayer(self.layers[type][layer]));
    return self;
};

/**
 * Attaches event listeners to the map.
 *
 * @example
 *
 * //Logs latitude and longitude of a tap event
 * map.on('tap', function(e){
 *     console.log(e.geo);
 * });
 *
 * @param  {String}   event    the event name. Supported events are:
 * mousedown, touchstart, pointerdown, mouseup, touchend, pointerup,
 * mousemove, touchmove, pointermove, mouseenter, touchenter, pointerenter,
 * mouseleave, touchleave, pointerleave, touchcancel, pointercancel,
 * dragstart. dragend, drag, tap (covers click and tap), dbltab (covers also dblclick),
 * longpress
 * @param  {Function} callback invoked when a map event is triggered. The callback is passed the
 * event object extended with a `geo` property that contains latitude and longitude of the pointer
 * triggering the event.
 * @return {Object} the instance of jHERE for chainability
 */
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

/**
 * Adds an info bubble to the map at the given coordinates
 *
 *  @param  {Object} coord the coordinates where the marker will be added
 * @param  {Object} options options for the info bubble
 *
 * @example
 * var options = {
 *     content: 'foo',
 *     onclose: function(){
 *         //Called when the info bubble is closed
 *     },
 *     //Specifies that the current info bubble
 *     //is the only one present on the map.
 *     //Useful when only one info bubble should be
 *     //open at any given time
 *     only: true
 * }
 * map.bubble({lat: 52.5, lng: 13.3}, options);
 *
 * @return {Object} the instance of jHERE for chainability
 */
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

/**
 * Removes all the info bubbles from the map
 *
 * @example
 * map.nobubbles();
 *
 * @return {Object} the instance of jHERE for chainability
 */
JH.nobubbles = function(){
    const self = this;
    const _nobubbles = function(){
        self.ui.getBubbles().forEach((bubble) => (bubble.close() && bubble.dipose()));
    };
    runner.run(_nobubbles);
    return self;
};

/**
 * Returns a reference to the original map object
 *
 * @example
 * map.originalMap(function(map, H){
 *     //map is the instance of the H.Map object that represents the map
 *     //H is the main namespace of the HERE Maps API
 * });
 *
 * @param  {Function} closure a callback function to which the original map
 *                    and the H namespace is passed
 *
 * @return {Object} the instance of jHERE for chainability
 *
 */
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
