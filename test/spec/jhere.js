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
  SPIES: true */

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
            it('renders a KML files on a map', function(){
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });
            });
        });
        describe('heatmap', function(){
            it('renders a heatmap on a map', function(){
                $('#map').jHERE({
                    enable: ['behavior'],
                    zoom: 12,
                    center: {latitude: 52.5, longitude: 13.3},
                    type: 'map',
                    appId: 'monkey',
                    authToken: 'chimpanzee'
                });
            });
        });
    });
});