
angular.module('skyCastApp').service('accountService', ['$window', '$http', function($window, $http) {
    var saveJwt = function(token) {
        $window.localStorage['jwt-token'] = token;
    };

    var getJwt = function() {
        return $window.localStorage['jwt-token'];
    };

    var signup = function(user) {
        return $http.post('/signup', user).then(function(data) {
            // success callback
            saveJwt(data.jwt);
            return null
        }, function() {
            // error callback
            return {
                message: "Can't sign up, Please try again"
            }
        });
    };

    var signin = function(user) {
        return $http.post('/signin', user).then(function(data) {
            // success callback
            saveJwt(data.jwt);
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
