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
    marker: {
        text: '',
        textColor: '#333333',
        fill: '#ff6347',
        stroke: '#333333',
        shape: 'balloon',
        icon: undefined
    },
    bubble: {
        content: '',
        closable: true,
        onclose: function(){}
    },
    heatmap: {
        max: 20,
        opacity: 0.8,
        coarseness: 2
    }
};