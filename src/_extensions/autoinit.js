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
;(function($, w){

    //## Auto-init extension
    //
    //When this extension is included a map is automatically initialized on a
    //container with `id` or `class` `map`.
    //Options are passed via data attributes as follows:
    //
    //`<div id="map" class="map" data-center="40.664167,-73.838611" data-zoom="8" data-type="map"></div>`
    $(w).on('load', function(){
        var target = $('#map, .map'), options = {};
        if(target.length === 0) {
            return;
        }
        target.each(function(i, t){
            var target = $(t);
            options.center = target.data('center');
            options.zoom = target.data('zoom');
            options.type = target.data('type');
            /*if it is something like 52.49,13.37*/
            if(options.center.match(/[\-+]?\d+(?:\.\d+)?,\s?[\-+]?\d+(?:\.\d+)?/)) {
                options.center = options.center.split(',').map(function(v){return parseFloat(v);});
                target.jHERE(options);
            } else {
                if(!$.jHERE.geocode){
                    /*Uhmm... missing geocode dependency*/
                    $.error('Geocode extension is required to resolve an address to a location.');
                }
                $.jHERE.geocode(options.center, function(center){
                    options.center = center;
                    target.jHERE(options);
                }, function(){
                    $.error('Geocoding error');
                });
            }
        });
    });
})(jQuery, window);