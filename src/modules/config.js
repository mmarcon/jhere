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
    type: 'map'
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
