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

`$('.selector').jHERE('route', from, to, routeOptions);`

`from` and `to` can be objects of type

`{latitude: -43, longitude: 55}`

or an array

`[-43, 55]`

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

	$.JHERE.geocode('Berlin, Germany',
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

	$.JHERE.reverseGeocode({latitude: 52.5, longitude: 13.3},
	                       function(address){
	                           //Do stuff with address
	                       },
	                       function(){/*error*/});`

jHERE exposes the possibility of reverse geocoding a position
into an address. This call is asynchronous
and supports a `success` and a `error` callback.
When jHERE is used with jQuery a $.Deferred object is also returned
and can be used instead of callbacks. For Zepto.JS a Deferred is also returned,
however note that it is a custom implementation that only supports the `done` method.