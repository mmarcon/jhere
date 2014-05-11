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
    var _ns, route, _default = {
        type: 'shortest',
        transportMode: 'car',
        options: '',
        trafficMode: 'default',
        width: 4,
        color: '#ff6347',
        marker: {
            text: '#',
            textColor: '#fff'
        },
        zoomTo: true
    };

    function normalize(position){
        return position instanceof Array ? {latitude: position[0], longitude: position[1]} : position;
    }

    //### Calculate the route between 2 points
    //`$('.selector').jHERE('route', from, to, routeOptions);`
    //
    //`from` and `to` can be objects of type
    //
    //`{latitude: -43, longitude: 55}`
    //
    //or an array
    //
    //`[-43, 55]`
    //
    //`routeOptions` is optional and can be an object of type
    //<pre><code>{
    //  marker: {},
    //  type: 'shortest', //can be shortest, fastest, fastestNow, directDrive, scenic
    //  transportMode: 'car', //can be car, pedestrian, publicTransport, truck
    //  options: '', //can be avoidTollroad, avoidMotorway, avoidBoatFerry,
    //               //avoidRailFerry, avoidPublicTransport, avoidTunnel,
    //               //avoidDirtRoad, avoidPark, preferHOVLane, avoidStairs
    //  trafficMode: 'default', //can be enabled, disabled, default
    //  width: 4, //width in px of the route drawn on the map
    //  color: '#ff6347', //color of the route drawn on the map,
    //  onroute: function(route){} //optional callbacks that gets the list of maneuvers with some
    //                             //basic info, plus total time (seconds) and length (meters)
    //}</code></pre>
    //
    //Once route is calculated a jhere.route event is also triggered.
    //
    //`marker` is an object containing the same options used for
    //`$('.selector').jHERE('marker')`. Options apply to both start and destionation markers.
    route = function(from, to, via, options){
        var router, wp, done, cleanOptions;
        _ns = _ns || nokia.maps;
        from = normalize(from);
        to = normalize(to);

        //in this case options is the options object, like expected
        if( via instanceof Array ){
            options = $.extend({}, _default, options);
        }
        //in this case via is the options object, probably older implementation of plugin
        else {
            options = $.extend({}, _default, via);
            via = [];
        }
        /*Call me with the correct context!*/
        done = function(router, key, status) {
            var routes, routeContainer, poly, r, info = {}, evt;
            if (status === 'finished') {
                routes = router.getRoutes();
                r = routes[0];
                /*We want to customize the way a routeContainer is shown*/
                /*So we have to make a polyline first*/
                poly = new _ns.map.Polyline(r && r.shape, {
                    pen: new _ns.util.Pen({
                        lineWidth: options.width,
                        strokeColor: options.color
                    })
                });
                routeContainer = new _ns.map.Container();
                routeContainer.objects.add(poly);
                /*And add the markers next. For markers we use the corresponding jHERE method for now.*/
                $.each(r.waypoints, $.proxy(function(i, w){
                    var o = $.extend({}, options.marker);
                    if(options.marker.text === '#') {
                        o.text = i + 1;
                    }
                    this.marker(w.originalPosition, o);
                }, this));
                this.map.objects.add(routeContainer);
                /*Zoom map to bounds of route*/
                if(options.zoomTo){
                    this.map.zoomTo(routeContainer.getBoundingBox(), false, "default");
                }
                /*Now let's look into the route infos*/
                info.time = r.summary.travelTime;
                info.length = r.summary.distance;
                info.waypoints = r.waypoints;
                info.legs = r.legs;

                /*Fire callback if present*/
                if(typeof options.onroute === 'function') {
                    options.onroute.call(this.element, info);
                }
                /*And trigger event (jQuery only)*/
                evt = $.Event('jhere.route', {
                    route: info,
                    target: this.element
                });
                $(this.element).trigger(evt);
            } else if (status === 'failed') {
                $.error('Failed to calculate route');
            }
        };

        router = new _ns.routing.Manager();
        router.addObserver('state', $.proxy(done, this));

        wp = new _ns.routing.WaypointParameterList();
        wp.addCoordinate(from);
        $.each(via, function(i,item){
            wp.addCoordinate(normalize(item));
        });
        wp.addCoordinate(to);

        /*Fix for insanity*/
        cleanOptions = {
            transportModes: [options.transportMode],
            type: options.type,
            options: options.options,
            trafficMode: options.trafficMode
        };

        router.calculateRoute(wp, [cleanOptions]);
    };

    $.jHERE.extend('route', route);
}(jQuery));
