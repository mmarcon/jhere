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
    var _ns, marker, nomarkers,
        markergroups, zoomToMarkers,
        _defaults = {
            text: '',
            textColor: '#333333',
            fill: '#ff6347',
            stroke: '#333333',
            shape: 'balloon',
            icon: undefined,
            group: '_'
    }, bind = $.proxy,
        /*Map and marker supported events*/
        mouse = 'mouse', click = 'click', drag = 'drag', touch = 'touch', start = 'start', end = 'end', move = 'move',
        supportedEvents = [
            click,
            'dbl' + click,
            mouse + 'up',
            mouse + 'down',
            mouse + move,
            mouse + 'over',
            mouse + 'out',
            mouse + 'enter',
            mouse + 'leave',
            'longpress',
            drag + start,
            drag,
            drag + end,
            'resize',
            touch + start,
            touch + end,
            touch + move
        ];

    //### Add markers to the map
    //`$('.selector').jHERE('marker', positionObject, markerOptions);`
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
    //  click: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  dblclick: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  mousemove: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  mouseover: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  mouseout: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  mouseenter: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  mouseleave: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  longpress: function(event){/*this is the element, event.geo contains the coordinates*/},
    //  group: 'restaurants'
    //}</code></pre>
    //All parameters are **optional**.
    marker = function(position, markerOptions) {
        var markerListeners = {},
            centralizedHandler = bind(triggerEvent, this),
            mc = this._mc,
            MarkerConstructor = 'Marker',
            marker, groups;
        this.groups = this.groups || {};
        groups = this.groups;
        _ns = _ns || nokia.maps;
        $.each(supportedEvents, function(i, v){
            markerListeners[v] = [centralizedHandler, false, null];
        });

        markerOptions = $.extend({}, _defaults, markerOptions);
        /*Normalize settings*/
        markerOptions.textPen = markerOptions.textPen || {strokeColor: markerOptions.textColor};
        markerOptions.pen = markerOptions.pen || {strokeColor: markerOptions.stroke};
        markerOptions.brush = markerOptions.brush || {color: markerOptions.fill};
        markerOptions.eventListener = markerListeners;

        if (!markerOptions.icon) {
            MarkerConstructor = 'Standard' + MarkerConstructor;
        }

        marker = new _ns.map[MarkerConstructor](position, markerOptions);
        groups[markerOptions.group] = groups[markerOptions.group] || [];
        /*
         If the group has just been created, make it visible,
         if not leave the visibility as it is
        */
        groups[markerOptions.group].visible = groups[markerOptions.group].length === 0 ? true : groups[markerOptions.group].visible;
        groups[markerOptions.group].push(marker);

        /*Only add the marker to the map when its group is visible*/
        if(groups[markerOptions.group].visible) {
            mc.objects.add(marker);
        }
    };

    //### Show/hides group of markers
    //`$('.selector').jHERE(['group0', 'group1'], true);`
    //
    //First parameter is a group name (String) or an Array of
    //group names.
    //Second parameter is a boolean, for visible (`true`) or not visible (`false`).
    markergroups = function(targetgroups, visible) {
        var mc = this._mc, objs = mc.objects, groups;
        this.groups = this.groups || {};
        groups = this.groups;
        targetgroups = (targetgroups instanceof Array ? targetgroups : [targetgroups]);
        $.each(targetgroups, function(i, g){
            if(visible) {
                objs.addAll(groups[g] || []);
            }
            else {
                objs.removeAll(groups[g] || []);
            }
            groups[g].visible = !!visible;
        });
    };

    //### Remove all the markers from the map
    //`$('.selector').jHERE('nomarkers');`
    nomarkers = function(){
        this._mc.objects.clear();
        this.groups = {};
    };

    //### ZoomToMarkers extent on the map
    //`$('.selector').jHERE('zoomToMarkers', keepCenter);`
    //
    //`keepCenter` is a boolean whether the center should be kept, defaults to false
    zoomToMarkers = function(keepCenter){
        if(this._mc.objects.getLength() > 1) {
            var bbox = this._mc.getBoundingBox();
            this.map.zoomTo(bbox, keepCenter || false);
        }
    };

    /*
     Following is copy-pasted from jhere.js, but I can't
     see another way of doing this without exposing this stuff that
     is supposed to be private
     */

    function triggerEvent(event) {
        var target = event.target, handler = target[event.type];
        if (isFunction(handler)) {
            /*
             When the event listener is called then
             the context is the DOM element containing the map.
            */
            handler.call(this.element, makeGeoEvent(event, target.coordinate));
        }
    }

    /*
     *********************************************
     *********************************************
    */

    function makeGeoEvent(event, position) {
        return $.Event(event.type, {
            originalEvent: event,
            geo: {
                latitude: position.latitude,
                longitude: position.longitude
            },
            target: event.target
        });
    }

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    $.jHERE.extend('marker', marker);
    $.jHERE.extend('markergroups', markergroups);
    $.jHERE.extend('nomarkers', nomarkers);
    $.jHERE.extend('zoomToMarkers', zoomToMarkers);
}(jQuery));