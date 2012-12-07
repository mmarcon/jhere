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
    var UNGROUPED = 'ungrouped',
        _ns, marker, M, G, _default = {
        marker: {
            text: '',
            textColor: '#333333',
            fill: '#ff6347',
            stroke: '#333333',
            shape: 'balloon',
            icon: undefined,
            group: UNGROUPED
        }
    },
    groups = {};



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

    function jHEREMarkerGroup(jslaContainer, name, map){
        this.container = jslaContainer;
        this.name = name;
        this.map = map;
        this.markers = [];
        this.visible = true;
    }

    G = jHEREMarkerGroup.prototype;

    G.addMarker = function(marker){
        this.markers.push(marker);
    };

    G.hide = function(){
        if(this.visible) {
            this.map.objects.remove(this.container);
        }
    };

    G.show = function(){
        if(!this.visible) {
            this.map.objects.show(this.container);
        }
    };

    jHEREMarkerGroup.getGroup = function(group){
        group = group || UNGROUPED;
        return groups[group];
    };

    function jHEREMarker(jslaMarker, config){
        this.marker = jslaMarker;
        this.selected = false;
        this.listeners = {};
        this.element = config.element;
        this.map = config.map;
        this.group = config.group;
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
             the context is the marker.
            */
            callback.call(this, e);
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
        this.marker.removeListener(event, l[event]['' + hashCode(callback)]);
    };

    M.remove = function(){
        groups[this.group].objects.remove(this.marker);
    };

    M.add = function(){
        groups[this.group].objects.add(this.marker);
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

    function init(){
        if(_ns) {
            return;
        }
        _ns = nokia.maps;
    }

    marker = function(position, markerOptions, closure) {
        var marker;

        init();
        if($.isFunction(markerOptions)) {
            closure = markerOptions;
            markerOptions = {};
        }

        markerOptions = $.extend({}, _default.marker, markerOptions);
        /*Normalize settings*/
        markerOptions.textPen = markerOptions.textPen || {strokeColor: markerOptions.textColor};
        markerOptions.pen = markerOptions.pen || {strokeColor: markerOptions.stroke};
        markerOptions.brush = markerOptions.brush || {color: markerOptions.fill};

        /*Create group if not existing already*/
        if(!groups[markerOptions.group]){
            groups[markerOptions.group] = new jHEREMarkerGroup(_ns.map.Container(), markerOptions.group, this.map);
            this.map.objects.add(groups[markerOptions.group].container);
            markerOptions.group = groups[markerOptions.group];
        }

        if (markerOptions.icon) {
            marker = new jHEREMarker(new _ns.map.Marker(position, markerOptions), markerOptions);
        } else {
            marker = new jHEREMarker(new _ns.map.StandardMarker(position, markerOptions), markerOptions);
        }

        marker.add();
        closure.call(this.element, marker);
    };

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    $.jHERE.extend('marker', marker);
}(jQuery));