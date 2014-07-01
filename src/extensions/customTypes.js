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
;(function($){
    var _ns;
    //### Set the map type
    //`$('.selector').jHERE('type', mapType);`
    //
    //`mapType` is a string:
    //
    // 1. `'map'`: the normal map type. This is the *default*.
    // 2. `'smart'`: a map with most of the colors grayed out. Useful for data visualization.
    // 3. `'pt'`: a smart map where the tiles also contain the **public transport lines**.
    // 4. `'satellite'`: satellite view.
    // 5. `'terrain'`: terrain view.
    // 6. `'community'`: HERE Maps community layer.
    // 7. `'satcommunity'`: HERE Maps community layer with satellite imagery.
    // 8. `'traffic'`: traffic layer.
    function customType(type, options){
        _ns = _ns || nokia.maps;
        var map = this.map,
            newType,
            types = {
                map: map.NORMAL,
                satellite: map.SATELLITE,
                smart: map.SMARTMAP,
                terrain: map.TERRAIN,
                pt: map.SMART_PT,
                community: map.NORMAL_COMMUNITY,
                satcommunity: map.SATELLITE_COMMUNITY,
                traffic: map.TRAFFIC
            };

        newType = options && createBaseMapType(type, options);
        if(newType) {
            this.mtype='custom';
        } else {
            this.mtype = type in types ? type : 'map';
            newType = types[this.mtype];
        }
        map.set('baseMapType', newType);
    }

    function createBaseMapType(scheme, options) {
        if(!options) {
            return false;
        }
        var type = getType(scheme, options),
            size = 1<window.devicePixelRatio?512:256;
        if(type) {
            var baseMapProvider = new _ns.map.provider.ImgTileProvider({
                label: scheme + '.day',
                descr: 'Map tile provider',
                width: 256,
                height: 256,
                min: 2,
                max: 20,
                getUrl: generateTileUrl(scheme, type, size),
                getCopyrights: generateHereCopyrights(scheme)
            });
            return baseMapProvider;
        } else {
            return false;
        }
    }

    function generateTileUrl(scheme, type, size) {
        return function(level, row, col) {
            return "http://1.aerial.maps.api.here.com/maptile/2.1/" + type + "/newest/" + scheme + ".day/" +
                level + "/" + col + "/" + row + "/" + size + "/png8?app_id=" + nokia.Settings.app_id + "&app_code=" + nokia.Settings.app_code;
        };
    }

    function generateHereCopyrights(schema) {
        return function (area, zoomLevel) {
            // When using aerial tiles returned from this server,
            // ensure the correct HERE Copyright is displayed.
            var key = (schema === 'terrain')?'TERRAIN':'SATELLITE';
            return _ns.map.Display[key].getCopyrights(area, zoomLevel);
        };
    }

    function getType(scheme, options) {
        var tiles = [0, 'label', 'line', 'street', 'xbase', 'base', 'map'],
        schemeTree = {
            terrain:   [0, 1, 2, 3, 4, 0, 5, 6],
            satellite: [0, 0, 0, 0, 4, 0, 5, 6],
            hybrid:    [0, 1, 2, 3, 4, 0, 5, 6]
        };

        var mask = (4 * !!options.land) + (2 * !!options.borders) + (!!options.labels);
        return  schemeTree[scheme] &&
                schemeTree[scheme][mask] &&
                tiles[schemeTree[scheme][mask]] &&
                tiles[schemeTree[scheme][mask]] + 'tile';
    }

    $.jHERE.extend('type', customType);

}(jQuery));
