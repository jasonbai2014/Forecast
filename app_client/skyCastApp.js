

angular.module('skyCastApp', ['ngRoute']);
angular.module('skyCastApp').config(['$routeProvider', routeConfig]);

function routeConfig ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'homeController',
        controllerAs: 'homeCtrl'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
};


