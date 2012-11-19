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
        target = target.first();
        options.center = (target.data('center')||"52.49,13.37").split(',').map(function(v){return parseFloat(v);});
        options.zoom = target.data('zoom');
        options.type = target.data('type');
        target.jHERE(options);
    });
})(jQuery, window);