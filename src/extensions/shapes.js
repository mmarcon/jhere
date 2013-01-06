/*
Copyright (c) 2013 Massimiliano Marcon, http://marcon.me

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
    var _ns, shape, circle, rectangle, polyline, polygon, shapeContainer;

    function normalize(position){
        return position instanceof Array ? {latitude: position[0], longitude: position[1]} : position;
    }

    /*
    Shapes:
        - nokia.maps.map.Circle => center (Coordinate object), radius in meters, properties
        - nokia.maps.map.Rectangle => bounds (BoundingBox object = {topLeft, bottomRight} ), properties
        - nokia.maps.map.PolyLine => array of points, properties
        - nokia.maps.map.Polygon => array of points, properties
    */

    function makeCircle(container, options) {
        container.objects.add(new _ns.map.Circle(normalize(options.center), options.radius || 1000, options.properties));
    }

    function makeRectangle(container, options) {
        var bb = new _ns.geo.BoundingBox(normalize(options.topLeft), normalize(options.bottomRight), false);
        container.objects.add(new _ns.map.Rectangle(bb, options.properties));
    }

    function makePolyline(container, options) {
        options.points = $.map(options.points, function(p){
            return normalize(p);
        });
        container.objects.add(new _ns.map.Polyline(options.points, options.properties));
    }

    function makePolygon(container, options) {
        options.points = $.map(options.points, function(p){
            return normalize(p);
        });
        container.objects.add(new _ns.map.Polygon(options.points, options.properties));
    }

    //### Draw shapes on the map
    //`$('.selector').jHERE('shape', 'circle', {center: position, radius: integer, properties: properties});`
    //`$('.selector').jHERE('shape', 'rectangle' {topLeft: position, bottomRight: position, properties: properties});`
    //`$('.selector').jHERE('shape', 'polyline', {points: array, properties: properties}));`
    //`$('.selector').jHERE('shape', 'polygon', {points: array, properties: properties});`
    shape = function(shape, options){
        _ns = _ns || nokia.maps;
        if(!shapeContainer) {
            shapeContainer = new _ns.map.Container();
            this.map.objects.add(shapeContainer);
        }
        switch(shape) {
            case 'circle':
                makeCircle(shapeContainer, options);
                break;
            case 'rectangle':
                makeRectangle(shapeContainer, options);
                break;
            case 'polyline':
                makePolyline(shapeContainer, options);
                break;
            case 'polygon':
                makePolygon(shapeContainer, options);
                break;
            default:
                $.error(shape + ' not supported');
        }
    };

    circle = function(options){
        shape.call(this, 'circle', options);
    };

    rectangle = function(options){
        shape.call(this, 'rectangle', options);
    };

    polyline = function(options){
        shape.call(this, 'polyline', options);
    };

    polygon = function(options){
        shape.call(this, 'polygon', options);
    };

    $.jHERE.extend('shape', shape);
    $.jHERE.extend('circle', circle);
    $.jHERE.extend('rectangle', rectangle);
    $.jHERE.extend('polyline', polyline);
    $.jHERE.extend('polygon', polygon);
}(jQuery));