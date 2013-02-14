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
  spyOn:true,
  resetMocks,
  _JSLALoader: true,
  SPIES: true,
  spy */

describe('jHERE', function(){
    beforeEach(function(){
        //resetMocks defines mocks for JSLA and _JSLALoader injects
        //mocks and namespaces into the tested code.
        resetMocks();

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
                expect(nokia.maps.map.StandardMarker.mostRecentCall.args[1].eventListener.click instanceof Array).toBe(true);

                expect(nokia.maps.map.Marker).not.toHaveBeenCalled();

                expect(SPIES.container_objects_add).toHaveBeenCalled();
                expect(SPIES.container_objects_add.mostRecentCall.args[0] instanceof nokia.maps.map.StandardMarker).toBe(true);
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
                expect(nokia.maps.map.Marker.mostRecentCall.args[1].icon).toEqual('marker.png');

                expect(SPIES.container_objects_add).toHaveBeenCalled();
                expect(SPIES.container_objects_add.mostRecentCall.args[0] instanceof nokia.maps.map.Marker).toBe(true);
            });

            it('removes all markers', function(){
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: [52.5, 13.3],
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('marker', [52.52, 13.34])
                         .jHERE('marker', [52.5, 13.3], {icon: 'marker.png'});

                $('#map').jHERE('nomarkers');

                expect(SPIES.container_objects_clear).toHaveBeenCalled();
            });
        });

        describe('bubbles', function(){
            it('opens a simple infobubble (position passed as array)', function(){
                spyOn(nokia.maps.map.component, 'InfoBubbles').andCallThrough();
                var bubblePosition = [52.5, 13.3];

                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: [52.5, 13.3],
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('bubble', bubblePosition, {
                    content: 'HELLO!'
                });

                expect(nokia.maps.map.component.InfoBubbles).toHaveBeenCalled();
                expect(SPIES.display_addComponent).toHaveBeenCalled();
                expect(SPIES.display_addComponent.mostRecentCall.args[0] instanceof nokia.maps.map.component.InfoBubbles).toBe(true);
                expect(SPIES.component_infobubbles_openbubble).toHaveBeenCalledWith('HELLO!', jasmine.any(Object), jasmine.any(Function), false);
                expect(SPIES.component_infobubbles_openbubble.mostRecentCall.args[1].latitude).toBe(52.5);
                expect(SPIES.component_infobubbles_openbubble.mostRecentCall.args[1].longitude).toBe(13.3);
            });

            it('opens a simple infobubble (position passed as object)', function(){
                spyOn(nokia.maps.map.component, 'InfoBubbles').andCallThrough();
                var bubblePosition = {latitude: 52.5, longitude: 13.3};

                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('bubble', bubblePosition, {
                    content: 'HELLO!'
                });

                expect(nokia.maps.map.component.InfoBubbles).toHaveBeenCalled();
                expect(SPIES.display_addComponent).toHaveBeenCalled();
                expect(SPIES.display_addComponent.mostRecentCall.args[0] instanceof nokia.maps.map.component.InfoBubbles).toBe(true);
                expect(SPIES.component_infobubbles_openbubble).toHaveBeenCalledWith('HELLO!', jasmine.any(Object), jasmine.any(Function), false);
                expect(SPIES.component_infobubbles_openbubble.mostRecentCall.args[1].latitude).toBe(52.5);
                expect(SPIES.component_infobubbles_openbubble.mostRecentCall.args[1].longitude).toBe(13.3);
            });

            it('opens an infobubble with content passed as jQuery object', function(){
                spyOn(nokia.maps.map.component, 'InfoBubbles').andCallThrough();

                var bubblePosition = {latitude: 52.5, longitude: 13.3},
                    bubbleContent = $('<h4>Hello <span class="name">dude</span></h4>');

                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('bubble', bubblePosition, {
                    content: bubbleContent,
                    closable: false
                });

                expect(SPIES.display_getComponentById).toHaveBeenCalledWith('InfoBubbles');
                expect(nokia.maps.map.component.InfoBubbles).toHaveBeenCalled();
                expect(SPIES.display_addComponent).toHaveBeenCalled();
                expect(SPIES.display_addComponent.mostRecentCall.args[0] instanceof nokia.maps.map.component.InfoBubbles).toBe(true);
                expect(SPIES.component_infobubbles_openbubble).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object), jasmine.any(Function), true);
                //Due to different browser returning html from jQuery in a sligthly different way in terms of spaces
                //we just remove all the spaces before comparing.
                expect(SPIES.component_infobubbles_openbubble.mostRecentCall.args[0].replace(/\s/g, '')).toEqual('<h4 style="white-space: normal; ">Hello <span class="name">dude</span></h4>'.replace(/\s/g, ''));
                expect(SPIES.component_infobubbles_openbubble.mostRecentCall.args[1].latitude).toBe(52.5);
                expect(SPIES.component_infobubbles_openbubble.mostRecentCall.args[1].longitude).toBe(13.3);
            });

            it('closes all the bubbles', function(){
                var bubblePosition = {latitude: 52.5, longitude: 13.3};

                //For this particular test, I need getComponentById to return an instance
                //of InfoBubbles, so I overwrite the prototype before the instance
                //of Display gets created.
                nokia.maps.map.Display.prototype.getComponentById = function(){
                    SPIES.display_getComponentById.apply(this, arguments);
                    return new nokia.maps.map.component.InfoBubbles();
                };

                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('bubble', bubblePosition, {
                    content: 'HELLO!'
                }).jHERE('bubble', bubblePosition, {
                    content: 'WORLD!'
                });

                $('#map').jHERE('nobubbles');
                expect(SPIES.display_getComponentById).toHaveBeenCalledWith('InfoBubbles');
                expect(SPIES.component_infobubbles_closeall).toHaveBeenCalled();
            });
        });

        describe('KML', function(){
            it('renders a KML files on a map and NOT zoom to it', function(){
                var callback = spy('KML callback');

                spyOn(nokia.maps.kml, 'Manager').andCallThrough();
                spyOn(nokia.maps.kml.component, 'KMLResultSet').andCallThrough();

                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('kml', 'awesome-trail.kml', false, callback);

                expect(nokia.maps.kml.Manager).toHaveBeenCalled();
                expect(SPIES.kmlmgr_parseKML).toHaveBeenCalled();
                expect(SPIES.kmlmgr_addObserver).toHaveBeenCalledWith('state', jasmine.any(Function));

                expect(nokia.maps.kml.component.KMLResultSet).toHaveBeenCalledWith('mockeddocument', jasmine.any(Object));
                expect(nokia.maps.kml.component.KMLResultSet.mostRecentCall.args[1] instanceof nokia.maps.map.Display).toBe(true);
                expect(SPIES.kmlresultset_create).toHaveBeenCalled();
                expect(SPIES.kmlresultset_addObserver).toHaveBeenCalledWith('state', jasmine.any(Function));

                //check we are not zooming
                expect(SPIES.container_objects_get).not.toHaveBeenCalled();
                expect(SPIES.display_zoomTo).not.toHaveBeenCalled();

                expect(callback).toHaveBeenCalled();
            });

            it('renders a KML files on a map and zoom to it', function(){
                var callback = spy('KML callback');

                spyOn(nokia.maps.kml, 'Manager').andCallThrough();
                spyOn(nokia.maps.kml.component, 'KMLResultSet').andCallThrough();

                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('kml', 'awesome-trail.kml', true, callback);

                expect(nokia.maps.kml.Manager).toHaveBeenCalled();
                expect(SPIES.kmlmgr_parseKML).toHaveBeenCalled();
                expect(SPIES.kmlmgr_addObserver).toHaveBeenCalledWith('state', jasmine.any(Function));

                expect(nokia.maps.kml.component.KMLResultSet).toHaveBeenCalledWith('mockeddocument', jasmine.any(Object));
                expect(nokia.maps.kml.component.KMLResultSet.mostRecentCall.args[1] instanceof nokia.maps.map.Display).toBe(true);
                expect(SPIES.kmlresultset_create).toHaveBeenCalled();
                expect(SPIES.kmlresultset_addObserver).toHaveBeenCalledWith('state', jasmine.any(Function));

                //check we are not zooming
                expect(SPIES.container_objects_get).toHaveBeenCalled();
                expect(SPIES.container_objects_getbbox).toHaveBeenCalled();
                expect(SPIES.display_zoomTo).toHaveBeenCalledWith('bbox');

                expect(callback).toHaveBeenCalled();
            });
        });
        describe('heatmap', function(){
            it('renders a heatmap on a map', function(){
                var heatMapData = [
                    {
                        "value": 4899,
                        "latitude": 52.53026126658807,
                        "longitude": 13.385298362512387
                    },
                    {
                        "value": 3299,
                        "latitude": 52.530712612721196,
                        "longitude": 13.385059833526611
                    },
                    {
                        "value": 36,
                        "latitude": 52.530215905734003,
                        "longitude": 13.38543057664563
                    },
                    {
                        "value": 680,
                        "latitude": 52.530870437622099,
                        "longitude": 13.3849096298218
                    },
                    {
                        "value": 289,
                        "latitude": 52.530234520737004,
                        "longitude": 13.385648693847036
                    }
                ], options = {
                    max : 10,
                    opacity : 0.5,
                    coarseness : 1
                };

                spyOn(nokia.maps.heatmap, 'Overlay').andCallThrough();

                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('heatmap', heatMapData, 'density', options);
                expect(nokia.maps.heatmap.Overlay).toHaveBeenCalledWith(options);
                expect(SPIES.heatmap_addData).toHaveBeenCalledWith(heatMapData);
                expect(SPIES.display_overlays_add).toHaveBeenCalled();
                expect(SPIES.display_overlays_add.mostRecentCall.args[0] instanceof nokia.maps.heatmap.Overlay).toBe(true);
            });
        });

        describe('other methods', function(){
            it('returns the original map and namespace', function(){
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });

                $('#map').jHERE('originalMap', function(map, here){
                    expect(map instanceof nokia.maps.map.Display).toBe(true);
                    expect(here === nokia.maps).toBe(true);
                });
            });

            it('returns some properties of the map', function(){
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });
                $('#map').jHERE('center', [52.5, 13.3]);
                expect($('#map').jHERE().center[0]).toEqual(52.5);
                expect($('#map').jHERE().center[1]).toEqual(13.3);
            });
        });
    });
});