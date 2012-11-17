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
    var header = $('header'),
        headeroffset = header.offset().top,
        headerwidth = header.width();

    $('#map').jHERE({
        enable: ['behavior'],
        zoom: 10,
        center: {latitude: 40.782815017800615, longitude: -74.37394437787488},
        type: 'pt'
    });

    //Wait for FB button to be in place before showing it
    setTimeout($.proxy($.fn.show, $('.facebook')), 600);
});