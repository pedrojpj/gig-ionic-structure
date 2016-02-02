(function() {
    'use strict';

    angular.module('app', [
        'ionic',
        'app.core', 'app.home'
    ])

    .run(function($ionicPlatform, $templateCache, TEMPLATE_CACHE) {
        if (!TEMPLATE_CACHE) {
            $templateCache.removeAll();
        }

        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

})();
