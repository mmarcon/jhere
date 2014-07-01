/*
Copyright (c) 2014 Simon Madine http://thingsinjars.com/

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

//DOM Markers
//===
//
//Use any DOM element as a marker attached to the map instead of the
// built-in Marker class. Any change in map position, zoom or size
// will trigger an event to keep the DOM marker positions in sync.
//
//## Usage:
//
//`$('.selector').jHERE('dommarker', [52.46, 13.31], '.markerSelector');
//
//The marker position can be updated using:
//`$('.selector').jHERE('dommarkerupdate', [52.6, 13.3], '.markerSelector');
;(function($) {

	var domMarkerContainer, defaults, mapLoaded = false;

	defaults = {
		anchor: {
			x: 0,
			y: 0
		}
	};

	//### Use DOM elements as markers instead of the built-in Marker class
	//
	//`$('.selector').jHERE('dommarker', positionObject, domElement, markerOptions);`
	//
	//
	//`positionObject` can be an object of type
	//
	//`{latitude: -43, longitude: 55}`
	//
	//or an array
	//
	//`[-43, 55]`
	//
	//`domElement` is the element to be used as a marker
	// The element will be moved from its original DOM location into the map's own UI layer.
	//
	//`markerOptions` can be an object of type
	//<pre><code>{
	//  anchor: {x: 12, y: 18} //an element 24x36 would result centered
	//}</code></pre>
	//
	// Note: This does not take the same event listeners as the standard jHERE marker type.
	// Because this is a plain DOM element, events can be added the normal way.
	//
	// Update the position of the marker on the map with
	// $('.markerSelector')
	//markerOptions are **optional**.
	function dommarker(position, domElement, markerOptions) {
		var $domElements, map = this.map;
		if (!domMarkerContainer) {
			domMarkerContainer = $('<div/>').prependTo(map.getUIContainer());
		}

		$domElements = $(domElement);
		$domElements.each(function(i, domElement) {
			var $domElement;
			$domElement = $(domElement);
			$domElement.css('position', 'absolute');
			// $domElement.css('pointerEvents', 'none');
			$domElement.data('anchor', markerOptions.anchor);

			if (!markerOptions.anchor) {
				markerOptions.anchor = {
					x: $domElement.width() / 2,
					y: $domElement.height() / 2
				};

			}

			markerOptions = $.extend({}, defaults.marker, markerOptions);

			$domElement.data('position', position);

			$domElement.data('updatePosition', updatePosition);

			map.addListener('mapviewchange', function() {
				updatePosition.call($domElement, null, map);
			});
			domMarkerContainer.append($domElement);
		});
		map.addListener('mapviewchange', function() {
			if (!mapLoaded) {
				mapLoaded = !!$domElements.trigger('maploaded');
			}
		});

	}

	function domMarkerUpdate(position, domElement) {
		var $domElement = $(domElement),
			data = $domElement.data();

		if (data.updatePosition) {
			data.updatePosition.call($domElement, position, this.map);
		}
	}

	function updatePosition(position, map) {
		var px, $this = $(this),
			data = $this.data();

		position = position || data.position;

		px = map.geoToPixel({
			latitude: position.latitude || position[0],
			longitude: position.longitude || position[1]
		});
		$this.data('position', position);
		$this.css('left', px.x - data.anchor.x + 'px');
		$this.css('top', px.y - data.anchor.y + 'px');
	}

	$.jHERE.extend('dommarker', dommarker);
	$.jHERE.extend('dommarkerupdate', domMarkerUpdate);
}(jQuery));