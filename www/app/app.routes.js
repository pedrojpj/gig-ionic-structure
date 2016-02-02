(function() {
    'use strict';

    angular
        .module('app')
        .config(function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('main', {
                    abstract: true,
                    templateUrl: 'app/core/views/main.layout.view.html',
                    resolve: {
                        translations: function(TranslationsService) {
                            return TranslationsService.get()
                        }
                    }
                })

            /// Default Route
            $urlRouterProvider.otherwise('/');

        })

})();
