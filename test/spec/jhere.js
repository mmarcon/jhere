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

var nokia = {}, SPIES = {};

function spy(name) {
    return jasmine.createSpy(name);
}


describe('jHERE', function(){
    beforeEach(function(){
        //JSLA
        var map;

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

        map.Display = function(){
            this.objects = {
                add: function(){ SPIES.display_objects_add.apply(this, arguments); }
            };
            this.set = function(){ SPIES.display_set.apply(this, arguments); };
            this.addListeners = function(){ SPIES.display_addListeners.apply(this, arguments); };
            this.destroy = function(){ SPIES.display_destroy.apply(this, arguments); };
        };


        //Don't wanna test the load of JSLA.
        //JSLA will instead be mocked, therefore hack it.
        //*** Don't change this if you don't know what you are doing. ***//
        $.jHERE.extend('init', function(){
            this.makemap();
        });

        $.jHERE._injectNS(nokia.maps);

        jasmine.getFixtures().set('<div id="map"></div>');
    });

    describe('map', function(){

        it('initializes the map', function(){
            //Spies on the constructors
            spyOn(nokia.maps.map, 'Display').andCallThrough();
            spyOn(nokia.maps.map, 'Container').andCallThrough();

            $('#map').jHERE({
                enable: ['behavior'],
                zoom: 12,
                center: [52.5, 13.3],
                type: 'map',
                appId: 'monkey',
                authToken: 'chimpanzee'
            });

            expect($('#map').data('jHERE')).toBe(true);
            expect($('#map').data('plg_jHERE').mtype).toBe('map');

            expect(nokia.maps.map.component.Behavior).toHaveBeenCalled();
            expect(nokia.maps.map.Display).toHaveBeenCalledWith($('#map')[0], jasmine.any(Object));
            expect(nokia.maps.map.Container).toHaveBeenCalled();
            expect(SPIES.display_objects_add).toHaveBeenCalled();
            expect(SPIES.display_addListeners).toHaveBeenCalled();
        });

        it('initializes the map, but throw an error when a wrong component is specified', function(){
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
        });
    });
});