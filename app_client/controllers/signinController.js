

angular.module('skyCastApp').controller('signinController', ['accountService', '$location', signinController]);

function signinController(accountService, $location) {
    var self = this;

    self.credentials = {
        username: '',
        password: ''
    }

    self.errMessage = '';

    self.submit = function() {
        if (!self.credentials.username || !self.credentials.password) {
            self.errMessage = 'All fields are required';
        } else {
            accountService.signin(self.credentials).then(function (response) {
                if (!response) {
                    // sign in successfully
                    $location.path('/');
                } else if (response.message) {
                    self.errMessage = response.message;
                } else {
                    self.errMessage = response;
                }
            });
        }
    }
};
