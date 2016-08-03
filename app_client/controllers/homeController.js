
angular.module('skyCastApp').controller('homeController', ['$http', '$q', '$scope', homeController]);

function homeController($http, $q, $scope) {
    var homeCtrl = this;
    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const secInOneDay = 86400; // number of seconds in one day
    const searchRange = 14 // number of days for historical data search
    var coords = null;

    homeCtrl.targetLoc = 'Seattle'; // this is a default location

    homeCtrl.reports = {
        current: {},
        future: [{}, {}, {}, {}, {}, {}, {}]
    };

    homeCtrl.search = function() {
        var loc = homeCtrl.targetLoc;

        if (loc) {
            $http.get('/location?location=' + loc).then(function (response) {
                // This is success callback
                if (response.data.results.length > 0) {
                    coords = response.data.results[0].geometry.location;
                    homeCtrl.targetLoc = response.data.results[0].formatted_address;
                    searchWeather();
                    homeCtrl.errorOccurred = false;
                } else {
                    // when no location matches, the array size is 0
                    homeCtrl.errorOccurred = true;
                }
            });
        }
    };

    homeCtrl.search(); // initialize the forecast table with weather of the default location

    function searchWeather() {
        if (coords) {
            $http.get('/weather?lat=' + coords.lat + '&lng=' + coords.lng).then(function (response) {
                // This is success callback
                processCurReport(response.data.currently);
                processFutureReports(response.data.daily.data);
            });
        }
    };

    function processCurReport(curReport) {
        homeCtrl.reports.current.summary = curReport.summary;
        homeCtrl.reports.current.temp = Math.round(curReport.temperature);
    };

    function processFutureReports(furReports) {
        var i, date, correctedIdx;
        // the data at index 0 is for current day, don't need to have it in the future reports
        for (i = 1; i < furReports.length; i++) {
            date = new Date(furReports[i].time * 1000);
            correctedIdx = i - 1;
            homeCtrl.reports.future[correctedIdx].weekday = weekdays[date.getDay()];
            homeCtrl.reports.future[correctedIdx].summary = furReports[i].summary;
            homeCtrl.reports.future[correctedIdx].minTemp = Math.max(furReports[i].temperatureMin);
            homeCtrl.reports.future[correctedIdx].maxTemp = Math.max(furReports[i].temperatureMax);
        }
    };


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
