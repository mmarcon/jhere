/*
Copyright (c) 2012 Massimiliano Marcon, http://marcon.me

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
;(function($){
    var _ns, marker, M, _default = {
        marker: {
            text: '',
            textColor: '#333333',
            fill: '#ff6347',
            stroke: '#333333',
            shape: 'balloon',
            icon: null,
            group: null
        }
    };

    /*http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery*/
    function hashCode(string){
        var hash = 0, i, char;
        string = string + '';
        if (string.length === 0){
            return hash;
        }
        for (i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash<<5)-hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    function jHEREMarker(jslaMarker, config){
        this.marker = jslaMarker;
        this.selected = false;
        this.listeners = {};
        this.element = config.element;
        this.map = config.map;
    }

    M = jHEREMarker.prototype;


    /*click, dblclick, mousemove, mouseover, mouseout, mouseenter, mouseleave, longpress*/
    M.on = function(event, callback){
        var _callback, b;
        if(!this.listeners[event]) {
            this.listeners[event] = {};
        }
        _callback = function(event){
            var e = $.Event(event.type, {
                originalEvent: event,
                geo: {
                    latitude: event.target.coordinate.latitude,
                    longitude: event.target.coordinate.longitude
                },
                target: event.target
            });
            /*
             When the event listener is called then
             the context is the DOM element containing the map.
            */
            callback.call(this.element, e);
        };
        b = $.proxy(_callback, this);
        this.listeners[event][''+hashCode(callback)] = b;
        this.marker.addListener(event, b);
    };

    M.off = function(event, callback){
        var l = this.listeners;
        if(!callback) {
            /*Then remove all*/
            $.each(l[event], function(k, c){
                this.marker.removeListener(event, c);
            });
            return;
        }
        this.marker.removeListener(event, l[event][''+hashCode(callback)]);
    };

    M.remove = function(){

    };

    /*
        Feautures:
        - refence to marker
        - markers on new container
        - groupable markers (new container for group)
        - remove marker
        - select marker
        - draggable marker
    */

    marker = function(position, markerOptions, closure) {
        var marker;

        markerOptions = $.extend({}, _default.marker, markerOptions);
        /*Normalize settings*/
        markerOptions.textPen = markerOptions.textPen || {strokeColor: markerOptions.textColor};
        markerOptions.pen = markerOptions.pen || {strokeColor: markerOptions.stroke};
        markerOptions.brush = markerOptions.brush || {color: markerOptions.fill};
        markerOptions.eventListener = markerListeners;

        if (markerOptions.icon) {
            marker = new jHEREMarker(new _ns.map.Marker(position, markerOptions));
        } else {
            marker = new jHEREMarker(new _ns.map.StandardMarker(position, markerOptions));
        }

        closure.call(this.element, marker);
    };

    function triggerEvent(event) {
        var handler = event.target[event.type];
        if (isFunction(handler)) {
            var e = $.Event(event.type, {
                originalEvent: event,
                geo: {
                    latitude: event.target.coordinate.latitude,
                    longitude: event.target.coordinate.longitude
                },
                target: event.target
            });
            /*
             When the event listener is called then
             the context is the DOM element containing the map.
            */
            handler.call(this.element, e);
        }
    }

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    $.jHERE.extend('marker', marker);
}(jQuery));