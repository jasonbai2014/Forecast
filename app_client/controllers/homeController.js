
angular.module('skyCastApp').controller('homeController', ['$http', '$q', '$scope', 'accountService', 'reportService', homeController]);

function homeController($http, $q, $scope, accountService, reportService) {
    var homeCtrl = this;
    const secInOneDay = 86400; // number of seconds in one day
    const searchRange = 14; // number of days for historical data search
    var coords = null;

    homeCtrl.targetLoc = 'Seattle'; // this is a default location

    homeCtrl.reports = {
        current: {},
        future: [{}, {}, {}, {}, {}, {}, {}]
    };

    homeCtrl.search = function() {
        reportService.searchLoc(homeCtrl.targetLoc).then(function(response) {
            return reportService.searchWeather(response.coords);
        }, function(err) {
            return $q.reject(err)
        }).then(function(response) {
            cloneReports(response);
            homeCtrl.targetLoc = response.formattedAddress;
            homeCtrl.errMessage = '';
        }, function(err) {
            homeCtrl.errMessage = err.error;
        });
    }

    function cloneReports(reports) {
        homeCtrl.reports.current.summary = reports.current.summary;
        homeCtrl.reports.current.temp = reports.current.temp;
        var i, report, reportCopy;

        for (i = 0; i < homeCtrl.reports.future.length; i++) {
            report = reports.future[i];
            reportCopy = homeCtrl.reports.future[i];
            reportCopy.weekday = report.weekday;
            reportCopy.summary = report.summary;
            reportCopy.minTemp = report.minTemp;
            reportCopy.maxTemp = report.maxTemp;
        }
    }

    (function initialize() {
        if (reportService.containsData()) {
            var data = reportService.getReports();
            cloneReports(data);
            homeCtrl.targetLoc = data.formattedAddress;
        } else {
            homeCtrl.search();
        }
    })();

    // the following functions are for the historical data chart
    homeCtrl.showHistoricalData = function() {
        var promises = searchHistoricalData();

        if (promises) {
            $q.all(promises).then(function(responses) {
                var i, historicalData = [];

                for (i = 0; i < responses.length; i++) {
                    historicalData.push(responses[i]);
                }

                processHistoricalData(historicalData);
                drawChart(historicalData);
            });
        }
    };

    function searchHistoricalData() {
        var promises = null;

        if (coords) {
            var curDayInSec = Math.round(Date.now() / 1000);
            historicalData = [];
            var i, minTemp, maxTemp;
            promises = [];

            for (i = 1; i <= searchRange; i++) {
                promises.push($http.get('/weather?lat=' + coords.lat + '&lng=' + coords.lng + '&time=' +
                    (curDayInSec - i * secInOneDay)).then(function (response) {
                    // this is success callback
                    var data = {};
                    data.time = response.data.daily.data[0].time;
                    minTemp = parseInt(response.data.daily.data[0].temperatureMin);
                    maxTemp = parseInt(response.data.daily.data[0].temperatureMax);
                    data.temp = Math.round((minTemp + maxTemp) / 2);
                    //historicalData.push(data);

                    return data;
                }));
            }
        }

        return promises;
    };

    function processHistoricalData(historicalData) {
        // sort time in an ascending order
        historicalData.sort(function(a, b) {
           return a.time - b.time;
        });

        var i, curData, date;
        for (i = 0; i < historicalData.length; i++) {
            curData = historicalData[i];
            date = new Date(curData.time * 1000);
            curData.date = date.getMonth() + 1 + '/' + date.getDate();
        }
    };

    function drawChart(historicalData) {
        var i, labels = [], data = [];

        for (i = 0; i < searchRange; i++) {
            labels.push(historicalData[i].date);
            data.push(historicalData[i].temp);
        }

        $scope.labels = labels;
        $scope.data = [data];
        $scope.series = ['Series A'];

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];

        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        };
    };
};
