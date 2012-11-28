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
;(function($, d){


    //[Map Marker](http://thenounproject.com/noun/map-marker/#icon-No2448)
    //designed by [Nathan Borror](http://thenounproject.com/nathan)
    //from The Noun Project
    var pin = 'data:image/png;base64,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';

    //## Input type location extension
    //
    //Wouldn't it be nice if browser natively supported
    //inputs for locations (i.e. latitude and longitude)
    $(function(){
        var input = $('input[data-type="location"]'),
        button = $('<button class="location">'),
        map = $('<div class="input-map">').hide();

        function injectCSS() {
            /*inject css rules bookmarklet source*/
            /*by paul irish. public domain code.*/
            /*http://paulirish.com/2008/bookmarklet-inject-new-css-rules*/
            var css = 'input[data-type=location]{border:1px solid #ccc;border-radius:3px;padding:3px 20px 3px 3px;} .input-location{position:relative;display:inline-block;} button.location{background:url(' + pin + ');display:block;width:12px;height:18px;cursor:pointer;position:absolute;right:4px;top:4px;border:0;opacity:0.5;} button.location:hover{opacity:0.9;} .input-map{border:2px solid #222;width:150px;height:150px;position:absolute;left:100%;margin-left:-19px;border-radius:3px;top:30px;background:#fff;} .input-map:before{content:"";width:0;height:0;position:absolute;left:2px;top:-10px;border-color:transparent transparent #222;border-style:solid;border-width:0 5px 8px;}';
            if ('\v'=='v') /* ie only */ {
                document.createStyleSheet().cssText = css;
            } else {
                var tag = document.createElement('style'); tag.type = 'text/css'; document.getElementsByTagName('head')[0].appendChild(tag);
                tag[ (typeof document.body.style.WebkitAppearance=='string') /* webkit only */ ? 'innerText' : 'innerHTML'] = css;
            }
        }

        function updateMap(){
            var center = input.val();
            /*Check if the field contains lat,lon or lat, lon*/
            center = center.match(/[\+\-]?\d+(\.\d+)?,\s?[\+\-]?\d+(\.\d+)?/) ? center.split(',').map(function(v){return parseFloat(v);}) : null;
            /*Was jHERE already initialized here*/
            if(!$.data(map.get(0), 'jHERE')) {
                map.jHERE({
                    enable: ['behavior'],
                    type: 'smart',
                    center: center || [52.5, 13.3],
                    zoom: 8
                });
                map.jHERE('originalMap', function(m){
                    /*Currently jHERE does not expose events on map*/
                    /*Let's attach click to the original map object then*/
                    var click = function(evt){
                        var coord = m.pixelToGeo(evt.displayX, evt.displayY);
                        input.val(coord.latitude.toFixed(3)+','+ coord.longitude.toFixed(3));
                        clearPin();
                        dropPin(coord);
                    };
                    m.addListeners({click:[click, false, null]});
                });
            } else {
                map.jHERE('center', center || [52.5, 13.3]);
            }
            clearPin();
            if(center){
                dropPin(center);
            }
        }

        function dropPin(position){
            map.jHERE('marker', position, {
                icon: pin,
                anchor: {x: 6, y: 18}
            });
        }

        function clearPin(){
            map.jHERE('originalMap', function(m){
                m.objects.clear();
            });
        }

        button.on('click', function(e){
            e.stopPropagation();
            updateMap();
            map.toggle();
        });
        input.on('keyup', updateMap);
        input.on('blur', function(){map.hide();});


        injectCSS();
        input.wrap('<div class="input-location">');
        $('.input-location').append(button);
        $('.input-location').append(map);
    });
})(jQuery, document);