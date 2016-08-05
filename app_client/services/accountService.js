
angular.module('skyCastApp').service('accountService', ['$window', '$http', function($window, $http) {
    var saveJwt = function(token) {
        $window.localStorage['jwt-token'] = token;
    };

    var getJwt = function() {
        return $window.localStorage['jwt-token'];
    };

    var signup = function(user) {
        $http.post('/signup', user).then(function(data) {
            saveJwt(data.jwt);
        });
    };

    var signin = function(user) {
        http.post('/signin', user).then(function(data) {
            saveJwt(data.jwt);
        });
    };

    var signout = function() {
        $window.localStorage.removeItem('jwt-token');
    };

    var getCurUsername = function() {
        var username = null;

        if ($window.localStorage['jwt-token']) {
            var jtw = getJwt();
            var payload = JSON.parse($window.atob(jtw.split('.')[1]));
            username = payload.username;
        }

        return username;
    };

    return {
        saveJwt: saveJwt,
        getJwt: getJwt,
        signup: signup,
        signin: signin,
        signout: signout
    }
}]);
