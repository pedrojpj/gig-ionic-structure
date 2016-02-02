(function() {
    'use strict';

    function HomeController() {
        var title = 'Angular Structure';

        angular.extend(this, {
            title: title
        });
    }

    angular.module('app.home')
        .controller('HomeController', HomeController);

})();
