angular.module('skyCastApp').directive('canvasDirective', canvasDirective);

function canvasDirective() {
    return {
        restrict: 'E',
        templateUrl: '../templates/canvas.html',
        controller: 'canvasController as canCtrl'
    };
}