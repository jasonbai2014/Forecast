

angular.module('skyCastApp', ['ngRoute', 'chart.js']);
angular.module('skyCastApp').config(['$routeProvider', '$locationProvider', routeConfig]);

function routeConfig ($routeProvider, $locationProvider) {
    $routeProvider.when('/history', {
        templateUrl: 'templates/history.html',
        controller: 'historyController',
        controllerAs: 'histCtrl'
    });

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


