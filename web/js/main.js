/*global $:true*/
$(window).on('load', function(){
    $('#map').jHERE({
        enable: ['behavior'],
        zoom: 12,
        center: {latitude: 40.7324, longitude: -74.0132},
        type: 'pt'
    });
});