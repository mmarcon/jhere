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
 
 