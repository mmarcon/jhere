/*
Copyright (c) 2015 Massimiliano Marcon, http://marcon.me

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

export const lib = '_jHERE';
export const url = 'https://js.api.here.com/v3/3.0/mapsjs-M.js';
export const uiCss = url.replace('M.js', 'ui.css');
export const modules = ['core', 'service', 'mapevents', 'ui'];
export const defaultCredentials = {
    appId: 'lPY5MGHzyXJTYJXt2Sog',
    authToken: 'qUtXEMHxFTwoz_WeIKbLrA'
};
export const defaults  = {
    credentials: defaultCredentials,
    zoom: 12,
    center: {lat: 52.49, lng: 13.37},
    type: 'map',
    enable: ['zoombar', 'scalebar', 'settings', 'behavior']
};

const pointer = 'pointer';
const tap = 'tap';
const drag = 'drag';
const start = 'start';
const end = 'end';
const move = 'move';

export const supportedEvents = [
    pointer + 'down', /*mousedown, touchstart, pointerdown*/
    pointer + 'up', /*mouseup, touchend, pointerup*/
    pointer + move, /*mousemove, touchmove, pointermove*/
    pointer + 'enter', /*mouseenter, touchenter, pointerenter*/
    pointer + 'leave', /*mouseleave, touchleave, pointerleave*/
    pointer + 'cancel', /*touchcancel, pointercancel*/
    drag + start,
    drag,
    drag + end,
    tap, /*click, tap*/
    'dbl' + tap,
    'longpress'
];
