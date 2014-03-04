#jHERE Extensions

Extensions extend the behavior of jHERE. A minified version of each extension is available in the `dist/extensions` folder.

**Note** that to improve performance the plugin and the needed extensions should be combined in a single file. **Luckily for you this is now automated! Keep reading…**

##jHERE Custom Builder

With [jHERE Custom Builder](http://custom.jhere.net/) you can build a custom version of jHERE that contains only what you need, all concatenated together in a single file, minified and ready for production.

##Available extensions

###autoinit extension

When this extension is included a map is automatically initialized on ~~the first~~ each container with `id` or `class` `map`. Options are passed via data attributes as follows:

	<div id="map"
		  class="map"
		  data-center="40.664167,-73.838611"
		  data-zoom="8"
		  data-type="map">
	</div>
	
If `data-center` is an address, e.g. *Largo da Matriz de Nossa Senhora do Ó, 203, São Paulo, SP, Brazil*, the address will be geocoded in the attempt of obtaining the geographical coordinates where to center the map.
	
This extension packaged together with the plugin enables *HTML developers* to insert a map in their pages without having to write a single line of JavaScript.
 
###routing extension

When this extension is included it is possible to add routes to the map by simply doing the following:

`$('.selector').jHERE('route', from, to, via, routeOptions);`

`from` and `to` can be objects of type

`{latitude: -43, longitude: 55}`

or an array

`[-43, 55]`

`via` is optional and can be an array of coordinates of type
[[-43, 55], [52.33, 13.08]]

or

[{latitude: 52.33812, longitude: 13.08835}]

`routeOptions` is optional and can be an object of type

	{
	  marker: {},
	  type: 'shortest',          //can be shortest, fastest, fastestNow, directDrive, scenic
	  transportMode: 'car',      //can be car, pedestrian, publicTransport, truck
	  options: '',               //can be avoidTollroad, avoidMotorway, avoidBoatFerry,
	                             //avoidRailFerry, avoidPublicTransport, avoidTunnel,
	                             //avoidDirtRoad, avoidPark, preferHOVLane, avoidStairs
	  trafficMode: 'default',    //can be enabled, disabled, default
	  width: 4,                  //width in px of the route drawn on the map
	  color: '#ff6347',          //color of the route drawn on the map
	  zoomTo: false,             //will disable zooming to bounds of calculated route
	  onroute: function(route){} //optional callbacks that gets the list of maneuvers with some
                                 //basic info, plus total time (seconds) and length (meters)
	}

`marker` is an object containing the same options used for
`$('.selector').jHERE('marker')`. Options apply to both start and destionation markers.

For jQuery a `jhere.route` event is also triggered, which can be caught with `on` on the map element. With Zepto the call to `trigger` seems to be ignored.

**DEMO:** a demo of the routing extension is available [here](http://bin.jhere.net/4134408).

### geocode extension

By including this extension it is possible to do very easily geocoding and reverse geocoding operations.

#### Geocode

	$.jHERE.geocode('Berlin, Germany',
	                function(position){
	                    //Do stuff with position
	                },
	                function(){/*error*/});

jHERE exposes the possibility of geocoding an address
into (latitude, longitude). This call is asynchronous
and supports a `success` and a `error` callback.
When jHERE is used with jQuery a $.Deferred object is also returned
and can be used instead of callbacks. For Zepto.JS a Deferred is also returned,
however note that it is a custom implementation that only supports the `done` method.

#### Reverse Geocode

	$.jHERE.reverseGeocode({latitude: 52.5, longitude: 13.3},
	                       function(address){
	                           //Do stuff with address
	                       },
	                       function(){/*error*/});

jHERE exposes the possibility of reverse geocoding a position
into an address. This call is asynchronous
and supports a `success` and a `error` callback.
When jHERE is used with jQuery a $.Deferred object is also returned
and can be used instead of callbacks. For Zepto.JS a Deferred is also returned,
however note that it is a custom implementation that only supports the `done` method.

### shapes extension

With the shapes extension it is possible to draw circles, rectangles, polylines and polygons on the map canvas.

The syntax is the following:

	$('.selector').jHERE('shape', 'circle', {center: position, radius: integer, style: object});
	/*or*/ $('.selector').jHERE('circle', {center: position, radius: integer, style: object});
	
	$('.selector').jHERE('shape', 'rectangle' {topLeft: position, bottomRight: position, style: object});
	/*or*/ $('.selector').jHERE('rectangle' {topLeft: position, bottomRight: position, style: object});
    
	$('.selector').jHERE('shape', 'polyline', {points: array, style: object}));
	/*or*/ $('.selector').jHERE('polyline', {points: array, style: object}));

	$('.selector').jHERE('shape', 'polygon', {points: array, style: object});
	/*or*/ $('.selector').jHERE('polygon', {points: array, style: object});
	
`style` is always an object that defines the way the shape looks. Can be specified as in the JSLA API (pen, brush, see [here](http://developer.here.net/apiexplorer/index.html#examples/js/shapes/map-with-shapes/)) or in a simpler way as follows:

	{
		stroke: "#CC0000FF", //RGBA
		fill: "#000000AA", //RGBA
		thickness: 1 //px
	}
	
### markers extension

Extends the marker-related functionalities of the jHERE core by adding support for group of markers.

It adds support for the `group` option for a marker. Groups can be then hidden or shown with a call to

	$('.selector').jHERE(['group0', 'group1'], true);

First parameter is a group name (`String`) or an `Array` of group names. Second parameter is a `boolean`, for visible (`true`) or not visible (`false`).

This extansion is useful when it is necessary to categorize (i.e. group) markers and enable the capability of showing/hiding certain categories of markers.

	//Stupid example: show all Burger Kings and hide all the Mc Donalds
	$('.map').jHERE('markergroups', 'b-king', true).jHERE('markergroups', 'mc-donald', false);

### clustering extension

Exposes markers clustering for better data visualuzation. When your maps get crowded with markers, this is the extension for you.

	var data = [
		{
		  "name":"Name of the place",
		  "longitude": 20.17920,
		  "latitude": 59.96930
		}
		//,many other points here
	];
	
	 $('#map').jHERE('cluster', data);

To get rid of the clusters:

	$('#map').jHERE('nocluster', data);
	
### customize extension

Allows to customize particular aspects of the map.

    $('.selector').jHERE('customize', options);
    
Supported options are currently the following:

    {
      bubble: {
        backgroundColor: '#ffffff',
        color: '#111111',
        autoClose: false /*Should bubbles be autoclosed when a new one is open?*/
      }
    }