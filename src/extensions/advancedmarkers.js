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
            this.visible = false;
        }
    };

    G.show = function(){
        if(!this.visible) {
            this.map.objects.add(this.container);
            this.visible = true;
        }
    };

    G.toggle = function(){
        if(this.visible) {
            return this.hide();
        }
        this.show();
    };

    G.zoomTo = function(){
        this.map.zoomTo(this.container.getBoundingBox());
    };

    $.jHERE.getMarkersGroup = function(group, callback){
        var returnableGroup;
        $.jHERE.ready(function(){
            group = group || UNGROUPED;
            returnableGroup = groups[group];
            if(isFunction(callback)) {
                callback.call(returnableGroup, returnableGroup);
            }
        });
        return returnableGroup;
    };

    function jHEREMarker(jslaMarker, config){
        this.marker = jslaMarker;
        this.selected = false;
        this.listeners = {};
        this.element = config.element;
        this.map = config.map;
        this.group = config.group;
        this.config = config;
    }

    M = jHEREMarker.prototype;


    function normalizeDragEvent(evt) {
        var mapDragType = evt.dataTransfer.getData("application/map-drag-type"),
            marker = this.marker, offset;

        if (mapDragType.match(/marker/i)) {
            // Get the offset of the mouse relative to the top-left corner of the marker.
            offset = evt.dataTransfer.getData("application/map-drag-object-offset");

            /* Calculate the current coordinate of the marker, so substract the offset from the
             * current displayX/Y position to get the top-left position of the marker and then
             * add the anchor to get the pixel position of the anchor of the marker and then
             * query for the coordinate of that pixel position
             */
            evt.drag = this.map.pixelToGeo(evt.displayX - offset.x + marker.anchor.x, evt.displayY - offset.y + marker.anchor.y);
        }
        return evt;
    }

    /*click, dblclick, mousemove, mouseover, mouseout, mouseenter, mouseleave, longpress*/
    M.on = function(event, callback){
        var _callback, b;
        if(!this.listeners[event]) {
            this.listeners[event] = {};
        }
        _callback = function(event){
            if(event.type && event.type.match(/drag/i)) {
                event = normalizeDragEvent.call(this, event);
            }
            var e = $.Event(event.type, {
                originalEvent: event,
                geo: {
                    latitude: this.marker.coordinate.latitude,
                    longitude: this.marker.coordinate.longitude
                },
                drag: event.drag,
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

    function trigger(eventName) {
        if(!this.listeners[eventName]) {
            return;
        }
        var marker = this, e = $.Event(eventName, {
            geo: this.marker.coordinate
        });
        $.each(this.listeners[eventName], function(k, f){
            f.call(marker, e);
        });
    }

    M.remove = function(){
        groups[this.group.name].container.objects.remove(this.marker);
        trigger.call(this, 'removed');
    };

    M.add = function(){
        groups[this.group.name].container.objects.add(this.marker);
        trigger.call(this, 'added');
    };

    function setColor(color){
        this.marker.set('brush', {color: color});
    }

    function setIcon(icon){
        this.marker.set('icon', icon);
    }

    M.select = function(){
        this.selected = true;
        if(this.config.icon) {
            return setIcon.call(this, this.config.selectedIcon || this.config.icon);
        }
        setColor.call(this, this.config.selectedFill || this.config.fill);
    };

    M.deselect = function(){
        this.selected = false;
        if(this.config.icon) {
            return setIcon.call(this, this.config.icon);
        }
        setColor.call(this, this.config.fill);
    };

    M.toggleSelection = function(){
        if(this.selected) {
            return this.deselect();
        }
        this.select();
    };

    function init(){
        if(_ns) {
            return;
        }
        _ns = nokia.maps;
    }

    //### Add markers to the map (Replaces default markers API)
    //`$('.selector').jHERE('marker', positionObject, markerOptions, closure);`
    //
    //`positionObject` can be an object of type
    //
    //`{latitude: -43, longitude: 55}`
    //
    //or an array
    //
    //`[-43, 55]`
    //
    //`markerOptions` can be an object of type
    //<pre><code>{
    //  text: '!',
    //  textColor: '#333333',
    //  fill: '#ff6347',
    //  stroke: '#333333',
    //  icon: 'urlToIcon',
    //  anchor: {x: 12, y: 18} //an icon 24x36 would result centered
    //  click: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  dblclick: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  mousemove: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  mouseover: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  mouseout: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  mouseenter: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  mouseleave: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  longpress: function(event){/*this is the marker, event.geo contains the coordinates*/},
    //  drag: function(event){/*this is the marker, event.geo contains the original coordinates of the marker, event.drag contains the current coordinates*/},
    //  dragend: function(event){/*this is the marker, event.geo contains the original coordinates of the marker, event.drag contains the current coordinates*/},
    //  group: 'mygroup' //a group the marker is assigned to. By default markers are ungrouped.
    //}</code></pre>
    //`closure` should look like this:
    //<pre><code>function(marker, group){
    //    //this is the DOM element
    //    //marker is a jHEREMarker object
    //    //group is a jHEREMarkerGroup object
    //}</code></pre>
    marker = function(position, markerOptions, closure) {
        var marker;

        init();
        if($.isFunction(markerOptions)) {
            closure = markerOptions;
            markerOptions = {};
        }
        closure = closure || $.noop;

        markerOptions = $.extend({}, _default.marker, markerOptions);
        /*Normalize settings*/
        markerOptions.textPen = markerOptions.textPen || {strokeColor: markerOptions.textColor};
        markerOptions.pen = markerOptions.pen || {strokeColor: markerOptions.stroke};
        markerOptions.brush = markerOptions.brush || {color: markerOptions.fill};

        /*Create group if not existing already*/
        if(!groups[markerOptions.group]){
            groups[markerOptions.group] = new jHEREMarkerGroup(new _ns.map.Container(), markerOptions.group, this.map);
            this.map.objects.add(groups[markerOptions.group].container);
        }
        markerOptions.group = groups[markerOptions.group];
        markerOptions.map = this.map;

        if (markerOptions.icon) {
            marker = new jHEREMarker(new _ns.map.Marker(position, markerOptions), markerOptions);
        } else {
            marker = new jHEREMarker(new _ns.map.StandardMarker(position, markerOptions), markerOptions);
        }

        marker.add();
        closure.call(this.element, marker, marker.group);
    };

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    $.jHERE.extend('marker', marker);
}(jQuery));