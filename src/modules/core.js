/* globals H: true */
import Loader from './loader';
import * as config from './config';
import {extend} from './utils';


const w = window;
// const d = document;

const constructor = w.jHERE = function jHERE(element, options){
    this.element = element;
    this.options = extend(config.defaults, options);
    this.init();
};

const JH = constructor.prototype;

JH.init = function(){
    const apiLoader = new Loader();
    const modules = config.modules.map(module => config.url.replace('M', module));
    apiLoader.require(modules, document.querySelector('script.test'), () => this.makemap());
};

JH.makemap = function(){
    var self = this;
    self.platform = new H.service.Platform({
        app_id: self.options.credentials.appId,
        app_code: self.options.credentials.authToken
    });
    self.layers = self.platform.createDefaultLayers();
    self.map = new H.Map(self.element, self.layers.normal.map, self.options);
};