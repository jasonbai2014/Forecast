
angular.module('skyCastApp').factory('accountService', ['$window', '$http', accountService]);

function accountService($window, $http) {
    var saveJwt = function(token) {
        $window.localStorage['jwt-token'] = token;
    };

    var getJwt = function() {
        return $window.localStorage['jwt-token'];
    };

    var signup = function(user) {
        return $http.post('/signup', user).then(function(data) {
            // success callback
            saveJwt(data.data.jwt);
            return null;
        }, function() {
            // error callback
            return {
                message: "Can't sign up, Please try again"
            };
        });
    };

    var signin = function(user) {
        return $http.post('/signin', user).then(function(data) {
            // success callback
            saveJwt(data.data.jwt);
            return null;
        }, function(data) {
            // error callback
            if (data.data) {
                return data.data;
            } else {
                return data;
            }
        });
    };

    var signout = function() {
        $window.localStorage.removeItem('jwt-token');
    };

    var getCurUsername = function() {
        var username = null;

        if ($window.localStorage['jwt-token']) {
            var jwt = getJwt();
            var payload = JSON.parse($window.atob(jwt.split('.')[1]));
            username = payload.username;
        }

        return username;
    };

    var isLoggedIn = function() {
        return typeof $window.localStorage['jwt-token'] !== 'undefined';
    };

    return {
        saveJwt: saveJwt,
        getJwt: getJwt,
        signup: signup,
        signin: signin,
        signout: signout,
        getCurUsername: getCurUsername,
        isLoggedIn: isLoggedIn
    };
}
