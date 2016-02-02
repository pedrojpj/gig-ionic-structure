(function() {
    'use strict';

    function CoreController() {
        var title = 'Angular Structure';

        angular.extend(this, {
            title: title
        });
    }

    angular.module('app.core')
        .controller('CoreController', CoreController);

})();
