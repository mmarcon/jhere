/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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
	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	__webpack_require__(1);

	var _modulesCore = __webpack_require__(2);

	var _modulesCore2 = _interopRequireDefault(_modulesCore);

	window.jHERE = _modulesCore2['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

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

	//Object.assign polyfill from
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	'use strict';

	if (!Object.assign) {
	    Object.defineProperty(Object, 'assign', {
	        enumerable: false,
	        configurable: true,
	        writable: true,
	        value: function value(target) {
	            'use strict';
	            if (target === undefined || target === null) {
	                throw new TypeError('Cannot convert first argument to object');
	            }

	            var to = Object(target);
	            for (var i = 1; i < arguments.length; i++) {
	                var nextSource = arguments[i];
	                if (nextSource === undefined || nextSource === null) {
	                    continue;
	                }
	                nextSource = Object(nextSource);

	                var keysArray = Object.keys(nextSource);
	                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	                    var nextKey = keysArray[nextIndex];
	                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	                    if (desc !== undefined && desc.enumerable) {
	                        to[nextKey] = nextSource[nextKey];
	                    }
	                }
	            }
	            return to;
	        }
	    });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _loader = __webpack_require__(3);

	var _loader2 = _interopRequireDefault(_loader);

	var _config = __webpack_require__(4);

	var config = _interopRequireWildcard(_config);

	var _utils = __webpack_require__(5);

	var d = document;

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
	 *                                                     center: {lat: 52.5, lng: 13.3
	 *                                                 }});
	 *
	 * @link https://developer.here.com/myapps
	 *
	 * @constructor
	 * @param      {Element} element DOM element where the map will be shown
	 * @param      {Object}  options options for the map
	 * @return     {Object} the instance of jHERE
	 */
	var jHERE = function jHERE(element, options) {
	    if (!(this instanceof jHERE)) {
	        return new jHERE(element, options);
	    }
	    this.el = element;
	    this.options = Object.assign({}, config.defaults, options);
	    this._init();
	};

	var JH = jHERE.prototype;

	var apiLoader = new _loader2['default']();
	var modules = config.modules.map(function (module) {
	    return config.url.replace('M', module);
	});
	var runner = new _utils.Runner();

	JH._init = function () {
	    var self = this;
	    var classList = self.el.classList;
	    /*! Using classList because dataset is not supported in IE10 */
	    if (classList.contains(config.lib)) {
	        return;
	    }
	    self.el.classList.add(config.lib);
	    runner.run(function () {
	        return self._makemap();
	    });
	    if (!apiLoader.started) {
	        apiLoader.require(modules, d.querySelector('script[src*="jhere"]'), function () {
	            return runner.start();
	        }).requireCss([config.uiCss]);
	    }
	};

	JH._makemap = function () {
	    var self = this;
	    var Behavior = H.mapevents.Behavior;
	    var enabled = self.options.enable;

	    self.platform = new H.service.Platform({
	        app_id: self.options.credentials.appId,
	        app_code: self.options.credentials.authToken,
	        useHTTPS: true
	    });
	    self.layers = self.platform.createDefaultLayers();
	    self.map = new H.Map(self.el, self.layers.normal.map, self.options);
	    self.ui = H.ui.UI.createDefault(self.map, self.layers);

	    if (! ~enabled.indexOf('zoombar')) {
	        self.ui.getControl('zoom').setVisibility(false);
	    }
	    if (! ~enabled.indexOf('scalebar')) {
	        self.ui.getControl('scalebar').setVisibility(false);
	    }
	    if (! ~enabled.indexOf('settings')) {
	        self.ui.getControl('mapsettings').setVisibility(false);
	    }

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
	JH.center = function (newCenter, animate) {
	    var self = this;
	    runner.run(function () {
	        return self.map.setCenter(newCenter, animate);
	    });
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
	JH.zoom = function (newZoomLevel, animate) {
	    var self = this;
	    runner.run(function () {
	        return self.map.setZoom(newZoomLevel, animate);
	    });
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
	JH.type = function (type, layer) {
	    var self = this;
	    type = type || 'normal';
	    layer = layer || 'map';
	    runner.run(function () {
	        return self.layers[type] && self.layers[type][layer] && self.map.setBaseLayer(self.layers[type][layer]);
	    });
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
	JH.on = function (event, callback) {
	    var self = this;
	    var _callback = function _callback(e) {
	        var currentPointer = e.currentPointer;
	        if (!!self.map.getObjectAt(currentPointer.viewportX, currentPointer.viewportY)) {
	            /*!
	            returns if there is an object at this pointer position: this means that the pointer
	            event happened on an object (e.g. marker) and not on the map itself. For some reason the
	            event seems to buuble up to the map, so thie prevents it.
	            */
	            return;
	        }
	        if (currentPointer) {
	            /*! Add the geo-coordinate of the pointer */
	            e.geo = self.map.screenToGeo(currentPointer.viewportX, currentPointer.viewportY);
	        }
	        callback.call(self, e);
	    };
	    runner.run(function () {
	        return self.map.addEventListener(event, _callback);
	    });
	    return self;
	};

	JH.off = function (event, callback) {
	    var self = this;
	    runner.run(function () {
	        return self.map.removeEventListener(event, callback, true, self);
	    });
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
	JH.marker = function (coords, options) {
	    options = options || {};
	    var self = this;
	    var _marker = function _marker() {
	        if (options.icon) {
	            options.crossOrigin = true;
	            options.icon = new H.map.Icon(options.icon, options);
	        }
	        var marker = new H.map.Marker(coords, options);
	        config.supportedEvents.forEach(function (eventName) {
	            if (options[eventName]) {
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
	JH.nomarkers = function () {
	    var self = this;
	    runner.run(function () {
	        return self.mc.removeAll();
	    });
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
	JH.bubble = function (coords, options) {
	    options = options || {};
	    var self = this;
	    var _bubble = function _bubble() {
	        if (options.only) {
	            self.nobubbles();
	        }
	        var infoBubble = new H.ui.InfoBubble(coords, options);
	        if ((0, _utils.isFn)(options.onclose)) {
	            infoBubble.addEventListener('statechange', function () {
	                return this.getState() === 'closed' && options.onclose.call(this);
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
	JH.nobubbles = function () {
	    var self = this;
	    var _nobubbles = function _nobubbles() {
	        self.ui.getBubbles().forEach(function (bubble) {
	            return bubble.close() && bubble.dipose();
	        });
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
	JH.originalMap = function (closure) {
	    var self = this;
	    runner.run(function () {
	        return closure.call(self, self.map, H);
	    });
	    return self;
	};

	jHERE.extend = function (name, fn) {
	    if (typeof name === 'string' && (0, _utils.isFn)(fn)) {
	        JH[name] = fn;
	    }
	};

	/**
	 * @ignore
	 */
	exports['default'] = jHERE;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

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

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var d = document;
	var Loader = function Loader() {};

	Loader.prototype = {
	    require: function require(scripts, target, callback) {
	        var self = this;
	        self.started = true;
	        self.loadCount = 0;
	        self.totalRequired = scripts.length;
	        self.target = target;
	        self.callback = callback;
	        scripts.forEach(function (s) {
	            return self.writeScript(s);
	        });
	        return self;
	    },
	    requireCss: function requireCss(css) {
	        var head = d.querySelector('head');
	        css.forEach(function (href) {
	            var link = d.createElement('link');
	            link.rel = 'stylesheet';
	            link.type = 'text/css';
	            link.href = href;
	            head.appendChild(link);
	        });
	        return this;
	    },
	    loaded: function loaded() {
	        this.loadCount++;
	        if (this.loadCount === this.totalRequired && typeof this.callback === 'function') {
	            this.callback.call();
	        }
	    },
	    writeScript: function writeScript(src) {
	        var self = this,
	            s = d.createElement('script');
	        s.async = false;
	        s.src = src;
	        s.onload = self.loaded.bind(self);
	        self.target.parentNode.insertBefore(s, self.target);
	    }
	};

	exports['default'] = Loader;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

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

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var lib = '_jHERE';
	exports.lib = lib;
	var url = 'https://js.api.here.com/v3/3.0/mapsjs-M.js';
	exports.url = url;
	var uiCss = url.replace('M.js', 'ui.css');
	exports.uiCss = uiCss;
	var modules = ['core', 'service', 'mapevents', 'ui'];
	exports.modules = modules;
	var defaultCredentials = {
	    appId: 'lPY5MGHzyXJTYJXt2Sog',
	    authToken: 'qUtXEMHxFTwoz_WeIKbLrA'
	};
	exports.defaultCredentials = defaultCredentials;
	var defaults = {
	    credentials: defaultCredentials,
	    zoom: 12,
	    center: { lat: 52.49, lng: 13.37 },
	    type: 'map',
	    enable: ['zoombar', 'scalebar', 'settings']
	};

	exports.defaults = defaults;
	var pointer = 'pointer';
	var tap = 'tap';
	var drag = 'drag';
	var start = 'start';
	var end = 'end';
	var move = 'move';

	var supportedEvents = [pointer + 'down', /*mousedown, touchstart, pointerdown*/
	pointer + 'up', /*mouseup, touchend, pointerup*/
	pointer + move, /*mousemove, touchmove, pointermove*/
	pointer + 'enter', /*mouseenter, touchenter, pointerenter*/
	pointer + 'leave', /*mouseleave, touchleave, pointerleave*/
	pointer + 'cancel', /*touchcancel, pointercancel*/
	drag + start, drag, drag + end, tap, /*click, tap*/
	'dbl' + tap, 'longpress'];
	exports.supportedEvents = supportedEvents;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.isFn = isFn;
	exports.Runner = Runner;

	function isFn(f) {
	    return typeof f === 'function';
	}

	function Runner() {
	    this._queue = [];
	    this._done = false;
	}

	Runner.prototype.run = function (task) {
	    if (this._done) {
	        return task();
	    }
	    this._queue.push(task);
	};

	Runner.prototype.start = function () {
	    var next;
	    while (next = this._queue.shift()) {
	        next();
	    }
	    this._done = true;
	};

/***/ }
/******/ ]);