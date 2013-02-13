/*
 * Copyright (C) 2013 Massimiliano Marcon

 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:

 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*global jasmine:true,
  $:true,
  describe:true,
  beforeEach:true,
  it:true,
  afterEach:true,
  expect:true
  spyOn:true */

var nokia = {}, SPIES = {}, _JSLALoader;

function spy(name) {
    return jasmine.createSpy(name);
}


describe('jHERE', function(){
    beforeEach(function(){
        var map;

        _JSLALoader = {};

        //Mock the promised-based loaded
        _JSLALoader.load = function(){
            return {
                is: {
                    done: function(fn) {
                        fn();
                    }
                }
            };
        };

        //JSLA
        nokia.maps = {
            util: {
                ApplicationContext: {
                    set: spy('ApplicationContext.set')
                }
            }
        };
        nokia.maps.positioning = {
            component: {
                Positioning: spy('Positioning')
            }
        };
        map = nokia.maps.map = {
            component: {
                Behavior: spy('[component] Behavior'),
                zoom: {}
            }
        };

        SPIES.container_objects_add = spy('[container] add to objects');
        SPIES.container_objects_clear = spy('[container] add to objects');

        map.Container = function(){
            this.objects = {
                add: function(){ SPIES.container_objects_add.apply(this, arguments); },
                clear: function(){ SPIES.container_objects_clear.apply(this, arguments); }
            };
        };

        SPIES.display_objects_add = spy('[map] add to objects');
        SPIES.display_set = spy('[map] set property');
        SPIES.display_addListeners = spy('[map] add add listeners');
        SPIES.display_destroy = spy('[map] destroy');
        SPIES.display_setCenter = spy('[map] setCenter');

        SPIES.args = {
            map_normal: {t:1},
            map_satellite: {t:2},
            map_smart: {t:3},
            map_terrain: {t:4},
            map_smartpt: {t:5},
            map_normalcommunity: {t:6},
            map_satellitecommunity: {t:7},
            map_traffic: {t:8}
        };

        map.Display = function(){
            this.objects = {
                add: function(){ SPIES.display_objects_add.apply(this, arguments); }
            };
            this.set = function(){ SPIES.display_set.apply(this, arguments); };
            this.addListeners = function(){ SPIES.display_addListeners.apply(this, arguments); };
            this.destroy = function(){ SPIES.display_destroy.apply(this, arguments); };
            this.center = {};
            this.setCenter = function(center){
                this.center = center;
                SPIES.display_setCenter.apply(this, arguments);
            };

            this.NORMAL = SPIES.args.map_normal;
            this.SATELLITE = SPIES.args.map_satellite;
            this.SMARTMAP = SPIES.args.map_smart;
            this.TERRAIN = SPIES.args.map_terrain;
            this.SMART_PT = SPIES.args.map_smartpt;
            this.NORMAL_COMMUNITY = SPIES.args.map_normalcommunity;
            this.SATELLITE_COMMUNITY = SPIES.args.map_satellitecommunity;
            this.TRAFFIC = SPIES.args.map_traffic;
        };

        map.Marker = function(){};
        map.StandardMarker = function(){};

        $.jHERE._injectNS(nokia.maps);
        $.jHERE._injectJSLALoader(_JSLALoader);

        jasmine.getFixtures().set('<div id="map"></div>');
    });

    describe('map', function(){
        it('initializes the map', function(){
            //Spies on the constructors
            spyOn(nokia.maps.map, 'Display').andCallThrough();
            spyOn(nokia.maps.map, 'Container').andCallThrough();
            spyOn(_JSLALoader, 'load').andCallThrough();

            $('#map').jHERE({
                enable: ['behavior'],
                zoom: 12,
                center: [52.5, 13.3],
                type: 'map',
                appId: 'monkey',
                authToken: 'chimpanzee'
            });

            expect(_JSLALoader.load).toHaveBeenCalled();

            expect($('#map').data('jHERE')).toBe(true);
            expect($('#map').data('plg_jHERE').mtype).toBe('map');

            expect(nokia.maps.map.component.Behavior).toHaveBeenCalled();
            expect(nokia.maps.map.Display).toHaveBeenCalledWith($('#map')[0], jasmine.any(Object));
            expect(nokia.maps.map.Container).toHaveBeenCalled();
            expect(SPIES.display_objects_add).toHaveBeenCalled();
            expect(SPIES.display_addListeners).toHaveBeenCalled();
        });

        it('initializes the map, but throw an error when a wrong component is specified', function(){
            spyOn(_JSLALoader, 'load').andCallThrough();

            var functionThatThrows = function(){
                $('#map').jHERE({
                    enable: ['behavior', 'zoom'],
                    zoom: 12,
                    center: [52.5, 13.3],
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });
            };

            expect(functionThatThrows).toThrow('invalid: zoom');
            expect(_JSLALoader.load).toHaveBeenCalled();
        });

        it('sets a new center for the map', function(){
            var newCenter = {latitude: 50.43, longitude: 12.23};
            $('#map').jHERE({
                enable: ['behavior'],
                zoom: 12,
                center: [52.5, 13.3],
                type: 'map',
                appId: 'monkey',
                authToken: 'chimpanzee'
            });

            $('#map').jHERE('center', newCenter);
            expect(SPIES.display_setCenter).toHaveBeenCalledWith(newCenter);
        });

        it('sets a new zoom level for the map', function(){
            $('#map').jHERE({
                enable: ['behavior'],
                zoom: 12,
                center: [52.5, 13.3],
                type: 'map',
                appId: 'monkey',
                authToken: 'chimpanzee'
            });

            $('#map').jHERE('zoom', 16);
            expect(SPIES.display_set).toHaveBeenCalledWith('zoomLevel', 16);
        });

        describe('map type', function(){
            it('sets a new map type for the map', function(){
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: [52.5, 13.3],
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                SPIES.display_set.reset();

                $('#map').jHERE('type', 'smart');
                expect(SPIES.display_set).toHaveBeenCalledWith('baseMapType', SPIES.args.map_smart);
            });
            it('sets the default map type for the map when the type is not valid', function(){
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: [52.5, 13.3],
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                SPIES.display_set.reset();

                $('#map').jHERE('type', 'banana');
                expect(SPIES.display_set).toHaveBeenCalledWith('baseMapType', SPIES.args.map_normal);
            });
        });

        describe('markers', function(){
            it('adds a marker', function(){
                spyOn(nokia.maps.map, 'Marker').andCallThrough();
                spyOn(nokia.maps.map, 'StandardMarker').andCallThrough();

                var markerPosition = [52.5, 13.3];
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: [52.5, 13.3],
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('marker', markerPosition);
                expect(nokia.maps.map.StandardMarker).toHaveBeenCalledWith(markerPosition, jasmine.any(Object));
                //Test defaults are applied
                expect(nokia.maps.map.StandardMarker.mostRecentCall.args[1].textPen.strokeColor).toEqual('#333333');
                expect(nokia.maps.map.StandardMarker.mostRecentCall.args[1].brush.color).toEqual('#ff6347');
                expect(nokia.maps.map.Marker).not.toHaveBeenCalled();
            });

            it('adds a marker with icon', function(){
                spyOn(nokia.maps.map, 'Marker').andCallThrough();
                spyOn(nokia.maps.map, 'StandardMarker').andCallThrough();

                var markerPosition = [52.5, 13.3];
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: [52.5, 13.3],
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('marker', markerPosition, {icon: 'marker.png'});
                expect(nokia.maps.map.StandardMarker).not.toHaveBeenCalled();
                expect(nokia.maps.map.Marker).toHaveBeenCalledWith(markerPosition, jasmine.any(Object));
            });
        });
    });
});