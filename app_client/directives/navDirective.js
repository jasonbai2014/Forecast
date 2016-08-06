
angular.module('skyCastApp').directive('navDirective', navDirective);

function navDirective() {
    return {
        restrict: 'E',
        templateUrl: '../templates/nav.html',
        controller: 'navController as navCtrl'
    };
};
