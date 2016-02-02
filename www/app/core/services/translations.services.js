(function() {
    'use strict';

    angular.module('app.core')
        .factory('TranslationsService', TranslationsService);


    function TranslationsService ($q, $http, $log, $cacheFactory, $rootScope, LANGUAGE_DEFAULT) {

        var cache = $cacheFactory('data');

        var TranslationService = {};

        TranslationService.get = function() {

            var deferred = $q.defer();

            var data = cache.get('translations');

            if (data) {
                deferred.resolve(data);
            } else {
                $http.get('assets/data/translations_'+LANGUAGE_DEFAULT+'.json').then(function(result) {
                    $log.debug(result);

                    $rootScope.translations = result.data;
                    cache.put('translations', result.data);
                    deferred.resolve(result.data);
                });
            }

            return deferred.promise;
        };

        return TranslationService;
    }


})();