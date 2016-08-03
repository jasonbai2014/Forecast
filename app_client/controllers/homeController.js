
angular.module('skyCastApp').controller('homeController', ['$scope', '$http', homeController]);

function homeController($scope, $http) {
    var homeCtrl = this;


    homeCtrl.search = function() {
        homeCtrl.try = homeCtrl.targetLoc;
    };
}