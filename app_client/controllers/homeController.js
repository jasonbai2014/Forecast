
angular.module('skyCastApp').controller('homeController', ['$rootScope', '$http', '$q', 'reportService',
    'accountService', homeController]);

function homeController($rootScope, $http, $q, reportService, accountService) {
    var self = this;
    self.targetLoc = 'Seattle'; // this is a default location
    self.reports = {
        current: {},
        future: [{}, {}, {}, {}, {}, {}, {}]
    };

    self.search = function() {
        getReports().then(function() {
            // this save a user's valid query into the database
            var config = {headers: {
                Authorization: 'Bearer '+ accountService.getJwt()
            }};

            if (accountService.isLoggedIn()) {
                $http.put('/history/' + self.targetLoc, null, config);
            }

            $rootScope.$broadcast('newSearchEvent');
        });
    };

    function getReports() {
        return reportService.searchLoc(self.targetLoc).then(function(response) {
            return reportService.searchWeather(response.coords);
        }, function(err) {
            return $q.reject(err);
        }).then(function(response) {
            cloneReports(response);
            self.targetLoc = response.formattedAddress;
            self.resolvedLoc = response.formattedAddress;
            self.errMessage = '';
            return response;
        }, function(err) {
            self.errMessage = err.error;
            return $q.reject(err);
        });
    }

    function cloneReports(reports) {
        self.reports.current.summary = reports.current.summary;
        self.reports.current.icon = reports.current.icon;
        self.reports.current.temp = reports.current.temp;
        var i, report, reportCopy;

        for (i = 0; i < self.reports.future.length; i++) {
            report = reports.future[i];
            reportCopy = self.reports.future[i];
            reportCopy.weekday = report.weekday;
            reportCopy.summary = report.summary;
            reportCopy.icon = report.icon;
            reportCopy.minTemp = report.minTemp;
            reportCopy.maxTemp = report.maxTemp;
        }
    };

    (function initialize() {
        if (reportService.containsData()) {
            var data = reportService.getReports();
            cloneReports(data);
            self.targetLoc = data.formattedAddress;
            self.resolvedLoc = data.formattedAddress;
        } else {
            getReports();
        }
    })();
};
