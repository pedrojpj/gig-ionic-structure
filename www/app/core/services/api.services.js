(function() {
    'use strict';


    angular
        .module('app.core')
        .config(function($httpProvider, $logProvider, HEADER, TIMEOUT, LOG) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            $httpProvider.defaults.timeout = TIMEOUT;
            $httpProvider.defaults.withCredentials = true;
            $httpProvider.defaults.headers.common = {"X-app-version": HEADER};
            $httpProvider.useApplyAsync(true);

            $logProvider.debugEnabled(LOG);
        })
        .factory('ApiService', ApiService);


    function ApiService($q, $http, $window, $state, $cacheFactory, $rootScope, $log, AppService, URL_SERVICE) {

        var cacheFactory = $cacheFactory('content');


        /**
         * Check error responses
         *
         * @param {type} data
         * @returns {undefined}
         */
        var error = function(data) {

            var message = null;

            switch(data.code) {
                case 404:
                    /// History Back 2 Views to prevent Webservice 404
                    window.onpopstate = function(e) {
                        window.history.go(-2);
                        e.preventDefault();
                    };
                    $state.go('error');
                    return false;
                    break;
                default:
                    message = 'generic error';
                    break;
            }

            // TODO
            // Show error in screen
            alert(message);

        };

        var removeCached = function() {
            cacheFactory.removeAll();
        };


        /**
         * Make requests to api and manage responses
         *
         * @param object configuration to request
         * @returns Promise
         */
        var makeRequest = function(config) {
            // create promise
            var deferred = $q.defer();
            var cache = null;

            // chache Request
            if (config.cache) {
                cache = cacheFactory.get(config.cache);
            }

            // add domain to relative url
            config.url = URL_SERVICE + config.url;

            if (cache) {
                $log.debug('cache');
                $log.debug(cache);

                deferred.resolve(cache);
            } else {

                // make requests to api
                $http(config)
                    .success(function (data, status, headers, configuration) {
                        $log.debug('[REQUEST ' + status + '] ' + config.method.toUpperCase() + ' ' + config.url);
                        $log.debug(data);

                        if (config.callback) {
                            config.callback(data);
                        }

                        if (config.cache) {
                            cacheFactory.put(config.cache, data);
                        }

                        deferred.resolve(data); // return data to promise
                    })
                    .error(function (data, status, headers, configuration) {
                        $log.error('[REQUEST ERROR ' + status + '] ' + config.method.toUpperCase() + ' ' + config.url);
                        $log.error(data);

                        if (data.code == 11200) {
                            deferred.reject(data);
                            return;
                        }

                        if (config.error == data.code) {
                            deferred.reject(data);
                            return;
                        }

                        error(data, status);
                    });
            }

            return deferred.promise;
        };

        var configuration = function() {
            return makeRequest({method: 'post', url: '/configuration', cache: true});
        };

        /**
         * Public methods
         */
        return {
            configuration: configuration
        };

    }


})();