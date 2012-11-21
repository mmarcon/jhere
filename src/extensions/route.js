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
        }
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
    //  color: '#ff6347' //color of the route drawn on the map
    //}</code></pre>
    //
    //`marker` is an object containing the same options used for
    //`$('.selector').jHERE('marker'). Options apply to both start and destionation markers.
    route = function(from, to, options){
        var router, wp, done;
        _ns = _ns || nokia.maps;
        from = normalize(from);
        to = normalize(to);
        options = $.extend({}, _default, options);

        /*Call me with the correct context!*/
        done = function(router, key, status) {
            var routes, routeContainer, poly, r;
            if (status == 'finished') {
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
            } else if (status == 'failed') {
                $.error('Failed to calcolate route');
            }
        };

        router = new _ns.routing.Manager();
        router.addObserver('state', $.proxy(done, this));

        wp = new _ns.routing.WaypointParameterList();
        wp.addCoordinate(from);
        wp.addCoordinate(to);

        options.transportModes = [options.transportMode];
        router.calculateRoute(wp, [options]);
    };

    $.jHERE.extend('route', route);
}(jQuery));