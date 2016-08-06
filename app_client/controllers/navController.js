

angular.module('skyCastApp').controller('navController', ['accountService', '$location', navController]);

function navController(accountService, $location) {
    var self = this;

    self.isLoggedIn = accountService.isLoggedIn();

    if (self.isLoggedIn) {
        self.curUsername = accountService.getCurUsername();
    };

    self.signout = function() {
        accountService.signout();
        self.isLoggedIn = accountService.isLoggedIn();
        $location.path('/');
    };
};