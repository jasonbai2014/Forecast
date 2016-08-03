
angular.module('skyCastApp').controller('homeController', ['$http', homeController]);

function homeController($http) {
    var homeCtrl = this;
    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    homeCtrl.targetLoc = 'Seattle'; // this is a default location

    homeCtrl.reports = {
        current: {},
        future: [{}, {}, {}, {}, {}, {}, {}]
    }

    homeCtrl.search = function() {
        var loc = homeCtrl.targetLoc;
        console.log('iasfewfwfe');
        if (loc) {
            $http.get('/location?location=' + loc).then(function (response) {
                // This is success callback
                if (response.data.results.length > 0) {
                    var coords = response.data.results[0].geometry.location;
                    homeCtrl.targetLoc = response.data.results[0].formatted_address;
                    searchWeather(coords);
                    homeCtrl.errorOccurred = false;
                } else {
                    // when no location matches, the array size is 0
                    homeCtrl.errorOccurred = true;
                }
            });
        }
    };

    homeCtrl.search(); // initialize the forecast table with weather of the default location

    function searchWeather(coords) {
        $http.get('/weather?lat=' + coords.lat + '&lng=' + coords.lng).then(function (response) {
            // This is success callback
            processCurReport(response.data.currently);
            processFutureReports(response.data.daily.data);
        }, function(response) {
            // This is error callback
            console.log('error');
        });
    };

    function processCurReport(curReport) {
        homeCtrl.reports.current.summary = curReport.summary;
        homeCtrl.reports.current.temp = Math.round(curReport.temperature);
    }

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
    }
};
