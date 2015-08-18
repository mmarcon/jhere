/* globals H: true */
require("babel/polyfill");

import Loader from './loader';
import * as config from './config';
import {extend} from './utils';

new Promise();


const w = window;
const d = document;

const constructor = w.jHERE = function jHERE(element, options){
    this.el = element;
    this.options = extend(config.defaults, options);
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
    apiLoader.require(modules, d.querySelector('script[src*="jhere"]'), () => self._makemap());
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
    this.map.setCenter(newCenter, animate);
    return this;
};