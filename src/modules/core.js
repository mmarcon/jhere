import Loader from './loader';

const apiLoader = new Loader();

apiLoader.require([
    'http://js.api.here.com/v3/3.0/mapsjs-core.js',
    'http://js.api.here.com/v3/3.0/mapsjs-service.js'
    ], document.querySelector('script.test'));