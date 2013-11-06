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
    var _ns, shape, clearShapes, circle, rectangle, polyline, polygon, shapeContainer;

    function normalize(position){
        return position instanceof Array ? {latitude: position[0], longitude: position[1]} : position;
    }

    function mapProperties(style){
        if(!style) {
            return style;
        }
        style.pen = style.pen || {};
        style.brush = style.brush || {};
        style.pen.strokeColor = style.pen.strokeColor || style.stroke || '#111';
        /*
            I don't see why this should influence at all since it's not part of the pen
            object, but whatever, this fixes it:
        */
        style.stroke = 'solid';
        style.pen.lineWidth = style.pen.lineWidth || style.thickness || 1;
        style.brush.color = style.brush.color || style.fill;
        return style;
    }

    /*
    Shapes:
        - nokia.maps.map.Circle => center (Coordinate object), radius in meters, properties
        - nokia.maps.map.Rectangle => bounds (BoundingBox object = {topLeft, bottomRight} ), properties
        - nokia.maps.map.PolyLine => array of points, properties
        - nokia.maps.map.Polygon => array of points, properties
    */

    function makeCircle(container, options) {
        container.objects.add(new _ns.map.Circle(normalize(options.center), options.radius || 1000, options.style));
    }

    function makeRectangle(container, options) {
        var bb = new _ns.geo.BoundingBox(normalize(options.topLeft), normalize(options.bottomRight), false);
        container.objects.add(new _ns.map.Rectangle(bb, options.style));
    }

    function makePolyline(container, options) {
        options.points = $.map(options.points, function(p){
            return normalize(p);
        });
        container.objects.add(new _ns.map.Polyline(options.points, options.style));
    }

    function makePolygon(container, options) {
        options.points = $.map(options.points, function(p){
            return normalize(p);
        });
        container.objects.add(new _ns.map.Polygon(options.points, options.style));
    }

    //### Draw shapes on the map
    //`$('.selector').jHERE('shape', 'circle', {center: position, radius: integer, style: object});`
    //`$('.selector').jHERE('shape', 'rectangle' {topLeft: position, bottomRight: position, style: object});`
    //`$('.selector').jHERE('shape', 'polyline', {points: array, style: object}));`
    //`$('.selector').jHERE('shape', 'polygon', {points: array, style: object});`
    //
    //`style` is always an object that defines the way the shape looks. Can be specified as
    //in the JSLA API (pen, brush, see [here](http://developer.here.net/apiexplorer/index.html#examples/js/shapes/map-with-shapes/))
    //or in a simpler way as follows:
    //<pre><code>{
    //  stroke: "#CC0000FF", //RGBA
    //  fill: "#000000AA", //RGBA
    //  thickness: 1 //px
    //}</code></pre>
    shape = function(shape, options){
        _ns = _ns || nokia.maps;
        if(!shapeContainer) {
            shapeContainer = new _ns.map.Container();
            this.map.objects.add(shapeContainer);
        }
        options.style = mapProperties(options.style);
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
    
    //###Clear all shapes from the map
    clearShapes = function() {
        if (shapeContainer && shapeContainer.objects) {
            shapeContainer.objects.clear();
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
    $.jHERE.extend('clearShapes', clearShapes);
    $.jHERE.extend('circle', circle);
    $.jHERE.extend('rectangle', rectangle);
    $.jHERE.extend('polyline', polyline);
    $.jHERE.extend('polygon', polygon);
}(jQuery));
