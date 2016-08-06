

angular.module('skyCastApp').controller('historyController', ['$http', 'accountService', historyController]);

function historyController($http, accountService) {
    var self = this;
    self.searchHistory = null;

    var config = {headers: {
        Authorization: 'Bearer '+ accountService.getJwt()
    }};

    $http.get('/history', config).then(function(response) {
        self.searchHistory = response.data.queries;
    });
};
