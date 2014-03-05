;(function($) {

    var cityCategoryId = 'city-town-village';

    var defaultOptions = {
        query: '',
        resultsLimit: 10,
        useGeoLocation: true
    };

    function isEmpty(string) {
        return string.match(/^\s*$/);
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    function searchCities(opts, deferred) {

        if (isEmpty(opts.query)) {
            return deferred.resolve([]);
        }

        nokia.places.search.manager.findPlaces({
            searchTerm: opts.query,
            useGeoLocation: opts.useGeoLocation,
            onComplete: function(findResult, status) {
                if (status !== 'OK') {
                    return deferred.reject();
                }

                var cities = filterCities(findResult, opts);
                var formattedCities = [];

                cities.forEach(function(city) {
                    var geocodeQuery = city.position;
                    geocodeQuery.onComplete = function(geocodedCity, status) {
                        if (status === 'OK') {
                            formattedCities.push(formatCity(geocodedCity));
                        } else {
                            delete geocodeQuery.onComplete;
                            formattedCities.push(city);
                        }

                        if (formattedCities.length === cities.length) {
                            deferred.resolve(formattedCities);
                        }
                    };
                    nokia.places.search.manager.reverseGeoCode(geocodeQuery);
                });
            }
        });
        
    }

    function filterCities(findResult, opts) {
        return findResult.results.items
            .filter(function(e) { return e.category.categoryId === cityCategoryId; })
            .slice(0, opts.resultsLimit);
    }

    function formatCity(geocodedCity) {
        return geocodedCity.location;
    }

    function parseOpts(givenOpts) {
        if (!givenOpts || isString(givenOpts)) {
            givenOpts = {
                query: givenOpts
            };
        }

        var opts = {};
        for (var opt in defaultOptions) {
            if (defaultOptions.hasOwnProperty(opt)) {
                opts[opt] = givenOpts[opt] || defaultOptions[opt];
            }
        }
        return opts;
    }

    $.jHERE.searchCities = function(opts, success, error) {
        var deferred = $.Deferred();
        var promise = deferred.promise();

        success = isFunction(success) ? success : $.noop;
        error = isFunction(error) ? error : $.noop;

        $.jHERE._JSLALoader.load().is.done(function() {

            searchCities(parseOpts(opts), deferred);

        });

        $.when(promise).then(
            function(v) {
                success(v);
            },
            function(e) {
                error(e);
            }
        );

        return promise;
    };

}(jQuery));
