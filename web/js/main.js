/*global $:true, alert:true, _gaq*/
var heatMapData=[{value:4899,latitude:52.53026126658807,longitude:13.385298362512387},{value:3299,latitude:52.530712612721196,longitude:13.385059833526611},{value:36,latitude:52.530215905734,longitude:13.38543057664563},{value:680,latitude:52.5308704376221,longitude:13.3849096298218},{value:289,latitude:52.530234520737004,longitude:13.385648693847036},{value:27,latitude:52.53048853756028,longitude:13.385252371995787},{value:38,latitude:52.53006362614138,longitude:13.385473500409793},{value:89,latitude:52.530244890211264,
longitude:13.385788119172863},{value:6,latitude:52.53025398343701,longitude:13.38576000453459},{value:164,latitude:52.529855659002,longitude:13.38426841720272},{value:687,latitude:52.529975,longitude:13.383993},{value:1347,latitude:52.52956594243049,longitude:13.384504666194712},{value:34,latitude:52.530347321620944,longitude:13.385677040788089},{value:184,latitude:52.530878,longitude:13.384904},{value:172,latitude:52.52976864794835,longitude:13.384791244138654},{value:479,latitude:52.53080398695847,
longitude:13.38707685470581},{value:128,latitude:52.5309,longitude:13.3847},{value:17,latitude:52.5299699698133,longitude:13.3851313311731},{value:18,latitude:52.5309,longitude:13.3849},{value:3,latitude:52.530006959735175,longitude:13.385183469129728},{value:169,latitude:52.52960574844206,longitude:13.384814799655908},{value:308,latitude:52.53043419709394,longitude:13.385883058015915},{value:71,latitude:52.530757,longitude:13.384383},{value:716,latitude:52.530305,longitude:13.38347432},{value:7,
latitude:52.530581520484056,longitude:13.386184774537549},{value:3,latitude:52.5307651756088,longitude:13.384771001626588},{value:297,latitude:52.53071931758466,longitude:13.383554065723375},{value:687,latitude:52.53054291720474,longitude:13.383557796478271},{value:13,latitude:52.530131948860614,longitude:13.386342364840072},{value:5,latitude:52.53,longitude:13.3851},{value:68,latitude:52.530712612721196,longitude:13.384780883789062},{value:21,latitude:52.530497,longitude:13.385122349999998},{value:210,
latitude:52.529994665670216,longitude:13.38409423828125},{value:5,latitude:52.53097347967182,longitude:13.3848509841156},{value:220,latitude:52.529782,longitude:13.38395},{value:212,latitude:52.530654,longitude:13.383659},{value:56,latitude:52.5308170648083,longitude:13.383900201050393},{value:88,latitude:52.530654962765965,longitude:13.383485390706522},{value:19,latitude:52.530841,longitude:13.384908},{value:7,latitude:52.5309619680536,longitude:13.3848052751398},{value:376,latitude:52.529297467355825,
longitude:13.384428562870935},{value:824,latitude:52.529055867792856,longitude:13.385228922324478},{value:25,latitude:52.53073893510019,longitude:13.38375270869002},{value:157,latitude:52.53011214871808,longitude:13.38357925415039},{value:44,latitude:52.530441122208984,longitude:13.386257713051902},{value:32,latitude:52.52943155096217,longitude:13.384827986540591},{value:235,latitude:52.530798030550265,longitude:13.383918592731648},{value:211,latitude:52.529138,longitude:13.384971},{value:41,latitude:52.53110073535684,
longitude:13.386037485323744},{value:28,latitude:52.529808973752715,longitude:13.383999001205726}];

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
        icon: 'img/pin-black.png',
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

function makeGecode(selector) {
    var s = $(selector).css('background', '#fff'),
        address = 'Invalidenstrasse, 116, 10115, Berlin, Germany';
    s.append('<div class="address">' + address + ' is located at: </div>');
    $.jHERE.geocode(address, function(location){
        s.append('<div class="location">' + location.latitude + ',' + location.longitude + '</div>');
    });
}

function makeRoute(selector) {
    $(selector).jHERE({
        enable: [],
        center: [52.56, 13.18],
        zoom: 9,
        type: 'smart'
    })
    .jHERE('route', [52.711, 13.011], [52.514, 13.453], {color: '#333', marker: {
        fill: '#86c440',
        text: '#'
    }});
}

function makeShapes(selector) {
    $(selector).jHERE({
        enable: [],
        center: [52.5, 13.4],
        zoom: 11,
        type: 'smart'
    })
    .jHERE('polygon', {points: [[52.521, 13.372],
        [52.516, 13.370], [52.506, 13.373], [52.501, 13.377], [52.498, 13.390], [52.499, 13.419], [52.501, 13.444],
        [52.502, 13.447], [52.518, 13.454], [52.527, 13.448], [52.532, 13.442], [52.536, 13.433], [52.539, 13.423],
        [52.541, 13.413], [52.538, 13.396], [52.534, 13.388], [52.532, 13.389], [52.529, 13.380], [52.526, 13.368]],
        style:{
            fill: '#ff6347AA',
            thickness: 1,
            stroke: '#111'
        }
    });
}

$(function(){
    $('.email').attr('href', 'mailto:max@jhere.net').text('max@jhere.net');
    $('a').on('click', function(e){
        if(!_gaq) {
            return true;
        }
        var url = $(this).attr("href");
        if (e.currentTarget.host != window.location.host) {
            e.preventDefault();
            try {
                _gaq.push(['_trackEvent', 'Outbound Links', e.currentTarget.host, url, 0]);
                setTimeout('document.location = "' + url + '"', 100);
            } catch(err){
                document.location = url;
            }
        }
    });
});

$(window).on('load', function(){
    $.jHERE.defaultCredentials('69Dgg78qt4obQKxVbRA8', 'Nz7ilIB_v1CRwPXxgPdvuA');

    var $map = $('#map').jHERE({
        enable: [],
        zoom: 12,
        center: {latitude: 40.7324, longitude: -74.0132},
        type: 'pt'
    });

    $(document).on('click', '.controls li', function(){
        var zoom = $map.jHERE().zoom;
        if($(this).hasClass('plus')) {
            return $map.jHERE('zoom', zoom + 1);
        }
        $map.jHERE('zoom', zoom - 1);
    });

    $('header.home, header.page').append('<ul class="controls"><li class="plus"></li><li class="minus"></li></ul>');

    makeSimple('.simple');
    makeSatellite('.satellite');
    makeMarker('.marker');
    makeBubble('.bubble');
    makeKML('.kml');
    makeHeatmap('.heatmap');

    makeGecode('.geocoding');
    makeRoute('.routing');
    makeShapes('.shapes');
});