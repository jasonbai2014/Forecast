
angular.module('skyCastApp').controller('signupController', ['accountService', '$location', signupController]);

function signupController (accountService, $location) {
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
            accountService.signup(self.credentials).then(function(response) {
                if (!response) {
                    $location.path('/');
                } else {
                    self.errMessage = response.message;
                }
            });
        }
    };
};

