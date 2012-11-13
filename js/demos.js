function makeSimple(selector) {
    $(selector).jHERE({
        enable: ['behavior'],
        center: [40.664167, -73.838611],
        zoom: 8
    });
}

function makeSatellite(selector) {
    $(selector).jHERE({
        enable: ['behavior', 'contextmenu'],
        center: [41.77, -87.51],
        zoom: 8,
        type: 'satellite'
    });
}

function makeMarker(selector) {
    $(selector).jHERE({
        enable: ['behavior'],
        center: [52.500556, 13.398889],
        zoom: 8,
        type: 'terrain'
    }).jHERE('marker', [52.500556, 13.338889], {
        icon: 'images/pin-black.png',
        anchor: {x: 12, y: 32},
        click: function(){alert('Hallo from Berlin!');}
    });
}

function makeBubble(selector) {
    $(selector).jHERE({
        enable: ['behavior'],
        center: [52.400556, 13.5889],
        zoom: 8
    }).jHERE('bubble', [52.500556, 13.398889], {closable: false, content: 'Hallo!'});
}

function makeKML(selector) {
    $(selector).jHERE({
        enable: false
    }).jHERE('kml', 'js/berlin.kml', true);
}

function makeHeatmap(selector) {
    $(selector).jHERE({
        enable: false,
        center: [52.53, 13.384],
        zoom: 15
    }).jHERE('heatmap', heatMapData /*defined elsewhere*/, 'density');
}

$(window).on('load', function(){
    makeSimple('.simple');
    makeSatellite('.satellite');
    makeMarker('.marker');
    makeBubble('.bubble');
    makeKML('.kml');
    makeHeatmap('.heatmap');

    $('.demos li').on('click', function(e){
        var el = $(this);
        $('body').addClass('overlay');
        if(el.hasClass('simple')) {
            makeSimple('.demo-map');
        } else if(el.hasClass('satellite')) {
            makeSatellite('.demo-map');
        } else if(el.hasClass('marker')) {
            makeMarker('.demo-map');
        } else if(el.hasClass('bubble')) {
            makeBubble('.demo-map');
        } else if(el.hasClass('kml')) {
            makeKML('.demo-map');
        } else if(el.hasClass('heatmap')) {
            makeHeatmap('.demo-map');
        }
        $('.caption').text(el.attr('title'));
    });

    function closeLightbox() {
        $('body').removeClass('overlay');
        $('.demo-map').jHERE('destroy');
    }

    $('.lightbox-overlay, .close').on('click', function(e){
        if(this !== e.target) {
            return;
        }
        closeLightbox();
    });

    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            closeLightbox();
        }
    });
});