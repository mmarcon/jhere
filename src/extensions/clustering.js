/*
Copyright (c) 2013 Massimiliano Marcon, http://marcon.me

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
    var _ns, clusterFn, noClusterFn, _cluster;

    var _JSLALoader = {};
    _JSLALoader.is = false;
    _JSLALoader.load = function(){
        if(_JSLALoader.is && _JSLALoader.is.state().match(/pending|resolved/)) {
            /*JSLA loading is already in progress*/
            return this;
        }
        _JSLALoader.is = $.Deferred();
        nokia.Features.load({clustering: 'auto'}, function(){_JSLALoader.is.resolve();});
        return this;
    };

    function getCluster(map, options){
        if(!_cluster) {
            _cluster = new _ns.clustering.ClusterProvider(map, {
                eps: options.eps || 16,
                minPts: 1,
                dataPoints: []
            });
        }
        return _cluster;
    }

    clusterFn = function(data, options) {
        var cluster, self = this;
        _ns = _ns || nokia.maps;
        _JSLALoader.load().is.done(function(){
            options = options || {};
            cluster = getCluster(self.map, options);
            if(!$.isArray(data)) {
                data = [data];
            }
            cluster.addAll(data);
            cluster.cluster();
        });
    };

    noClusterFn = function(data, options) {
        var cluster, self = this;
        _ns = _ns || nokia.maps;
        _JSLALoader.load().is.done(function(){
            cluster = getCluster(self.map, options);
            cluster.clean();
        });
    };

    $.jHERE.extend('cluster', clusterFn);
    $.jHERE.extend('nocluster', noClusterFn);
}(jQuery));