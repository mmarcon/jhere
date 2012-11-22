#jHERE Extensions

Extensions extend the behavior of jHERE. A minified version of each extension is available in the `dist/extensions` folder.

**Note** that to improve performance the plugin and the needed extensions should be combined in a single file.

	<div id="map"
		  class="map"
		  data-center="40.664167,-73.838611"
		  data-zoom="8"
		  data-type="map">
	</div>

##Available extensions

###autoinit extension

When this extension is included a map is automatically initialized on a container with `id` or `class` `map`. Options are passed via data attributes as follows:

	<div id="map"
		  class="map"
		  data-center="40.664167,-73.838611"
		  data-zoom="8"
		  data-type="map">
	</div>
	
This extension packaged together with the plugin enables *HTML developers* to insert a map in their pages without having to write a single line of JavaScript.
 
###routing extension

When this extension is include it is possible to add routes to the map by simply doing the following:

`$('.selector').jHERE('route', from, to, routeOptions);`

`from` and `to` can be objects of type

`{latitude: -43, longitude: 55}`

or an array

`[-43, 55]`

`routeOptions` is optional and can be an object of type

	{
	  marker: {},
	  type: 'shortest',       //can be shortest, fastest, fastestNow, directDrive, scenic
	  transportMode: 'car',   //can be car, pedestrian, publicTransport, truck
	  options: '',            //can be avoidTollroad, avoidMotorway, avoidBoatFerry,
	                          //avoidRailFerry, avoidPublicTransport, avoidTunnel,
	                          //avoidDirtRoad, avoidPark, preferHOVLane, avoidStairs
	  trafficMode: 'default', //can be enabled, disabled, default
	  width: 4,               //width in px of the route drawn on the map
	  color: '#ff6347'        //color of the route drawn on the map
	}

`marker` is an object containing the same options used for
`$('.selector').jHERE('marker')`. Options apply to both start and destionation markers.

**DEMO:** a demo of the routing extension is available [here](http://bin.jhere.net/4128297).