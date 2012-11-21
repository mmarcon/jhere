;(function($){
    var _ns, route, _default = {
        type: "shortest",
        transportModes: ["car"],
        options: "",
        trafficMode: "default"
    };

    /*Call me with the correct context!*/
    function done(router, key, status) {
        var routes, route;
        if (status == "finished") {
            routes = router.getRoutes();
            route = new _ns.routing.component.RouteResultSet(routes[0]).container;
            this.map.objects.add(route);
        } else if (status == "failed") {
            $.error("Failed to calcolate route");
        }
    }

    route = function(from, to, options){
        var router, wp;
        _ns = _ns || nokia.maps;
        options = $.extend({}, _default, options);

        router = new _ns.routing.Manager();
        router.addObserver(function(){console.log('hello')});

        wp = new _ns.routing.WaypointParameterList();
        wp.addCoordinate(from);
        wp.addCoordinate(to);

        router.calculateRoute(wp, [_default]);
    };

    $.jHERE.extend('route', route);
}(jQuery));