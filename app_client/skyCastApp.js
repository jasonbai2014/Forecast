

angular.module('skyCastApp', ['ngRoute', 'ui.bootstrap', 'chart.js']);
angular.module('skyCastApp').config(['$routeProvider', '$locationProvider', routeConfig]);

function routeConfig ($routeProvider, $locationProvider) {
    $routeProvider.when('/signin', {
        templateUrl: 'templates/signin.html',
        controller: 'signinController',
        controllerAs: 'signinCtrl'
    });

    $routeProvider.when('/signup', {
        templateUrl: 'templates/signup.html',
        controller: 'signupController',
        controllerAs: 'signupCtrl'
    });

    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'homeController',
        controllerAs: 'homeCtrl'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
};


