import Loader from './loader';

const apiLoader = new Loader();
const jsApiUrl = 'http://js.api.here.com/v3/3.0/mapsjs-M.js';
const modules = ['core', 'service'].map(module => jsApiUrl.replace('M', module));

apiLoader.require(modules, document.querySelector('script.test'));